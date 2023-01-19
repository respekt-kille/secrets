require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose =require("mongoose");
const encrypt = require("mongoose-encryption");


const app =express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/secretDB');

const userSchema =new mongoose.Schema({ 
    email:String,
    password:String
  
  });
  
  
  userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"] });

    const UserModel = mongoose.model("user", userSchema);

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});


app.post("/register",(req,res)=>{


    const user2= new UserModel({
        email:req.body.username,
        password:req.body.password
    });

    user2.save((err)=>{
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }

    });
  

});

app.post("/login",(req,res)=>{

    const username = req.body.username;
    const password=req.body.password;

   
   
    UserModel.findOne({email:username},(err, foundUser)=>{
        
if (err) {
    console.log(err);
} else {
    if (foundUser) {
       
        if (foundUser.password ===password) {
           
            res.render("secrets");
        }
    }
}
    
    });
   
});

app.listen(3000,()=>{
    console.log("Server running at port 3000.");
})