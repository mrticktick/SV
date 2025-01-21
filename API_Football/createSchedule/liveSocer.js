"use strict";

const _ = require('lodash');
var CronJob = require('cron').CronJob;
var moment = require('moment');
 var APIKEY = require('../../const');
 var https = require('https')
let init = [false];

var Factory = function (){};
let status; 

Factory.prototype.liveSocer = function(res)
{
// get current date
var date = new Date();
let fromDate = moment(date).format('YYYY-MM-DD');
let toDate = moment(date).format('YYYY-MM-DD');

    // if (init[res]) return; 
    // init[res] = true;

// var test = function(){
var jobLive = new CronJob({
    //  cronTime: '00 00 7 * * 0-6',//sang thu 7 thu 2 - 6
      cronTime: '60 * * * * *',// moi 60 giay
    // cronTime: '00 21 15 06 07 *',// thoi gian thuc
  
      onTick: function () {
         //var aa = process.argv[2].split
         // console.log('parametter2     :'+ process.argv[2]);//phut
        //   console.log('parametter3     :'+ process.argv[3]);// gio
        //   console.log('parametter4     :'+ process.argv[4]);//ngay 
          console.log('fromDate     :'+ fromDate);//thang  
          console.log('Run time AAAAAAAAAAAAAAA  7 hours every morning ('+res+' )' + moment().format('YYYY-MM-DD HH:mm:ss'));   

          https.get('https://apifootball.com/api/?action=get_events&APIkey='+APIKEY.APIKEY+'&from='+fromDate+'&to='+toDate+'&match_live=1', (resp) => {
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {  
                data += chunk;   
            });            
            // The whole response has been received. Print out the result.
            resp.on('end', ()  => 
            {              
              //compare match_status to DB
              // var jsonobj = JSON.parse(data)
              // console.log('hih        :'+jsonobj[0].match_id);
            });

          }).on("error", (err) => {
            console.log("Error: " + err.message);
            });

        if(status == 'FT')
        {
          console.log('vao handle_wallet.........................:')
          handle_wallet();
        }

      },function () {
          console.log('cron stop');         
        },
      start: true,
      timeZone: 'Asia/Ho_Chi_Minh'
   });

  // console.log('job status in AAAAAAA:      ', jobLive.running);
}
   
// wallet
function handle_wallet()
{
  console.log('handle_wallet');
  process.kill(1);
}

module.exports =  Factory;