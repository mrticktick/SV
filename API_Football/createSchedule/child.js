const _ = require('lodash');
var CronJob = require('cron').CronJob;
var moment = require('moment');
var liveSocer = require('./liveSocer');

var _ObjFactory = new liveSocer();

var job = new CronJob({
  //  cronTime: '00 00 7 * * 0-6',//sang thu 7 thu 2 - 6
   //cronTime: '*/02 * * * * *',// moi 2 giay
    cronTime: '00 '+process.argv[2]+' '+process.argv[3]+' '+process.argv[4]+' '+process.argv[5]+' *',// thoi gian thuc

    onTick: function () {
       //var aa = process.argv[2].split
        // console.log('parametter2     :'+ process.argv[2]);//phut
        // console.log('parametter3     :'+ process.argv[3]);// gio
        // console.log('parametter4     :'+ process.argv[4]);//ngay 
        // console.log('parametter5     :'+ process.argv[5]);//thang

        console.log('Run time @@@@@@@@@@@@@@ 7 hours every morning:     ('+ process.argv[6]+') ' + moment().format('YYYY-MM-DD HH:mm:ss')); 
        _ObjFactory.liveSocer(process.argv[6]);
    },function () {
        console.log('cron stop');         
      },
    start: true,
    timeZone: 'Asia/Ho_Chi_Minh'
 });



 
//  console.log('job status', job.running);

//  Factory.prototype.init = function(o)
// {
//   console.log('vao khoi tao');
//   if (init) return; 
//   init = true;
//   job.start();
//   console.log('ra khoi tao');
//   // next()
// };



// Factory.prototype.uninit = function(o)
// { 
//   job.stop();
//   // next()
// };

// process.on('message',  function(m) {
//     console.log('message');
//     process.send(m);
//   });

// module.exports =  Factory;