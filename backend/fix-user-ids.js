// fix-user-ids.js - Fix userId/id mismatches in Users table
require('dotenv').config();
const { dynamo } = require('./config/aws');

async function fixUserIds() {
  console.log('=== FIXING USER ID MISMATCHES ===\n');

  const USERS_TABLE = process.env.DYNAMO_USER_TABLE;

  try {
    // Get all users
    const result = await dynamo.scan({
      TableName: USERS_TABLE
    }).promise();

    console.log(`Found ${result.Items?.length || 0} users\n`);

    let fixedCount = 0;

    for (const user of result.Items || []) {
      // Check if id field exists and is different from userId
      if (user.id && user.id !== user.userId) {
        console.log(`Fixing user: ${user.name} (${user.email})`);
        console.log(`  Current userId: ${user.userId}`);
        console.log(`  Current id: ${user.id}`);
        
        // Update the id field to match userId
        await dynamo.update({
          TableName: USERS_TABLE,
          Key: {
            userId: user.userId
          },
          UpdateExpression: 'SET id = :id',
          ExpressionAttributeValues: {
            ':id': user.userId  // Make id same as userId
          }
        }).promise();

        console.log(`  ✅ Updated id to: ${user.userId}\n`);
        fixedCount++;
      } else if (!user.id) {
        console.log(`Adding id field to user: ${user.name} (${user.email})`);
        
        // Add id field if it doesn't exist
        await dynamo.update({
          TableName: USERS_TABLE,
          Key: {
            userId: user.userId
          },
          UpdateExpression: 'SET id = :id',
          ExpressionAttributeValues: {
            ':id': user.userId
          }
        }).promise();

        console.log(`  ✅ Added id field: ${user.userId}\n`);
        fixedCount++;
      } else {
        console.log(`✓ User OK: ${user.name} (id matches userId)\n`);
      }
    }

    console.log('\n=== SUMMARY ===');
    console.log(`Total users: ${result.Items?.length || 0}`);
    console.log(`Fixed: ${fixedCount}`);
    console.log(`Already correct: ${(result.Items?.length || 0) - fixedCount}`);

    if (fixedCount > 0) {
      console.log('\n⚠️  IMPORTANT: Users need to log out and log back in for changes to take effect!');
      console.log('   (This will generate new JWT tokens with the correct user ID)');
    }

  } catch (err) {
    console.error('Error:', err);
  }

  console.log('\n=== FIX COMPLETE ===');
}

fixUserIds().catch(console.error);