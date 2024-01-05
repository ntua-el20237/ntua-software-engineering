const express = require('express');
const router = express.Router();
const pool = require('../connect');
const path = require('path');

router.get("/", function(req, res) {
  res.render(path.join(__dirname, '../../front-end/templates/home.html'));
});

router.post("/search", function(req, res) {
  const movieTitle = req.body.movie_title; 

  pool.getConnection(function(err, connection) {
    if (err) {
      res.status(500).json({ status: "failed", error: err.message });
      console.error("Error establishing connection", err);
    } else {
      const query = `SELECT * FROM movies_basics WHERE primaryTitle = ?`;
	  
      connection.query(query, [movieTitle], function(err, results) {
        connection.release();

        if (err) {
          res.status(500).json({ status: "failed", error: err.message });
          console.error("Error executing query", err);
        } else {
          if (results.length > 0) {
			      const title_id=results[0].title_id
            res.redirect(`/result?title_id=${title_id}`);
          } else {
            res.status(404).json({ status: "not found", message: "home: Movie not found" });
          }
        }
      });
    }
  });
});

module.exports = router;