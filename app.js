const express = require('express');
const bodyParser = require('body-parser');

const app = express();
var todoList = ["Use Todo App", "Star my Github Repo", "PR for any issue"];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
	const date = new Date();
	const  options = {weekday:'long', day:"numeric", month:"long"};
	const day = date.toLocaleDateString("en-US",options);
	res.render("list",{htmlDay:day, htmlTodoList:todoList});

});

app.post("/",(req,res)=>{
	todoList.push(req.body.newTodo);
	res.redirect("/");
});
app.listen(process.env.PORT || 3000, ()=>{
	console.log(`Server is up and Running `);
});
	
