module.exports.getDate=getDate;

function getDate(){
var today=new Date();
var options={day: "numeric",month: "long",weekday: "long"}
var day=today.toLocaleString("en-US",options);
return day;
}
//same above function can be written as
getDate=function(){
var today=new Date();
var options={day: "numeric",month: "long",weekday: "long"}
var day=today.toLocaleString("en-US",options);
return day;
}
//shorter and smater way..we can use exports.gatDay instead of module.exports.getDay and then just bind it to a corrosponding anonymous function
exports.getDay=function(){
  var today=new Date();
  var options={weekday: "long"};
  var day=today.toLocaleString("en-US",options);
  return day;
}
