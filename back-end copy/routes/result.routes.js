const path = require('path');
const express = require('express');
const router = express.Router();
const pool = require('../connect');

router.get("/", function(req, res) {
  const { title_id } = req.query; 

  pool.getConnection(function(err, connection) {
    if (err) {
      res.status(500).json({ status: "failed", error: err.message });
      console.error("Error establishing connection", err);
    } else {
      const query = `SELECT 
                        mb.title_id, 
                        mb.originalTitle, 
                        mb.img_url_asset, 
                        mb.startYear, 
                        mb.endYear,
                        mb.genres,
                        mb.runtimeMinutes,
                        r.averageRating AS rating
                    FROM movies_basics mb
                    INNER JOIN ratings r ON r.title_id = mb.title_id
                    WHERE mb.title_id = ? `;

      connection.query(query, [title_id], function(err, results) { 
        connection.release();

        if (err) {
          res.status(500).json({ status: "failed", error: err.message });
          console.error("Error executing query", err);
        } else {
          if (results.length > 0) {
            res.render(path.join(__dirname, '../..') + "/front-end/templates/result.html", { result: results[0] });
          } else {
            res.status(404).json({ status: "not found", message: "result: Movie not found" });
          }
        }
      });
    }
  });
});

module.exports = router;
