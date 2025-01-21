var ser = require('./services');
const { fork } = require('child_process');
var CronJob = require('cron').CronJob;
var moment = require('moment');
var http = require("http");
var https = require("https");
const Match = require('../models/Matchs'); 
const createSchedule = require('../API_Football/createSchedule/createSchedule'); 
var conpare_services = require ('./get_10m_update/conpare_services');
var mongoClient = require('mongodb').MongoClient;
var APIKEY = require('../const');

 var _ObjFactory = new createSchedule();
 var _iskill = false;
var job = new CronJob({
    //cronTime: '00 00 7 * * *',
    cronTime: '00 10 * * * *',
    onTick: function () {
        var date = new Date();
        let fromDate = moment(date).format('YYYY-MM-DD');
        let toDate = moment(date).format('YYYY-MM-DD');
        console.log('Run time 10 munites: ' + moment().format('YYYY-MM-DD HH:mm:ss'));  
       // console.log(moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'));
    //    https.get('https://apifootball.com/api/?action=get_events&APIkey=7f5cbcf63b605a4b2928fa89d676765d06b7bb38c684e7716b5c67f4fb5a51de&from=2018-08-01&to=2018-08-01&league_id=1772', (resp) => {
        https.get('https://apifootball.com/api/?action=get_events&APIkey='+APIKEY.APIKEY+'&from='+fromDate+'&to='+toDate+'&league_id=62', (resp) => {
     //   https.get('https://apifootball.com/api/?action=get_events&APIkey='+APIKEY.APIKEY+'&from='+fromDate+'&to='+toDate+'&league_id=62', (resp) => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {  
            data += chunk;   
        });
        
        // The whole response has been received. Print out the result.
        resp.on('end', ()  => {
            
            var jsonobj = JSON.parse(data)
            //  ser.services_api(data, function(statusCode, result)
            //  {
              
                  for(let i = 0; i < jsonobj.length; i ++) 
                  { 
                mongoClient.connect(process.env.MONGODB_URI_2, function(err, db) {
                    if (err) throw err;           
                    var matchs = db.collection('Matchs');
                    console.log('for   :');  
                    matchs.find({ match_id: jsonobj[i].match_id,
                        match_date: {$ne: jsonobj[i].match_date},
                     //   match_time: {$ne: jsonobj[i].match_time}
                    //match_date: {$ne :jsonobj[i].match_date},
                    //match_time: {$ne: jsonobj[i].match_time}
                 }).toArray(function(res, result)
                {
                    if(result.length > 0)
                    {
                        // console.log('result co thay doi >0'+result.length);
                        var ProcessPid = db.collection('ProcessPid');
                        ProcessPid.find({_id:1}).toArray(function(res, result)
                        {
                          //  if(!_iskill){                          
                            _ObjFactory.uninit(result[0].ProcessPid);
                            //xoa du lieu trong ngay hom nay             
                            startProcessGetMatchs();
                            _iskill = true;
                          //  }
                        })
                        //_ObjFactory.uninit(process.pid);
                      
           
                    }else{
                        console.log('result khong thay doi  <0'+result.length);
                    }
                });
                    //  .then(match => { 
                    //         console.log('match sssssssssss  :'+match); 
                    //         if(match.length > 0)
                    //         {
                    //             console.log('match co gia tri   :');  
                    //         }
                    //         else
                    //         {
                    //             console.log('match khong gia tri   :');  
                    //         }
                    //         // res.status(201).send({
                    //         //     success: true,
                    //         //     message: match
                    //         // });
                    //     })
                    // .catch(err => {
                    //     return errors.errorHandler(res, err);
                    // });
                });
            } 
                 // chay load odds tung match_id insert db   
                // for(let i = 0;i<result.length; i++)
                // {                   
                    // console.log('in test   :'+result[i].match_date);
                  //  let aa = ['2'];// from DB
                 //   _ObjFactory.init(result);                  
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
                   
                // }
                 
            //  }               
            // );          

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


// start lai tien trinh get matchs
function startProcessGetMatchs() 
{ 
  
    const process =  fork('./API_Football/index', {
		silent: false
      });	
     
}
