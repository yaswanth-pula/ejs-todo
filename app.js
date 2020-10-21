const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

const { getDbConnection }  = require('./config');
const date = require(__dirname+"/date.js"); 

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// Root Route Header
const day = date.getDay();
// Database Name
const databaseName = "ejsTodoListDB";
// mongoDB Url
const dbConnectionUrl = getDbConnection(databaseName);
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
	todoThing:"Welcome To Todo App"
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

// new collection for custom lists
// custom list schema
const listSchema = {
	listName : {type:String, requried:true},
	items : [itemSchema]
}
// custom list model
const CustomList = mongoose.model("list",listSchema);

// root route
app.get("/",(req,res)=>{
	// Todo List Header

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
	const currentListTitle = req.body.addTodobutton;
	// push new todo into db
	// create new todo item document
	const newTodoItem = new TodoItem({ todoThing :newTodo });
	// save the document
	if(day === currentListTitle){
		newTodoItem.save(err =>{
			if(!err)  res.redirect("/");
		});	
	}
	else{
		CustomList.findOne({listName:currentListTitle},(err,resultDoc)=>{
			if(err)
				console.log(err);
			else{
				// console.log(resultDoc);
				resultDoc.items.push(newTodoItem);
				resultDoc.save((err)=>{
					if(!err) res.redirect("/"+currentListTitle);
				});
			}
		});
	}

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
	const itemList = req.body.deleteItemListTitle;
	// first thought of solution
	// TodoItem.deleteOne({_id:checkedItemId},(err)=>{
	// 	(err) ? console.log(err) : console.log("delete Success.");
	// }); 
	// console.log(itemList,day,checkedItemId);
	if(day === itemList){
		TodoItem.findByIdAndRemove(checkedItemId, (err) => {
			if(!err){
				console.log("delete Success.");
				res.redirect("/");
			}
			else{
				console.log(err);
			}
		});
	}
	else{
		CustomList.findOneAndUpdate(
				{listName:itemList},
				{$pull:{items:{_id:checkedItemId}}},
				(err,resultDoc)=>{
					if(!err) res.redirect("/"+itemList);
		});
	}

});

// custom route
app.get("/:customRoute",(req,res)=>{
	const customListName = _.capitalize(req.params.customRoute);
	 
	CustomList.findOne({listName:customListName},(err,resultDoc)=>{
		if(!err){
			if( !resultDoc ){ 
				const newList = new CustomList({ listName: customListName, items:defaultTodoItems });
				newList.save((err)=>{
					if(!err) res.redirect("/"+customListName);
				});
			}
			else{
				res.render("list",{htmlListTitle:resultDoc.listName, htmlTodoList:resultDoc.items});
			} 
		}
	});
	
});

// about route
app.get("/about",(req,res)=>{
	res.render("about");
});



app.listen(process.env.PORT || 3000, ()=>{
	console.log(`Server is up and Running `);
});
	
