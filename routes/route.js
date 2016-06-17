var express = require('express');
var router = express.Router();
var fs = require('fs');
var sql = require('mssql');
var connection = require('../join/connection');
var config = {
    user: 'sa',
    password: 'dlaudtnr0',
    server: 'localhost',
    database: 'bbs1',
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
};
var multer = require('multer');
var bodyParser = require('body-parser');
  var	formidable = require('formidable');
	var	morgan = require('morgan');
	var multipart = require('connect-multiparty');
	var multipartMiddleware=multipart();
var path    = require('path');
var passport = require('../join/passport');


router.get('/logout',function(req,res){
    console.log('logout');
    req.logout();
    req.session.destroy();
    res.json('logout');
});

router.post('/upload',multipartMiddleware,function(req,res){
  console.log(req.files);


  req.files.file.name = req.session.passport.user.name;
  fs.readFile(req.files.file.path,function(error,data){
   console.log(data);
   var filePath="C:/Users/USER/Desktop/three/mobile/sopo/www/images/"+req.files.file.name+".jpg";
     fs.writeFile(filePath,data,function(errort){

     });
     res.json('success');
 });
});



router.get('/userList',function(req,res){
  console.log('userLIST');
  console.log(req.session.passport.user);


    connection.query('SELECT * FROM users order by user_id',function(error,result){
      if(error){
        res.send(error);

      }

      console.log(result);
      res.json(result);
    });
});

router.get('/regSub',function(req,res){

  var data = JSON.parse(req.query.data);
  var user = req.query.user;
  var len;
  var i;

  console.log(user);



  console.log(user);
  console.log(data);
  console.log(data.length);

  if(data.length>60)
  {
    len = 1;
  }
  else{
    len = data.length;
  }

  for(i=0;i<len;i++)
  {
    var ins = {
      student_id : user ,
      subject_id :data[i].subject_id
    };
    connection.query('INSERT INTO user_sub SET ?',ins,function(error,result){
      console.log('삽입');
      if(error){
        console.log(error);

      }




    });

  }

  if(i>len)
  {
    res.json('success');
  }


});

router.get('/deleteRoom',function(req,res){
    connection.query('delete from notice_room where room_id = ?',[req.query.roomId],function(error,result){
      if(error){
        console.log(error);

      }


      res.json('성공~');
    });
});

router.get('/getSubUser',function(req,res){
    connection.query('select * from users where user_id in (select student_id from user_sub where subject_id = ?)',[req.query.did],function(error,result){
      if(error){
        console.log(error);

      }


      res.json(result);
    });
});

router.get('/getNoreadUser',function(req,res){
  var student;
  var data = [];
  var count = 0;
    connection.query('select check_student from notice where id = ?',[req.query.msg_id],function(error,result){
      if(error){
        console.log(error);

      }
      console.log(result[0]);
      student = result[0].check_student.split('/');

      for(var j=0;j<student.length;j++)
      {
        console.log('와우');
        connection.query('select * from users where name = ?',student[j],function(error,result2){
          if(error){
            console.log(error);
            console.log('와우33');
          }

          data.push(result2[0]);
          console.log('data값');
          console.log(data);
          count++;
          console.log(count);
          if(count==student.length)
          {

              res.json(data);
          }
        });
      }




    });







});

router.get('/getRoomMessage',function(req,res){
  console.log('공지방 접근');

    connection.query('SELECT * FROM notice where room = ?  order by time ',[req.query.id],function(error,result){
      if(error){
        console.log(error);

      }


      res.json(result);
    });
});
router.get('/getRoomCount',function(req,res){


    connection.query('SELECT * from notice where check_student like ?', '%' + req.query.name + '%',function(error,result){
      if(error){
        console.log(error);

      }

      res.json(result);

    });
});
router.get('/getStudentRoom',function(req,res){
    var user  = JSON.parse(req.query.user);
    connection.query('select *from notice_room where room_name in(select subject_name from subjects where subject_id in(select subject_id from user_sub where student_id = ?))',[user.id],function(error,result){
      if(error){
        console.log(error);

      }
      res.send(result);


    });
});

