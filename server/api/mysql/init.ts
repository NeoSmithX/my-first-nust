// db.js
import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mypassword',
  database: 'test001'
});

export default connection;
