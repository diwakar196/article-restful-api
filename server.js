const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB"), {useNewUrlParser: true};

const articleSchema = {
    title: String,
    content: String
};
const Article = mongoose.model("Article", articleSchema);


app.route("/wikis")

.get(function(req, res){
    Article.find(function(err, foundArticles){
        if(err) res.send(err);
        else res.send(foundArticles);
    })
})

.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if(err) res.send(err);
        else res.send("Successfully added a new article");
    })
})

.delete(function(req, res){
    Article.deleteMany(function(err){
        if(err) res.send(err);
        else res.send("Deleted successfully");
    })
})

app.route("/wikis/:wikiTitle")

.get(function(req, res){
    Article.findOne({title: req.params.wikiTitle}, function(err, foundArticle){
        if(foundArticle) res.send(foundArticle);
        else res.send("Not found");
    });
})

.put(function(req, res){
    Article.updateOne(
        {title: req.params.wikiTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err) res.send("Updated successfully")
        }
    );
})

.patch(function(req, res){
    Article.updateOne(
        {title: req.params.wikiTitle},
        {$set: req.body},
        function(err){
            if(err) res.send(err);
            else res.send("Updated successfully");
        }
    );
})

.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.wikiTitle},
        function(err){
            if(err) res.send(err);
            else res.send("Deleted successfully");
        }
    );
});

app.listen(3000, () => {
    console.log("Server started Successfully");
});

