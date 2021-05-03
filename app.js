const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js')
const _=require("lodash")
const app = express();

// var ni = "";


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://bhaskar942:bhaskar0002@cluster0.wqkwh.mongodb.net/itemsDB", {
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

const listSchema={
  name: String,
  items: [itemsSchema]
};
const List=mongoose.model("List",listSchema);



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
             itemsArray: foundItems
           });
      }
    }
  });

});

app.get("/:customListName",function(req,res){
  const customListName=_.capitalize(req.params.customListName);
  console.log(customListName);
  List.findOne({name: customListName},function(err,foundList){
    if(err){
      console.log(err);
    }
    else{
      // console.log(foundList);
      if(!foundList){
        console.log("Doesn't Exists!");//so create a new list
        const newList= new List({
          name: customListName,
          items: defaultItems
        });
        // console.log("new item created");
        // const redTo="/"+customListName;
        newList.save();
        // console.log("and saved");
        res.redirect("/"+customListName);
      }
      else{
        console.log("Exists!");//show an existing list
        res.render("list",{kindOfDay: foundList.name, itemsArray: foundList.items});
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
  const list=req.body.list;
  const newItemDoc= new Item({
    name: itemName
  });

  if(list===date.getDay()){
    newItemDoc.save();
    res.redirect("/");
  }
  else{
    List.findOne({name: list},function(err,foundList){
      if(err){
        console.log(err);
      }
      else{
        foundList.items.push(newItemDoc);
        foundList.save();
        res.redirect("/"+list);
      }
    })
  }


})

app.post("/delete",function(req,res){
  console.log(req.body);
  const toDeleteId=req.body.checkedBox;
  const list=req.body.list;

  if(list===date.getDay()){
    Item.findByIdAndRemove( toDeleteId,function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("Item Deleted");
      }
    });
    res.redirect("/");
  }
  else{
    List.findOneAndUpdate({name: list},{$pull: {items: {_id: toDeleteId}}},function(err,foundList){
      if(err){
        console.log(err);
      }
      else{
        res.redirect("/"+list);
      }
    })
  }



})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server up succesfully");
})
