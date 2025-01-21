const _ = require('lodash');
const errors = require('../controllers/error');
const Match = require('../models/Matchs');
let Q = require('q');
let ketqua;
exports.services_api =  function(data, onResult){
    // (async () => {  
        var sync = true;
    try
    {
        if (!data) 
        {             
            console.log('You must send the Match name.'); 
        }
        else
        {   
            ketqua = [];
            var jsonobj = JSON.parse(data)
            var mongoClient = require('mongodb').MongoClient;
            mongoClient.connect(process.env.MONGODB_URI_2, function(err, db) {
                if (err) throw err;           
                var matchs = db.collection('Matchs');
                for (let i = 0; i < jsonobj.length; i ++) 
                {    
                    var imgDefer = Q.defer();
                    matchs.find({
                                match_id: jsonobj[i].match_id
                        }).toArray(function(res, result)
                        {
                            if(result.length > 0)
                            {
                                console.log('this match is Exist:'+ result[0].match_id);
                                //onResult(err, 'hihi');                                                           
                            }
                            else
                            {
                                
                                matchs.insert(jsonobj[i])
                                .then(match =>{
                                    if(err)imgDefer.reject(err);
                                    else imgDefer.resolve()
                               // onResult(err, 'hihi');
                                })
                            }            
                                                      
                           //console.log(ketqua[i]);
                           sync = false; 
                        })
                       
                        ketqua.push(jsonobj[i]);
                        //.then(a => {
                            // if(i == jsonobj.length)
                            // {
                              //  console.log('chay sau chay sau');
                                
                            // }      
                      //  })        
                      
                } 
              
                // if(true) {
                    // console.log('insert xong'+ketqua.length );
                     //onResult(null, ketqua);  
                // }    
            });                     
        }       
       // onResult(null, ketqua);  
      
    }
    catch(err)
    {
        console.error(err);
    }
    while(sync) {require('deasync').sleep(100);}
    return onResult(null, ketqua );
//  });
}
// Q.all(ketqua).then (function (){
    
  
    
    //res.render('index', { title: 'SearchAPI' });
// })