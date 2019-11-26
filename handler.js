'use strict';
const oracledb = require('oracledb');
const dbconfig = require('./vault/client');
const { checkToken } = require('./auth/client');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.poolMax = 1;

let config;

const createResponse = (statusCode, message) => ({
  statusCode: statusCode,
  body: JSON.stringify(message),
});

const validateToken = async (event) => {
  if (!event.queryStringParameters || !event.queryStringParameters.token) {
    const missingTokenMsg = 'Missing token parameter';
    console.error(missingTokenMsg);
    return createResponse(400, missingTokenMsg);
  }
  try {
    await checkToken(event.queryStringParameters.token);
  } catch (error) {
    return createResponse(401, error.message);
  }
}

module.exports.inventoryReport = async (event) => {
  const validationErrorResponse = await validateToken(event);
  if (validationErrorResponse) {
    return validationErrorResponse;
  }

  let connection;
  try {
    if (!config) {
      // eslint-disable-next-line require-atomic-updates
      config = await dbconfig;
    }
    connection = await oracledb.getConnection(config);
    const result = await connection.execute("SELECT CLASS class, COUNT(*) count FROM PIN_INVENTORY GROUP BY CLASS ORDER BY CLASS");
    return createResponse(200, { report: result.rows });
  } catch (err) {
    console.error(err.message);
    return createResponse(500, err.message)
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err.message);
      }
    }
  }
};
