const path = require('path');
const express = require('express');
const router = express.Router();
const pool = require('../back-end/connect');

router.get("/:titleID", function(req, res) {
  const { titleID } = req.params; 

  pool.getConnection(function(err, connection) {
    if (err) {
      res.status(500).json({ status: "failed", error: err.message });
      console.error("Error establishing connection", err);
    } else {
      const query = `
        SELECT 
          mb.title_id as titleID,
          mb.titleType as type,
          mb.originalTitle,
          mb.img_url_asset as titlePoster,
          mb.startYear,
          mb.endYear,
          JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT('genreTitle', ma2.title))) as genres,
          JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT('akaTitle', ma1.title, 'regionAbbrev', ma1.region))) as titleAkas,
          JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT('nameID', p.personal_id, 'name', a.primaryName, 'category', p.category))) as principals,
          JSON_OBJECT('avRating', MAX(r.averageRating), 'nVotes', MAX(r.numVotes)) as rating
        FROM movies_basics mb
        INNER JOIN movies_akas ma1 ON ma1.title_id = mb.title_id
        INNER JOIN movies_akas ma2 ON ma2.title_id = mb.title_id
        INNER JOIN ratings r ON r.title_id = mb.title_id
        INNER JOIN principals p ON p.title_id = mb.title_id
        INNER JOIN actors a ON p.personal_id = a.personal_id
        WHERE mb.title_id LIKE ?
        GROUP BY mb.title_id
      `;

      connection.query(query, [titleID], function(err, results) {
        connection.release();

        if (err) {
          res.status(500).json({ status: "failed", error: err.message });
          console.error("Error executing query", err);
        } else {
          if (results.length > 0) {
            // Transform the data to match the specified response structure
            const titleObject = {
              titleID: results[0].titleID,
              type: results[0].type,
              originalTitle: results[0].originalTitle,
              titlePoster: results[0].titlePoster,
              startYear: results[0].startYear,
              endYear: results[0].endYear,
              genres: JSON.parse(results[0].genres),
              titleAkas: JSON.parse(results[0].titleAkas),
              principals: JSON.parse(results[0].principals),
              rating: JSON.parse(results[0].rating),
            };

            res.status(200).json({ status: "success", data: titleObject });
          } else {
            res.status(404).json({ status: "not found", message: "Movie not found" });
          }
        }
      });
    }
  });
});

module.exports = router;