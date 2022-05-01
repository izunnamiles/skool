const db = require('../helpers/db');
const bcrypt = require('bcrypt');
const mail = require('../helpers/mail');
const util = require('../util');
const { loginValidation } = require('../helpers/validate');

exports.allStudent = (req, res) => {
  let sql = 'SELECT id, first_name, last_name, email, created_at FROM students';
  db.query(sql, (err, data) => {
    if (err) throw err
    res.json({
      message: 'success',
      data
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
    let date = util.getDateTime()
    let newUser = {
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      password: student.password,
      guardian_id : student.guardian,
      created_at: date,
      updated_at: date
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
  res.status(201).json({
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
exports.studentLogin = (req, res) => {
  const { error } = loginValidation(req.body);
  if(error) res.status(400).json({message:error.details[0].message})
  let sql = `SELECT * FROM students WHERE email = '${req.body.email}'`;
  db.query(sql,(err, result) => {
    if (err) throw err
    if (Array.isArray(result) && result.length) {
      let fetchedUser = result[0]
      bcrypt.compare(req.body.password, fetchedUser.password, function(err, isMatch) {
        // result == true
        if (isMatch) {
          let student = {
            first_name: fetchedUser.first_name,
            last_name: fetchedUser.last_name,
            email: fetchedUser.email
          }
          jwt.sign({ student }, 'studentsecretkey', (err, token) => {
            res.json({
              token,
              message: 'Login successful'
            });
          })
        } else {
          res.json({
            message: 'Incorrect Login Details'
          })
        }
      });
    } else {
      res.json({
        message: 'Incorrect Login Details',
      })
    }
    
  })
}
exports.fetchWardsGuardian = (req, res) => {
  let sql = `SELECT id, first_name, last_name, email, created_at FROM guardians where id = ${req.params.id}`;
  db.query(sql, (err, data) => {
    if (err) throw err
    res.json({
      message: 'success',
      data
    })
  });
}