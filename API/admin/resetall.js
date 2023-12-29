const express = require('express');
const router = express.Router();
const fs = require('fs');
const mysql = require('mysql');
const pool = require('../../backend/connect');

// Read SQL files
const sqlFiles = [
  '../database/data/INSERT_DATA/truncated_title_basics.sql',
  '../database/data/INSERT_DATA/truncated_name_basics.sql',
  '../database/data/INSERT_DATA/truncated_title_akas.sql',
  '../database/data/INSERT_DATA/truncated_title_principals.sql',
  '../database/data/INSERT_DATA/truncated_title_crew.sql',
  '../database/data/INSERT_DATA/truncated_title_ratings.sql',
  '../database/data/INSERT_DATA/truncated_title_episode.sql'
];

router.get('/', function(req, res) {
  pool.getConnection(function(err, connection) {
    if (err) {
      res.status(500).json({ status: "failed" });
      console.log("Connection failed", err);
      connection.release();
    } else {
      const truncateTables = [
        'actors',
        'movies_akas',
        'movies_basics',
        'crew',
        'series',
        'principals',
        'ratings'
      ];

      let failedOperation = false;

      truncateTables.forEach(table => {
        connection.query(`TRUNCATE TABLE ${table}`, function (err) {
          if (err) {
            failedOperation = true;
            console.log(`table ${table} is not truncated`, err);
          } else {
            console.log(`table ${table} truncated`);
          }
        });
      });

      sqlFiles.forEach((sqlFile, index) => {
        const sql = fs.readFileSync(sqlFile).toString();
        connection.query(sql, function(err) {
          if (err) {
            failedOperation = true;
            console.log(`Table ${index + 1} not reset`, err);
          } else {
            console.log(`Table ${index + 1} reset`);
            
          }
        });
      });

      // Send response after all operations are complete
      if (failedOperation) {
        res.status(500).json({ status: "failed" });
      } else {
        res.status(200).json({ status: "OK" });
      }

      connection.release();
    }
  });
});

module.exports = router;
