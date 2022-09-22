//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Connection URL
//const url ='mongodb://localhost:27017/wikiDB';
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});

const articleSchema={
  title:String,
  content:String
};

const Article=mongoose.model("Article",articleSchema);

//TODO

app.get("/", function(req, res){
  console.log("Estoy aqui");
  Article.find(function(err,articles){
    if(articles===0){
      console.log("No hay registros");
    }
    if(err){
      console.log("An error was occur");
    }
    else {
      console.log("These are the articles "+articles);
      res.send(articles);
    }
  });
});

app.post("/articles",function(req,res){
  console.log(req.body.title);
  console.log(req.body.content);

  newArticle= new Article({
      title: req.body.title,
      content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Sucessfuly added a new article");
    }
    else{
      res.send("An err was occur "+err);
    }

  });
});

app.delete("/articles",function(req, res){
  Article.deleteMany(function(err){
    if(!err)
      res.send("Articles deleted Sucessfuly");
      else
        res.send("An error was occur "+err);
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
