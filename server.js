var express = require('express');
var app = express();
var server = require('https').createServer(app);
var io = require('socket.io').listen(server);

connections = [];

server.listen(process.env.PORT || 4000);

console.log('Server running....');

app.get('/',function(req,res){
     res.sendFile(__dirname + '/index.html');
});


const mongo = require('mongodb').MongoClient;
//const client = require('socket.io').listen(4000).sockets;


//connect to mongo
mongo.connect('mongodb://127.0.0.1/mongochat',function(err,db){
     if(err){
     	throw err;
     }

     console.log('MongoDB Connected...');


     //Connect to socket.io
     io.sockets.on('connection',function(socket){	

          connections.push(socket);
          console.log('Connected %s sockets connected', connections.length);

     	let chat = db.collection('chats');

     	//Create function to send status

     	sendStatus = function(s){
     		socket.emit('status',s);
     	}

     	//Get All chats from mongo collection

     	chat.find().limit(100).sort({_id:1}).toArray(function(err,res){

     		if(err){
     			throw err;
     		}

     		socket.emit('output',res);
     	});

     	//Handle input from clients

     	socket.on('input',function(data){
     		let name = data.name;
     		let message = data.message;

     		if(name=='' || message==''){
     			//Send Error Status
     			sendStatus('Please enter a name and message');  			
     		}
     		else{
     			//Insert messages to MongoDB 
     			chat.insert({name: name, message: message},function(){
     				io.emit('output',[data]);//client

     				//Send status object
     				sendStatus({
     					message: 'Message sent',
     					clear: true
     				})
     			});                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
     		}
     	});

     	//Handle clear button

     	socket.on('clear',function(data){
     		//Remove all chats from collection
     		chat.remove({},function(){
     			//Emit Cleared
     			socket.emit('cleared');
     		});
     	});
     });
});