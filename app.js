var express = require("express");
var path = require("path");
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
var md5 = require('md5');
app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'fluper_test'
  });
 connection.connect();
 // For login
 app.post('/login', function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
        var sql = "SELECT * FROM `user` WHERE `email`=? AND `password`=?";
	var password = md5(password);
	var values = [email, password];
        connection.query(sql, values, function(err,result){
		console.log(result);
		if (err) {
			console.log(err);
		         } else {
                                if ( result.length > 0 ) {
                                result[0].password = "";
				var response = {
					status: 1,
					response: result[0]
				}
				res.send(response);
                                } else {
				var response = {
					status: 0,
					response: "Invalid Credential"
				}
				res.send(response);
			}
		}
	});
  });

  // For signup
 app.post('/signup', function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var text = "";
        var possible = "123456789";
        for (var i = 0; i < 4; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
         }
        var user_id = md5(text);
	var password = md5(password);
        var sql = "SELECT * FROM `user` WHERE `email`=?";
	var values = [email, password];
        connection.query(sql, values, function(err, result){
		if (err) {
			console.log(err);
		         } else if (result.length >0 ){
			res.send('Email is already registered');
			} else {
			var sql = "INSERT INTO `user`(`user_id`, `name`, `email`, `password`) VALUES (?,?,?,?)";
			var values = [user_id, name, email, password];
                        connection.query(sql, values, function(err, result){
				if (err) {
					console.log(err);
				} else {
					res.send('success');
				}
			  });
		     }
	        });
	
        });
  //for save
  app.post('/save', function(req, res) {
	var userid = req.body.userid;
	var task = req.body.task;
	var date = req.body.date;
	var sql = "INSERT INTO `task1`(`userid`, `task`, `date`) VALUES (?,?,?)";
	var values = [userid,task,date];
        connection.query(sql, values, function(err, result){
				if (err) {
					console.log(err);
				} else {
					res.send('success');
				}
			});
	});
       //for update
   app.post('/update', function(req, res) {
	var userid = req.body.userid;
	var task = req.body.task;
	var date = req.body.date;
	console.log(req.body);
	var sql = "update task1 set `task`=?,`date`=? WHERE `userid`=?";
	var values = [task,date, userid];
        connection.query(sql,values,function(err, result){
			if (err) {
				console.log(err);
			} else {
				res.send('success');
			}
		});
         });
		
	// for delete
  app.post('/delete', function(req, res) {
	var userid = req.body.userid;
	console.log(req.body);
	var sql = "delete from task1 WHERE `userid`=?";
	var values = [userid];
        connection.query(sql,values,function(err, result){
			if (err) {
				console.log(err);
			} else {
				res.send('success');
			}
		});
	});
          // for view task
   app.post('/view', function(req, res) {
	var userid = req.body.userid;
	var task = req.body.task;
	var date = req.body.date;
	var sql = "SELECT * from task1 WHERE `userid`=?";
	var values = [userid,task,date];
        connection.query(sql,values,function(err, result){
			if (err) {
				console.log(err);
			  } else {
				res.send('success');
			  }
		});
	});
    app.listen('3001', function(){
    console.log("Server is running on localhost port number 3001");
});
