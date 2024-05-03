const Pool = require("pg").Pool;
require('dotenv').config() // to use .env variables
const connectionString = process.env.DATABASE_URL

const pool = new Pool({connectionString,
});

module.exports = {
    query: (queryText, params, callback)=>{
        return pool.query(queryText, params, callback)
    }
};