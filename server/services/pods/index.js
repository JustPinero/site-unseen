/* DB */
const db = require("../../db");

const getAvailablePods = async () => {
  return await db.query(
    `SELECT * FROM pods WHERE occupied = FALSE`
  ).then(data => data.rows);
}

module.exports = {getAvailablePods};