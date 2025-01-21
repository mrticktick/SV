// Get dependencies
// const { fork } = require('child_process');
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const chalk = require('chalk');
const compression = require('compression');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const expressStatusMonitor = require('express-status-monitor');
const bodyParser = require('body-parser');
// const mongoUtil = require('./config/mongo');
const mariaUtil = require('./config/mariaDb');
// const mongo = require('mongodb').MongoClient;
//Load environment variables	
require('dotenv').config();

//Route handlers
const memberApi = require('./controllers/member.api');
const teamApi = require('./controllers/team.api');
const regeditMatchApi = require('./controllers/regeditMatch.api');
const matchApi = require('./controllers/matchs.api');
const facilitystadiumApi = require('./controllers/stadium.api');
const facilitybookingApi = require('./controllers/facilitybooking.api');
const authApi = require('./controllers/auth.api');
const productApi = require('./controllers/product.api');
const homeApi = require('./controllers/home.api');
//const user_matchApi = require('./controllers/user_match.api');
//const matchApi = require('./controllers/matchs.api');
const oddsApi = require('./controllers/odds.api');

//Create server
const app = express();
//const sub = express();

//mongoDB setup
// mongoUtil.connectToServer(err => {
// 	if (err) return console.log(err);
// });

mariaUtil.connectToServer(err => {
	if (err) return console.log(err);
});

//Express configuration
app.set('port', process.env.MARIADB_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
console.log('__dirname', path.join(__dirname, '../Server', 'build/images')); // app path for images
app.use(	
	express.static(path.join(__dirname, '../Server', 'build'), {
		maxAge: 31557600000
	})
);
//app.use(express.static(__dirname + 'public'));

//Error handler
app.use(errorHandler());
////

//API routes
app.use('/api/users', authApi);
//sub.use('api/product', sub);
app.use('/api/product', productApi);
//home
app.use('/api/home', homeApi);
//Registey match
app.use('/api/regeditMatch', regeditMatchApi);
app.use('/api/match', matchApi);
// facility stadium
app.use('/api/stadiums', facilitystadiumApi);
// facility booking
app.use('/api/bookings', facilitybookingApi);
//
app.use('/api/member', memberApi);
//
app.use('/api/teams', teamApi);
//user_match
//app.use('/api/usermatch', user_matchApi);
//get match
//app.use('/api/match', matchApi);
//get odds
app.use('/api/odds', oddsApi);

let server = app.listen(app.get('port'), () => {
	console.log(
		'%s App is running at http://localhost:%d in %s mode',
		chalk.green('✓'),
		app.get('port'),
		app.get('env')
	);
	console.log('  Press CTRL-C to stop\n');
});

// socket.io

// let connections = [];
// let io = require('socket.io')(server);


// mariaUtil.connectToServer(err => {

// 	console.log('err.', err);

// 	if (err) {
// 		throw err;
// 	}

// 	io.sockets.on('connection', function (socket) {

// 		console.log('connection.cxcxcxc');
// 		connections.push(socket);

// 		let chat = db.collection('chats');

// 		console.log('Connected...');
// 		socket.on('disconnect', function () {
// 			console.log('Disconnected.');
// 		});

// 		sendStatus = function (s) {
// 			socket.emit('status', s);
// 		}

// 		//Get All chats from mongo collection
// 		chat.find().limit(100).sort({ _id: 1 }).toArray(function (err, res) {

// 			if (err) {
// 				throw err;
// 			}

// 			socket.emit('output', res);
// 		});

// 		//Handle input from clients
// 		socket.on('input', function (data) {
// 			Console.log('inputttttttttttttt');
// 			let name = data.name;
// 			let message = data.message;

// 			if (name == '' || message == '') {
// 				//Send Error Status
// 				sendStatus('Please enter a name and message');
// 			}
// 			else {
// 				//Insert messages to MongoDB 
// 				chat.insert({ name: name, message: message }, function () {
// 					io.emit('output', [data]);//client

// 					//Send status object
// 					sendStatus({
// 						message: 'Message sent',
// 						clear: true
// 					})
// 				});
// 			}
// 		});

// 		//Handle clear button

// 		socket.on('clear', function (data) {
// 			//Remove all chats from collection
// 			chat.remove({}, function () {
// 				//Emit Cleared
// 				socket.emit('cleared');// anh huong socket hien tai ()
// 				// io.emit('cleared'); //anh huong tat ca socket

// 				sendStatus({
// 					message: 'Message clear',
// 					clear: true
// 				})
// 			});
// 		});

// 		server.on("error", (err) => {
// 			console.log("Error opening server");
// 		  });

// 		//TEST
// 		socket.on("chat message", (msg) => {
// 			console.log("message111111: " + msg);
// 			io.emit("chat message", msg);
// 		  });

// 	})
// });

// app.set('socketio', io);
// app.use(expressStatusMonitor({ websocket: io, port: app.get('port') }));


