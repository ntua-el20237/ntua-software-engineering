const express = require('express');
const router = express.Router();
const pool = require('../back-end/connect');

router.get("/name/:nameID", function(req, res) {
  const { nameID } = req.params;

  if (!nameID) {
    return res.status(400).json({ status: "failed", error: "Missing nameID parameter in the request URL" });
  }

  pool.getConnection(function(err, connection) {
    if (err) {
      res.status(500).json({ status: "failed", error: err.message });
      console.error("Error establishing connection", err);
    } else {
      const query = `
        SELECT 
          a.personal_id as nameID,
          a.primaryName as name,
          a.img_url_asset as namePoster,
          a.birthYear,
          a.deathYear,
          a.primaryProfession as profession,
          JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT('titleID', mb.title_id, 'category', p.category))) as nameTitles
        FROM actors a
        INNER JOIN principals p ON a.personal_id = p.personal_id
        INNER JOIN movies_basics mb ON mb.title_id = p.title_id
        WHERE a.personal_id = ?
        GROUP BY a.personal_id
      `;

      connection.query(query, [nameID], function(err, results) {
        connection.release();

        if (err) {
          res.status(500).json({ status: "failed", error: err.message });
          console.error("Error executing query", err);
        } else {
          if (results.length > 0) {
            // Transform the data to match the specified response structure
            const nameObject = {
              nameID: results[0].nameID,
              name: results[0].name,
              namePoster: results[0].namePoster,
              birthYr: results[0].birthYear,
              deathYr: results[0].deathYear,
              profession: results[0].profession,
              nameTitles: JSON.parse(results[0].nameTitles),
            };

            res.status(200).json({ status: "success", data: nameObject });
          } else {
            res.status(404).json({ status: "not found", message: "Name not found" });
          }
        }
      });
    }
  });
});

module.exports = router;

