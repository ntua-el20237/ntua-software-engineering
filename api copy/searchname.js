const express = require('express');
const router = express.Router();
const pool = require('../back-end/connect');

router.get("/searchname", function(req, res) {
  const { namePart } = req.body;

  if (!namePart) {
    return res.status(400).json({ status: "failed", error: "Missing namePart in the request body" });
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
        WHERE a.primaryName LIKE ?
        GROUP BY a.personal_id
      `;

      connection.query(query, [`%${namePart}%`], function(err, results) {
        connection.release();

        if (err) {
          res.status(500).json({ status: "failed", error: err.message });
          console.error("Error executing query", err);
        } else {
          if (results.length > 0) {
            // Transform the data to match the specified response structure
            const nameObjects = results.map((result) => ({
              nameID: result.nameID,
              name: result.name,
              namePoster: result.namePoster,
              birthYr: result.birthYear,
              deathYr: result.deathYear,
              profession: result.profession,
              nameTitles: JSON.parse(result.nameTitles),
            }));

            res.status(200).json({ status: "success", data: nameObjects });
          } else {
            res.status(404).json({ status: "not found", message: "No matching names found" });
          }
        }
      });
    }
  });
});

module.exports = router;

