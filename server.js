
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

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connects to Mongo DB.
mongoose.connect("mongodb://localhost/webScraper", { useNewUrlParser: true });


// API Routes.
// app.get("/", function(req, res){
//     res.render("index");
// });

app.get("/scrape" , function(req, res) {
    axios.get("https://news.developer.nvidia.com/").then(function(response){
    let $ = cheerio.load(response.data);
    $("article h1").each(function(i, element) {
        let result = {};
        result.title = $(this)
            .children("a")
            .text();
        result.link = $(this)
            .children("a")
            .attr("href");
        // res.send(result);

        db.Article.create(result).then(function(dbArticle) {
            console.log(dbArticle);
        })
        .catch(function(err) {
            console.log(err);
        });

    });
    });
});


app.get("/", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});


app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });



res.render("index");
// Starts server.
app.listen(PORT, function() {
    console.log( `
    *******************************

    App running on PORT ` + PORT + `

    *******************************
    `);
});