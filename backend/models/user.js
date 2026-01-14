const { dynamo } = require('../config/aws');
const TABLE_NAME = process.env.DYNAMO_USER_TABLE;

async function createUser(user) {
  console.log('CREATE USER PAYLOAD:', user);
  const params = {
    TableName: TABLE_NAME,
    Item: {
      ...user,
      avatar: user.avatar || null // Add avatar field (null by default)
    }
  };
  return dynamo.put(params).promise();
}

async function getUserByEmail(email) {
  const params = {
    TableName: TABLE_NAME,
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  };

  const result = await dynamo.query(params).promise();
  return result.Items[0];
}

async function updateUser(userId, updates) {
  // Build update expression dynamically
  const updateExpressions = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  Object.keys(updates).forEach((key, index) => {
    updateExpressions.push(`#field${index} = :value${index}`);
    expressionAttributeNames[`#field${index}`] = key;
    expressionAttributeValues[`:value${index}`] = updates[key];
  });

  const params = {
    TableName: TABLE_NAME,
    Key: {
      userId: userId
    },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  };

  const result = await dynamo.update(params).promise();
  return result.Attributes;
}

module.exports = { 
  createUser, 
  getUserByEmail,
  updateUser 
};