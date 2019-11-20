'use strict';
const oracledb = require('oracledb');
const { fetchDBConfig } = require("./dbconfig");

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.poolMax = 1;

let config;

const createResponse = (statusCode, message) => ({
  statusCode: statusCode,
  body: JSON.stringify(message),
});

module.exports.inventoryReport = async () => {
  let connection;
  try {
    if (!config) {
      // eslint-disable-next-line require-atomic-updates
      config = await fetchDBConfig();
    }
    connection = await oracledb.getConnection(config);
    const result = await connection.execute("SELECT CLASS class, COUNT(*) count FROM PIN_INVENTORY GROUP BY CLASS ORDER BY CLASS");
    return createResponse(200, {report: result.rows});
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
