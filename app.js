const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js')

const app = express();

// var ni = "";


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/itemsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const itemsSchema = {
  name: String
} //schema making
const Item = mongoose.model("Item", itemsSchema); //model making
const item1 = new Item({
  name: "Welcome"
}); //document 1 making
const item2 = new Item({
  name: "You're doing great"
}); //document 2 making
const item3 = new Item({
  name: "Keep up the good work"
}); //document 3 making
const defaultItems = [item1,item2,item3]; //document array making
var deleteItems=[];


app.get("/", function(req, res) {

  var day = date.getDay();
  Item.find({},function(err,foundItems){
    if(err){
      console.log(err);
    }
    else{
      if(foundItems.length===0){
        Item.insertMany(defaultItems,function(err){
          if(err){
            console.log(err);
          }
          else{
            console.log("Default Items succesfully added to the database itemsDB");
          }
          res.redirect("/");
        });
      }
      else{
        res.render("list", {
             kindOfDay: day,
             itemsArray: foundItems,
             deleteItemsArray: deleteItems
           });
      }
    }
  });

});

app.get("/about", function(req, res) {
  res.render("about");
})

app.post("/", function(req, res) {
  // console.log(req.body);
  const itemName = req.body.newItem; //ni=new item
  const newItemDoc= new Item({
    name: itemName
  });
  newItemDoc.save();
  // console.log(ni);
  res.redirect("/");
})

app.post("/delete",function(req,res){
  console.log(req.body.checkedBox);
  const toDeleteId=req.body.checkedBox;
  if(!deleteItems.includes(toDeleteId)){
    deleteItems.push(toDeleteId);
  }
  // Item.findByIdAndRemove( toDeleteId,function(err){
  //   if(err){
  //     console.log(err);
  //   }
  //   else{
  //     console.log("Item Deleted");
  //   }
  // });
  res.redirect("/");
})

app.listen(3000, function() {
  console.log("Server up and Running at Port 3000");
})
