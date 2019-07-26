
// Requires dependencies for web app.
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

// Requires MongoDB for database.
const db = require("./models");

// Assigns Port.
const PORT = 3000;

// Initializes express.
const app = express();

// Middleware
app.use(logger("dev"));
app.use(express.urlencoded({ extened: true }));
app.use(express.json());
app.use(express.static("public"));

// Connects to Mongo DB.
mongoose.connect("mongodb://localhost/webScraper", { useNewUrlParser: true });

// API Routes.
app.get("https://news.developer.nvidia.com/").then(function(res){
    let $ = cheerio.load(res.data);
    $("article a").each(function(i, element) {
        let result = {};
        console.log(result);
    });
});