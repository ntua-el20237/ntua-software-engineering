const express = require('express');
const router = express.Router();
const pool = require('../../back-end/connect');

router.get('/', (req, res) => {
	res.send('GET request to resetall endpoint');
});

router.post('/', (req, res) => { 
  pool.getConnection((err, connection) => {
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
      let completedOperations = 0;

      truncateTables.forEach(table => {
        connection.query(`TRUNCATE TABLE ${table}`, function (err) {
          if (err) {
            failedOperation = true;
            console.log(`Table ${table} is not truncated`, err);
          } else {
            console.log(`Table ${table} truncated`);
          }

          completedOperations++;

          if (completedOperations === truncateTables.length) {
            if (failedOperation) {
              res.status(500).json({ status: "failed" });
            } else {
              res.status(200).json({ status: "OK" });
            }
            connection.release();
          }
        });
      });
    }
  });
});

module.exports = router;