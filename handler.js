'use strict';
const oracledb = require('oracledb');
const config = require("./dbconfig");

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.poolMax = 1;

module.exports.hello = async () => {
  let connection;
  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute("SELECT CLASS class, COUNT(*) count FROM PIN_INVENTORY GROUP BY CLASS ORDER BY CLASS");
    return {
      statusCode: 200,
      body: JSON.stringify(result.rows),
    };
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
};
