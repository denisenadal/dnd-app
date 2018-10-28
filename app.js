var dotenv = require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');

var app = new express();

app.use(express.static('public') );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//TODO make some generic endpoints for testing

var listener = app.listen(process.env.PORT,function(){
	console.log("listening on ",process.env.PORT);
});
