var express=require('express');
var path=require('path');
var favicon=require('serve-favicon');
var connection = require('./join/connection');
var logger=require('morgan');
var session = require('express-session');
var cookieParser=require('cookie-parser');
var bodyParser=require('body-parser');
var multer = require('multer');
var upload = multer({ dest: './public/images'});
var fs = require('fs');
var app=express();
var route = require('./routes/route');
var cors = require('cors');




var socket_io    = require( "socket.io" );
var io           = socket_io();
app.io           = io;



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(__dirname+'/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(cors());
var passport = require('./join/passport');
app.use(passport.initialize());
app.use(passport.session());
app.use(session(
{
  secret:'keyboard cat',
  resave:false,
  saveUninitialized:false,
  cookie:{secure:false}
}
));
app.use(express.static(path.join(__dirname,'www')));
//app.use(express.static(path.join(__dirname,'public')));

app.use('/images',express.static('images'));
app.use('/api',route);
var room_id;
var socket_ids = [];
io.on('connection', function(socket) {
  console.log('client 입장');

  socket.on('room',function(roomid){
    room_id = roomid;
  });
  socket.on('setNickName',function(nickName2){
    socket.nickName = nickName2;
    socket_ids[nickName2] = socket.id;
    console.log('식별자 '+nickName2);
    console.log(socket_ids[nickName2]);
  });



  socket.on('chatMessage',function(msg,send,receiver){
    console.log("메시지 수신");
    connection.query('SELECT * FROM counter where id = ?',1,function(err,result){
     		 console.log('count값'+result[0].num);


     	 connection.query('SELECT * FROM users where user_id = ?',receiver,function(err,user){


     	var now = new Date();
     	var nowAll = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + " ";
     	var nowPart= now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " " + now.getHours()  +  " ";
     	var i=1;
      console.log(user);
      console.log(user[0].user_id);


     	var text = {
     			id : result[0].num,
     			sender : send,
     			recipient : user[0].name,
     			student_id : parseInt(user[0].user_id),
     			text : msg,
     			time : nowAll,
     			check_message : false,
     			sender_id:socket.nickName,
     			check_time : nowPart


     	};
     	 connection.query('INSERT INTO letter SET ?' ,[text],function(err,result){
  			console.log(result);
  			if(err){
  				console.log(err);
  			}
  			else
  			{
  				console.log('success!');
  				i++;
  			}
          });
     	 console.log('소켓아아디:'+socket_ids[user[0].user_id]);


 			io.to(socket_ids[user[0].user_id]).emit('쪽지',msg,receiver);
     	 });

     	 });

     	 connection.query('update counter set num = num+1 where id = ?',1,function(err,number){

     		if(err)
     		{
     			 	console.log(err);
     		}
     		else
     			{
     				console.log('update count 성공');
     			}
     	 });



    });
    socket.on('chatMessage2',function(msg,send,receiver){

      var student = JSON.parse(receiver);
      var len=0;
      var rec_name="";
      var rec_id="";
      for(var i=0;i<student.length;i++)
      {
        len++;
        rec_name += student[i].name;
        if(i<student.length-1)
        {
          rec_name +='/';
        }
      }


      for(var j=0;j<student.length;j++)
      {
        rec_id += student[j].user_id;
        if(j<student.length-1)
        {
          rec_id +='/';
        }
      }

      connection.query('SELECT * FROM counter where id = ?',1,function(err,result){
       		 console.log('count값'+result[0].num);


           connection.query('SELECT * FROM notice_room where professor_name = ?',send,function(err,result2){




       	var now = new Date();
       	var nowAll = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + " ";
       	var nowPart= now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " " + now.getHours()  +  " ";
       	var i=1;


        var text = {
       			id : result[0].num,
       			sender : send,
       			recipient : rec_name,
       			recipient_id : rec_id,
       			text : msg,
       			time : nowAll,
       			check_message : len,
       			sender_id:socket.nickName,
       			check_time : nowPart,
            room : room_id,
            check_student:rec_name


       	};
        console.log('text값');
        console.log(text);
       	 connection.query('INSERT INTO notice SET ?' ,[text],function(err,result){

    			if(err){
    				console.log(err);
    			}
    			else
    			{
    				console.log('success!');
    				i++;
    			}
            });





      });
       	 });

       	 connection.query('update counter set num = num+1 where id = ?',1,function(err,number){

       		if(err)
       		{
       			 	console.log(err);
       		}
       		else
       			{
       				console.log('update count 성공');
       			}
       	 });





      });


});

app.use(function(req,res,next){
  var err=new Error('Not Found');

  err.status=404;
  next(err);
});

if(app.get('env')==='development'){
  app.use(function(err,req,res,next){
    res.status(err.status||500);
    res.send({
      message:err.message,
      error:err
    });
  });
}

app.use(function(err,req,res,next){
  res.status(err.status||500);
});

module.exports=app;
