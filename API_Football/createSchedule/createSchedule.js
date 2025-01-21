const _ = require('lodash');
var CronJob = require('cron').CronJob;
var moment = require('moment');
const { fork } = require('child_process');
// var createSchedule_child = require ('./child');
let init = false;
let process_getMatchBegin;
let name;
var Factory = function (){};

 Factory.prototype.init = function(res)
{
  //console.log('vao khoi tao   :'+ res[0][0].match_date);
 // let parameter = StringdateTime(res[0][0].match_date,res[0][0].match_time)
  let arrDate ;
  let arrTime ;
  let parseMonth ;
  let stringMonth ;
  let match_id;

  if (init) return; 
  init = true;
                //phut -        gio -     ngay -    thang 
  let timeset = [];
   //job.start();
  //child = fork (__dirname + "/child");
   for(let i = 0;i < res.length; i++)
  {
    match_id = res[i].match_id;
    arrDate = res[i].match_date.split('-');
    arrTime = res[i].match_time.split(':');
    parseMonth = parseInt(arrDate[1]);
    stringMonth = (parseMonth - 1).toString();

    timeset = [arrTime[1],arrTime[0],arrDate[2],stringMonth,match_id];

    //timeset.push(match_id);
   // console.log('match_id 1111111111    '+arrTime[0]);
   // console.log('timeset22222222222    '+timeset[5]);
    //process_getMatchBegin[i] = i;
   
    process_getMatchBegin = fork(__dirname + "/child",timeset,
                    {
                        silent: false
                      }
                    );
    // console.log('tao process           :'+process.pid);
  }   
                  //  process_getMatchBegin.send ({ init: res });
};



Factory.prototype.uninit = function(o)
{ 
  console.log('KIll.................................'+o);
  //job.stop();
   for(let i = 0;i <5 ; i++)
   {  
     console.log('Kiil IN'+i+'.................................');
     console.log('pid    :'+ process.pid);
    // name = 'process_getMatchBegin'+i
    console.log('huy process           :'+process.pid);
     //process_getMatchBegin.kill();
    
    
   }
   process.kill(o);

};

// process.on('message',  function(m) {
//     console.log('message');
//     process.send(m);
//   });


function StringdateTime(a,b)
{
  return a+'-'+b;
}

module.exports =  Factory;