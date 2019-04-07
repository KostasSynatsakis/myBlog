////////////// MY ART BLOG //////////////////////////////

//////////////// INITIALIZE THE APP /////////////////////

var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOvrride = require("method-override");
    
// configure mongoose for database connection
mongoose.connect("mongodb://localhost:27017/my_art_blog", { useNewUrlParser: true }); 

// configure view to .ejs file type
app.set("view engine", "ejs");

// set the directory "public" for .css .js and styling files
app.use(express.static("public"));

// use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// use method override for PUT / DELETE requests
app.use(methodOvrride("_method"));

// use express sanitizer to prevent user from submitting malicious scripts
app.use(expressSanitizer());

/////////////////////////////////////////////////////////

///////////////// SET THE SCHEMA OF BLOG POSTS //////////

// Schema
var postSchema = new mongoose.Schema({
    title: String,
    image: {type: String, default: "https://images.unsplash.com/photo-1503610594381-aed30c818b8e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=749&q=80"},
    body: String,
    created: {type: Date, default: Date.now}
});

// Model
var Post = mongoose.model("Post", postSchema);

/////////////////////////////////////////////////////////


/////////////////RESTFUL ROUTES //////////////////////////

// CHART
// Index	/dogs		    GET	    List all dogs	                                    Dog.find()
// New	    /dogs/new	    GET	    Show new dog form	                                N/A
// Create	/dogs		    POST	Create a new dog, then redirect somewhere	        Dog.create()
// Show	    /dogs/:id	    GET	    Show info about one specific dog	                Dog.findById()
// Edit	    /dogs/:id/edit  GET	    Show edit form for one dog	                        Dog.findById()
// Update	/dogs/:id	    PUT	    Update particular dog, then redirect somewhere	    Dog.findByIdAndUpdate()
// Destroy	/dogs/:id	    DELETE	Delete a particular dog, then redirect somewhere	Dog.findByIdAndRemove()


// INDEX route

app.get("/", function(req, res){
    res.redirect("/posts");
});

app.get("/posts", function(req, res){
    Post.find({},function(err, posts){
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", {posts: posts});
        }
    });
});

// NEW Route

app.get("/posts/new", function(req, res){
    res.render("new");
});

// CREATE Route

app.post("/posts", function(req, res){
    //sanitize the post body
    req.body.post.body = req.sanitize(req.body.post.body);
    // create post
    Post.create(req.body.post, function(err, newPost){
        if (err){
            res.render("new");
        }
        else {
            //redirect to index 
            res.redirect("/posts");
        }
    });
});

// SHOW Route

app.get("/posts/:id", function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            res.redirect("/posts");
        }
        else {
            res.render("show", {post: foundPost});
        }
    });
});

// EDIT Route

app.get("/posts/:id/edit", function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if (err){
            res.redirect("/posts");
        }
        else {
            res.render("edit", {post: foundPost});
        }
    })
});

// UPDATE Route

app.put("/posts/:id", function(req,res){
    // sanitize the post body
    req.body.post.body = req.sanitize(req.body.post.body);
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, editedPost){
        if (err){
            res.redirect("/posts");
        }
        else {
            res.redirect("/posts/"+req.params.id);
        }
    });
});

// DESTROY Route

app.delete("/posts/:id", function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/posts/");
        }
        else {
            res.redirect("/posts");
        }
    });
});


/////////////////////////////////////////////////////////

///////////////// SET THE SERVER TO LISTEN //////////////

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started");
});