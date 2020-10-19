const express = require('express');
const bodyParser = require('body-parser');

const app = express();
let todoList = ["Use Todo App", "Star my Github Repo", "PR for any issue"];
let	workTodoList = []; 

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// root route
app.get("/",(req,res)=>{
	const date = new Date();
	const  options = {weekday:'long', day:"numeric", month:"long"};
	const day = date.toLocaleDateString("en-US",options);
	res.render("list",{htmlListTitle:day, htmlTodoList:todoList});

});

app.post("/",(req,res)=>{
	// console.log(req.body);	
	const newTodoItem = req.body.newTodo;

	if(req.body.addTodobutton==='Work'){
		workTodoList.push(newTodoItem);
		res.redirect("/work");
	}
	else{		
		todoList.push(newTodoItem);
		res.redirect("/");
	}
});

// work route
app.get("/work",(req,res)=>{
	res.render("list",{htmlListTitle:"Work List", htmlTodoList:workTodoList});
});

// about route
app.get("/about",(req,res)=>{
	res.render("about");
});



app.listen(process.env.PORT || 3000, ()=>{
	console.log(`Server is up and Running `);
});
	
