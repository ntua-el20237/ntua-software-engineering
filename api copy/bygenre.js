const express = require('express');
const router = express.Router();
const pool = require('../back-end/connect');

router.get("/bygenre", function(req, res) {
  const { qgenre, minrating, yrFrom, yrTo } = req.body;

  if (!qgenre || !minrating) {
    return res.status(400).json({ status: "failed", error: "Missing required parameters in the request body" });
  }

  const queryParams = [qgenre, minrating];
  let queryConditions = 'genres LIKE ? AND rating.avRating >= ?';

  if (yrFrom && yrTo) {
    queryConditions += ' AND startYear >= ? AND startYear <= ?';
    queryParams.push(yrFrom, yrTo);
  }

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
          JSON_OBJECT('avRating', r.averageRating, 'nVotes', r.numVotes) as rating
        FROM movies_basics mb
        INNER JOIN movies_akas ma1 ON ma1.title_id = mb.title_id
        INNER JOIN movies_akas ma2 ON ma2.title_id = mb.title_id
        INNER JOIN ratings r ON r.title_id = mb.title_id
        INNER JOIN principals p ON p.title_id = mb.title_id
        INNER JOIN actors a ON p.personal_id = a.personal_id
        WHERE ${queryConditions}
        GROUP BY mb.title_id
      `;

      connection.query(query, queryParams, function(err, results) {
        connection.release();

        if (err) {
          res.status(500).json({ status: "failed", error: err.message });
          console.error("Error executing query", err);
        } else {
          if (results.length > 0) {
            // Transform the data to match the specified response structure
            const titleObjects = results.map((result) => ({
              titleID: result.titleID,
              type: result.type,
              originalTitle: result.originalTitle,
              titlePoster: result.titlePoster,
              startYear: result.startYear,
              endYear: result.endYear,
              genres: JSON.parse(result.genres),
              titleAkas: JSON.parse(result.titleAkas),
              principals: JSON.parse(result.principals),
              rating: JSON.parse(result.rating),
            }));

            res.status(200).json({ status: "success", data: titleObjects });
          } else {
            res.status(404).json({ status: "not found", message: "No matching titles found" });
          }
        }
      });
    }
  });
});

module.exports = router;

