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

app.route("/articles").get(function(req, res){
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
}).post(function(req,res){
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
}).delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err)
      res.send("Articles deleted Sucessfuly");
      else
        res.send("An error was occur "+err);
  });
})

/////////////////One Article ////

app.route("/articles/:postId")
.get(function(req, res){
tituloId=quitaEspaciosMayuIdTitle(req.params.postId); // en este caso solamente quitamos espacios
console.log(tituloId);
//buscamos el articulo titleId y lo mostramos
Article.findOne({title: tituloId},function(err, array){
  console.log(array);
  if (array){
        //  console.log(item.content);
        res.send(array);

  }
  else{
      res.send("No se encontraron registros");
  }
  })
})

//Con esta opcion tienes que actualizar todos los registros, en caso de no altualizar un registro este desaparecera
//in this case we updated all register, if you dont set one register, this register disappear
.put(function(req, res){
  Article.replaceOne(
    {title:req.params.postId},
    req.body,
   function(err){
    if (!err){
      res.send("Update Sucessfuly");
    }
    else{
      res.send("An error was occur "+err);
    }
  })
})

// solamente actualiza los campos que requieres. Si no seleccionaste un campo este quedara con el valor que ya tenia
//in this case will update only the register i indicated in the codigo
.patch(function (req, res){
  Article.updateOne(
    {title:req.params.postId},
    {$set: req.body},
    function(err){
      if (!err){
        res.send("Update Sucessfuly");
      }
      else{
        res.send("An error was occur "+err);
      }
    })
})

.delete(function (req, res){
  Article.deleteOne(
    {title:req.params.postId},
    function(err){
      if (!err){
        res.send("Register deleted Sucessfuly");
      }
      else{
        res.send("An error was occur "+err);
      }
    })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

//Sustituye en el titulo espacios en blanco por "-" y tambien quita mayusculas
function quitaEspaciosMayuIdTitle(IdTitle){
  IdTitle=IdTitle.replace(/\s+/g,'-');  //sustituimos espacios en blanco to "-""
  //IdTitle=IdTitle.toLowerCase();  //convertimos el titulo a minusculas
  return IdTitle;
}
