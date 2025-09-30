import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
  host: 'sqlXXX.epizy.com',              // your InfinityFree MySQL host
  user: 'if0_40059353',                  // your database username
  password: 'shakee2003',              // your database password
  database: 'if0_40059353_into_the_land', // your actual database name
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
});


export default db;
