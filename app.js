//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://admin-damini:test-123@cluster0.jugbm.mongodb.net/dailyjournalDB?retryWrites=true&w=majority",{useNewUrlParser: true})
const postSchema = new mongoose.Schema({title:String,content:String})
const Post = mongoose.model("Post",postSchema)

const homeStartingContent =  "This is a simple blogging web application. Click on the 'COMPOSE' link to create a new post with a title and a body. After you're done composing, click on 'Publish' and you'll be redirected to the home page where a part of it will be displayed. Click on the 'Read More' link beside each post you create, and you'll navigate to the respective post's page with the full post body text shown. While there, click on 'Delete Post' to delete the post and you'll navigate to the home page after the respective post is deleted.";
const aboutContent = "Daily Journal is a simple blogging website, that allow the user to create their blogs, documents, articles, and posts and share them with their friends and family.";
const contactContent = "Wanna say hello? Awesome! I'd love to hear from you."
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// Load the full build.
var _ = require('lodash');

// var posts=[];
app.get("/",(req,res)=>{
  Post.find({}, function(err, posts){

   res.render("home", {

    HOMESTARTINGCONTENT: homeStartingContent,

     posts: posts

     });

 })


})
app.get("/about",(req,res)=>{
  res.render("about",{ABOUTCONTENT:aboutContent})
})
app.get("/contact",(req,res)=>{
  res.render("contact",{CONTACTCONTENT:contactContent})
})
app.get("/compose",(req,res)=>{
  res.render("compose")
})
app.post("/compose",(req,res)=>{
  if(req.body.postTitle.length===0||req.body.postBody.length===0){
    res.redirect("/compose")
  }else{
    const post =new Post({
      title:req.body.postTitle,
      content:req.body.postBody,

    });
    post.save(function(err){
      if(!err){
         res.redirect("/")
      }
  })

}
  })
  // posts.push(post)


app.get("/posts/:postId",(req,res)=>{

  const requestedPostId=req.params.postId
  if(requestedPostId==="home"||requestedPostId==="about"||requestedPostId==="contact"||requestedPostId==="compose"){
    res.redirect("/" + requestedPostId)
  }
  else{

    Post.findOne({_id: requestedPostId}, function(err, post){

       res.render("post", {

         id: post._id,
         title: post.title,

         content: post.content

       });

     });





  }


//   posts.forEach((post)=>{
//     const titleParams= post.title.toLowerCase()
//     if(requestedTitle==titleParams){
//       res.render("post",{POST:post})
//
//     }
//
// })


})
app.post("/delete",(req,res)=>{
  const postToDelete = req.body.delButton
   Post.findByIdAndDelete({_id:postToDelete},(err)=>{
    if(!err){
      res.redirect("/")
    }
  })
})










app.listen(process.env.PORT||3000, function() {
  console.log("Server started on port 3000");
});
