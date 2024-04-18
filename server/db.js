const Pool = require("pg").Pool;

var DBURL = process.env.DBURL

const pool = new Pool({
    DBURL,
});

module.exports = pool;