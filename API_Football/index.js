var ser = require('./services');
var CronJob = require('cron').CronJob;
var moment = require('moment');
var http = require("http");
var https = require("https");
const { fork } = require('child_process');
var createSchedule = require ('./createSchedule/createSchedule.js');
var mongoClient = require('mongodb').MongoClient;
var APIKEY = require('../const');
// var options = {
//     host: 'https://apifootball.com',
//     port: 80,
//     path: '/api/?action=get_events&APIkey=3878720a9ba00f09f7ec5d32643e72a449d99b0cef357d922fd85e79003754b8&from=2018-07-26&to=2018-07-26&league_id=1772',
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/json'
//     }
// };

console.log('process index       :'+process.pid);
insertProcessPid(process.pid);

var _ObjFactory = new createSchedule();
var job = new CronJob({
  //  cronTime: '00 00 7 * * *',
   cronTime: '*/02 * * * * *',
    onTick: function () {       
        var date = new Date();
        let fromDate = moment(date).format('YYYY-MM-DD');
        let toDate = moment(date).format('YYYY-MM-DD');
        console.log('Run time: 7 hours every morning ' + moment().format('YYYY-MM-DD HH:mm:ss'));  
       // console.log(moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'));
     //  https.get('https://apifootball.com/api/?action=get_events&APIkey=7f5cbcf63b605a4b2928fa89d676765d06b7bb38c684e7716b5c67f4fb5a51de&from=2018-08-01&to=2018-08-01&league_id=1772', (resp) => {
         https.get('https://apifootball.com/api/?action=get_events&APIkey='+APIKEY.APIKEY+'&from='+fromDate+'&to='+toDate+'&league_id=62', (resp) => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {  
            data += chunk;   
        });
        
        // The whole response has been received. Print out the result.
        resp.on('end', ()  => {
             ser.services_api(data, function(statusCode, result)
             {                   
                 console.log('result.length     '+result.length);    
                 // chay load odds tung match_id insert db   
                // for(let i = 0;i<result.length; i++)
                // {                                            
                    _ObjFactory.init(result);                  
                    // const process_getMatch = fork('./API_Football/createSchedule/createSchedule',aa,
                    // {
                    //     silent: false
                    //   }
                    // );
                    // Đúng là lấy Odds ở đây
                   
                    // process_getMatch.on('message', function(m) {
                    //     console.log('message from child:', m);
                    // });
                    // process_getMatch.send('Please up-case this string');
                   
               //  }
                 
             }               
            );          

        });
        
        }).on("error", (err) => {
        console.log("Error: " + err.message);
        });

    },function () {

        console.log('cron stop');
       
      },
    start: true,
    timeZone: 'Asia/Ho_Chi_Minh'
 });


//  setTimeout (function (){
//     console.log('pid index            :'+process.pid);
//     console.log('thoi gian chay...................................................:');
//     _ObjFactory.uninit();

//     Console.log('pid index out          :'+process.pid);
// }, 9000);



// setTimeout (function (){
//     console.log('thoi gian tai khoi dong...................................................:');
//     exec(cmd, function(error, stdout, stderr) {
//         // command output is in stdout
//       });
//     //const process = fork('');
// }, 11000);

function insertProcessPid(o)
{
    console.log('insertProcessPid');
    mongoClient.connect(process.env.MONGODB_URI_2, function(err, db) {
        if (err) throw err;           
        var ProcessPid = db.collection('ProcessPid');
        ProcessPid.save({_id:1,ProcessPid:o})
    });
}