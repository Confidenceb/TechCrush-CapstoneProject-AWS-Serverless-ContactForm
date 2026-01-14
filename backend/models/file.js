const { dynamo } = require('../config/aws');

const FILES_TABLE = process.env.DYNAMO_FILE_TABLE;

const saveFileMetadata = async (fileMetadata) => {
  const params = {
    TableName: FILES_TABLE,
    Item: fileMetadata
  };

  await dynamo.put(params).promise();
  return fileMetadata;
};

const getFileById = async (userId, fileId) => {
  const params = {
    TableName: FILES_TABLE,
    Key: {
      userId: String(userId),
      id: fileId
    }
  };

  const result = await dynamo.get(params).promise();
  return result.Item;
};

const deleteFileMetadata = async (userId, fileId) => {
  const params = {
    TableName: FILES_TABLE,
    Key: {
      userId: String(userId),
      id: fileId
    }
  };

  await dynamo.delete(params).promise();
};

const getUserFiles = async (userId) => {
  const params = {
    TableName: FILES_TABLE,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': String(userId)
    }
  };

  const result = await dynamo.query(params).promise();
  return result.Items || [];
};

module.exports = {
  saveFileMetadata,
  getFileById,
  deleteFileMetadata,
  getUserFiles
};