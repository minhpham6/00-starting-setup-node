const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'minh',
    database: 'node-complete',
    password: 'minh123'
});

module.exports = pool.promise();