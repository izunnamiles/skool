const db = require('../config/db');
const bcrypt = require('bcrypt');
const mail = require('../config/mail');

exports.allStudent = (req, res) => {
  let sql = 'SELECT * FROM students';
  db.query(sql, (err, posts) => {
    if (err) throw err
    res.json({
      message: 'success',
      posts
    })
  });
}
exports.studentRegister = (req, res) => {
  let students = req.body ;
  if (!Array.isArray(req.body)) {
    let data = [];
    data.push(req.body)
    students = data;
  } 
  students.forEach(student => {
    let newUser = {
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      password: student.password
    }
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        // Store hash in your password DB.
        if (err) throw err
        newUser.password = hash
        let sql = "INSERT into students SET ?";
        return db.query(sql, newUser, (err,result) => {
          if (err) throw err
          mail(newUser.email, 'Account registration', '<p>Welcome to our platform</p>')
      
        })
      });
    })
    
  })
  res.json({
    message:'Student registeration successful '
  })
  //   .then(success => {
  //     res.json({
  //       message: 'Student registeration successful '+success 
  //     });
  //   }, (err) => {
  //     res.json({
  //       message: 'Student registeration failed' + err
  //     })
  //   }
  // ).catch( err => {
  //   console.log(err)
  // });
  
  // let newUser = {
  //   first_name:req.body.first_name,
  //   last_name:req.body.last_name,
  //   email: req.body.email,
  //   password:req.body.password
  // }
  // bcrypt.genSalt(10, (err, salt) => {
  //   bcrypt.hash(newUser.password, salt, (err, hash)=> {
  //       // Store hash in your password DB.
  //       if(err) throw err
  //       newUser.password = hash
  //       let sql = "INSERT into students SET ?";
  //       db.query(sql, newUser,(err) => {
  //         if (err) throw err
  //         // mail(newUser.email,'Account registration','<p>Welcome to our platform</p>')
  //         return res.json({
  //           message:'User registered'
  //         });
  //       })
  //   });
  // });
  
}