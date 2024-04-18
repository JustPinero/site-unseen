const Pool = require("pg").Pool;
require('dotenv').config() // to use .env variables
var DBURL = process.env.DBURL

// const pool = new Pool({

//         user: 'postgres',
//         host: '127.0.0.1', // LOCAL HOST - note: 127.0.0.1 true local host translated in your /etc/hosts (a file that exists on your system and does main name translation for you)
//         database: 'site_unseen',
//         password: 'PassWordle101!',
//         port: 5432,
// })

const pool = new Pool({
    DBURL,
});

module.exports = pool;