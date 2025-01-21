const express = require('express');
const router = express.Router();
const Match = require('../models/Odds'); 
const _ = require('lodash');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const auth = require('./auth');
const config = require('../config/auth.js');
const errors = require('./error');
var multer  = require('multer');
var http = require("http");
var https = require("https");
let options = {
    APIkey : '3878720a9ba00f09f7ec5d32643e72a449d99b0cef357d922fd85e79003754b8',
}
// var options = {
//     host: 'https://apifootball.com',
//     port: 80,
//     path: '',
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/json'
//     }

// };  
router.get( 
	'/OddsByMatch',
    (req, res, next) => 
    {                
        var sync = true;   
		if (!req.query.match_id) {
			return errors.errorHandler(
				res,
				'You must send the match.'
			);
        }
        https.get('https://apifootball.com/api/?action='+req.query.action+'&APIkey='+options.APIkey+'&from='+req.query.from+'&to='+req.query.to+'&'+req.query.Reqmatchid+'='+ req.query.match_id +'', 
        (resp) => {
        let data = '';
        resp.on('data', (chunk) => {             
            data += chunk;   
        });

        resp.on('end', ()  => {
                 console.log('chay xong service');  
                 // chay load odds tung match_id insert db   
  
               //console.log(JSON.parse(data));   
               var jsonobj = JSON.parse(data);               
               req.data = '[';
               for(let i = 0;i < jsonobj.length; i++)
               {     
                   if(jsonobj[i].odd_bookmakers == '18bet' || jsonobj[i].odd_bookmakers == 'bet365')
                   {                        
                        req.data += JSON.stringify(jsonobj[i]);
                   }
               }    
            //let jsonparse = JSON.stringify(req.data);
            //   console.log('chay chua'+jsonparse);        
              req.data += ']';
               sync = false;       
                next();
               }               
            );        
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
        while(sync) {
            require('deasync').sleep(100);
        }
        return 'hihi';
    },	
        (req, res) => {
            res.status(201).send({                
                success: true,
                message: req.data,          
            });
        }
        
);

module.exports = router;