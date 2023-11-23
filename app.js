const express=require("express");
require('dotenv').config();
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require('mongoose');
const app=express();
const encrypt=require("mongoose-encryption");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err=>console.log(err));

async function main(){
await mongoose.connect('mongodb://127.0.0.1:27017/userDB'); // making database
const userSchema =new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(encrypt,{secret:process.env.secret,encryptedFields:["password"]});
const User =new mongoose.model('User',userSchema);
app.get('/',function(req,res)
{
    res.render("home.ejs");
})
app.get('/login',function(req,res)
{
    res.render("login.ejs");
})
app.get('/register',function(req,res)
{
    res.render("register.ejs");
})
app.post('/register', async function(req,res)
{
  const Email=req.body.username;
  const Password=req.body.password;
  const newUser=new User({
     email:Email,
     password:Password
  })
  const FindUser=await User.findOne({email:Email});
  if(FindUser!=null)
  {
    console.log("user already exsist");
  }
  else{
     await newUser.save(); //use save() method instead of insert to get the encryption
    res.render("secrets.ejs");
    
  }
}
);
app.post("/login", async function(req,res)
{
   const userName=req.body.username;
   const password=req.body.password;
   const findUser=await User.findOne({email:userName})
   if(findUser==null)
   {
    console.log("No user found , You need to register first !");
   }
   else {
    if(findUser.password===password)
    {
        res.render("secrets.ejs");

    }
    else{
        console.log("wrong cridentials");

    }
   }
});
app.listen(3000,function(){
    console.log("server is activated at the port number 3000");
})
}