router.get('/getRoom',function(req,res){
  console.log('공지방 접근');

    connection.query('SELECT * FROM notice_room where professor_name=?  order by room_id',[req.query.professor],function(error,result){
      if(error){
        console.log(error);

      }


      res.json(result);
    });
});
router.get('/getRoom2',function(req,res){
  var k=0;
  var count = 0;
  var name = req.query.name;
  var rec_name="";
  var msg_id;
  var len;
  console.log('공지방 접근2');
  console.log(req.query.id);
  console.log(req.query.roomName);
  connection.query("SELECT * FROM notice  where room ="+req.query.roomid,function(error,result){
    if(error){
      console.log(error);

    }
    len = result.length;

    for(var q=0;q<result.length;q++)
    {
      console.log('반복문 진입');
      var student = result[q].check_student.split('/');
      msg_id = result[q].id;
      console.log(student);
      for(var i=0;i<student.length;i++)
      {
        if(name == student[i])
        {
          console.log('맥아덤즈 삭제');
          student.splice(i,1);
          console.log(student);
          count++;
        }
      }
      for(var s=0;s<student.length;s++)
      {

        rec_name += student[s];
        if(s<student.length-1)
        {
          rec_name +='/';
        }
      }
      console.log(rec_name);
      console.log(req.query.roomid);
      if(count>0)
      {
        connection.query("UPDATE NOTICE SET check_student = ?   where id = "+msg_id+" and room="+req.query.roomid,rec_name,function(error,result){
          if(error){
            console.log(error);

          }

        });
        connection.query("UPDATE  NOTICE SET check_message = check_message - 1  where  id = "+msg_id+" and room="+req.query.roomid,function(error,result){
          if(error){
            console.log(error);

          }
          k++;
          count--;
          console.log('호호잇');
          console.log(rec_name);

        });
      }
      rec_name = "";

    }
  });

    connection.query("SELECT * FROM notice_room  where room_id ="+req.query.roomid+"  and room_name =? ",[req.query.roomName],function(error,result){
      if(error){
        console.log(error);

      }
      console.log(result);


          res.json(result);


    });
});



router.get('/getSub',function(req,res){
    connection.query('SELECT * FROM subjects order by subject_id',function(error,result){
      if(error){
        console.log(error);

      }

      console.log(result);
      res.json(result);
    });
});

router.post('/getText',function(req,res,next){

  var text = [];
  var i=0;

  connection.query("SELECT * FROM letter  where sender_id ="+req.query.sender+"  and student_id = ? order by time desc",[req.query.receiver],function(error,result){
    if(error){
      console.log(error);
    }

    console.log(result);
    text[0] = result;
    i++;
  });
  connection.query("SELECT * FROM letter  where sender_id ="+req.query.receiver+"  and student_id = ? order by time desc",[req.query.sender],function(error,result){
    if(error){
      console.log(error);
    }

    console.log(result);
    text[1] = result;
      res.json(text);
  });




});
router.post('/makeNotice',function(req,res,next){

var roomName = req.query.roomName;
var professor = JSON.parse(req.query.professor);
var student2 = req.query.student;
var student_id2 = req.query.student_id;




connection.query('SELECT * FROM room_count where id = 1',function(error,result){
  if(error){
    console.log(error);

  }
  var newRoom = {
    room_id : result[0].num,
    room_name : roomName,
    professor_name : professor.name,
    professor_id : professor.id,
    student:student2,
    student_id : student_id2,
    count : 0
  };

  connection.query('INSERT INTO notice_room SET ?',newRoom,function(error,result2){

    connection.query('update room_count set num = num+1 where id = ?',1,function(err,number){


        res.json(result[0].num);
        console.log('update count 성공');


   });
});

});


});

router.post('/getMessage',function(req,res,next){
  console.log(req.body);

  console.log(req.body.user_id);
  connection.query('SELECT * FROM letter  where student_id = ? order by time',[req.body.id],function(error,result){
    if(error){
      console.log(error);

    }

    console.log(result);
    res.json(result);
  });


});

router.post('/getSend',function(req,res,next){
  console.log(req.body);

  console.log(req.body.user_id);
  connection.query('SELECT * FROM letter  where sender_id = ? order by time',[req.body.id],function(error,result){
    if(error){
      console.log(error);

    }

    console.log(result);
    res.json(result);
  });


});



router.post('/regist_User',function(req,res,next){
	console.log('회원가입 받음');
	console.log(req.body);
	connection.query('INSERT INTO users SET ?' ,[req.body],function(err,results){
        console.log(results);
        var data = {
          result : "success"
        };
		    				if(err){
		    					next(err);
		    				}
                else{

                  res.json(data);
                }


		    		});


});

router.post('/login_user',passport.authenticate('local',{failureRedirect:'/',failureFlash:true}),
function(req,res){
  console.log("포스트 성공");
  console.log(req.user);

  res.json(req.user);



});



module.exports = router;
