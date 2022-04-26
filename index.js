const express = require("express");
const cors = require("cors");
const app = express();
const animeRouter = require("./anime-api.js");
const romsScraper = require("./roms-scraper.js");
const movieRouter = require("./movie-api.js");
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());

app.use('/anime',animeRouter);
app.use('/roms',romsScraper);
app.use('/movie',movieRouter);
app.listen(PORT, () => console.log("running on "+PORT));
