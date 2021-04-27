const express=require('express');
const bodyParser=require('body-parser');
const date=require(__dirname+'/date.js')

const app=express();

var ni="";
var items=[ "Welcome","Hit + to Add", "Check the checkbox to Delete"]
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  var day=date.getDay();
  res.render("list",{kindOfDay: day,itemsArray: items});
})

app.get("/about",function(req,res){
  res.render("about");
})

app.post("/",function(req,res){
  console.log(req.body);
  ni=req.body.newItem;//ni=new item
  items.push(ni);
  // console.log(ni);
  res.redirect("/");
})

app.listen(3000,function(){
  console.log("Server up and Running at Port 3000");
})
