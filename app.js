const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
let	workTodoList = []; 

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// mongoDB Url
const dbConnectionUrl = 'mongodb://localhost:27017/ejsTodoListDB';
// mongoose connection
mongoose.connect(dbConnectionUrl, {useNewUrlParser:true,useUnifiedTopology:true, useFindAndModify:false});

// db collection schema
const itemSchema = {
	todoThing:{type:String, requried:true}
}
// collection model
const TodoItem = mongoose.model("TodoItem", itemSchema);
// default todo items
const TodoItem1 = new TodoItem({
	todoThing:"Use Todo App"
});
const TodoItem2 = new TodoItem({
	todoThing:"Star my Github Repo"
});
const TodoItem3 = new TodoItem({
	todoThing:"PR for any issue"
});

// default todo List
const defaultTodoItems  = [TodoItem1, TodoItem2, TodoItem3];
// // push them into DB
// TodoItem.insertMany(defaultTodoItems,(err)=>{
// 	err ? console.log(err) : console.log("Insertion Success.");
// });

// root route
app.get("/",(req,res)=>{
	// Todo List Header
	const date = new Date();
	const  options = {weekday:'long', day:"numeric", month:"long"};
	const day = date.toLocaleDateString("en-US",options);
	// Get Todo List items
	TodoItem.find({},(err,dbResult)=>{
		 if(dbResult.length === 0){
			TodoItem.insertMany(defaultTodoItems,(err)=>{
				if(err) 
					console.log(err); 
				else 
					console.log("Insertion Success.");
			});
			res.redirect("/");
		}
		else{ 
			res.render("list",{htmlListTitle:day, htmlTodoList:dbResult});
		}
	})
	// render ejs page
	

});

app.post("/",(req,res)=>{
	// console.log(req.body);	
	const newTodo = req.body.newTodo;
	// push new todo into db
	// create new todo item document
	const newTodoItem = new TodoItem({ todoThing :newTodo });
	// save the document
	newTodoItem.save();
	res.redirect("/");

	// if(req.body.addTodobutton==='Work'){
	// 	workTodoList.push(newTodoItem);
	// 	res.redirect("/work");
	// }
	// else{		
	// 	todoList.push(newTodoItem);
	// 	res.redirect("/");
	// }
});
// delete route
app.post("/delete",(req,res)=>{
	// console.log(req.body.checkBox);
	const checkedItemId = req.body.checkBox;
	// first thought of solution
	// TodoItem.deleteOne({_id:checkedItemId},(err)=>{
	// 	(err) ? console.log(err) : console.log("delete Success.");
	// });
	TodoItem.findByIdAndRemove(checkedItemId, (err) => {
		(err) ? console.log(err) : console.log("delete Success.");
	})
	res.redirect("/");
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
	
