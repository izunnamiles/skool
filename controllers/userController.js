const jwt = require('jsonwebtoken');
const db = require('../config/db');
const mail = require('../config/mail');
const bcrypt = require('bcrypt');

db.getConnection((err) => {
  if (err) {
    throw err
  } else {
    console.log('connected')
  }
});
exports.index = (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        data: 'data',
        authData
      });
    }
  })
}
exports.login =  (req, res) => {
  let sql = `SELECT * FROM tutors WHERE email = '${req.body.email}'`;
  db.query(sql,(err, result) => {
    if (err) throw err
    if (Array.isArray(result) && result.length) {
      let fetchedUser = result[0]
      bcrypt.compare(req.body.password, fetchedUser.password, function(err, isMatch) {
        // result == true
        if (isMatch) {
          let user = {
            first_name: fetchedUser.first_name,
            last_name: fetchedUser.last_name,
            email: fetchedUser.email
          }
          jwt.sign({ user }, 'secretkey', (err, token) => {
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
exports.createUser = (req, res) => {
  let newUser = {
    first_name:req.body.first_name,
    last_name:req.body.last_name,
    email: req.body.email,
    password:req.body.password
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash)=> {
        // Store hash in your password DB.
        if(err) throw err
        newUser.password = hash
        let sql = "INSERT into tutors SET ?";
        db.query(sql, newUser,(err) => {
          if (err) throw err
          mail(newUser.email,'Account registration','<p>Welcome to our platform</p>')
          return res.json({
            message:'User registered'
          });
        })
    });
  });
  
}

exports.users = (req, res) => {
  let sql = "SELECT * from tutors";
  db.query(sql,(err, results) => {
    if (err) throw err
    return res.json({
      message: 'Records fetched',
      data: results
    });
  })
}
exports.getUser = (req, res) => {
  let sql = `SELECT * FROM tutors WHERE id = ${req.params.id}`;
  db.query(sql,(err, results) => {
    if (err) throw err
    return res.json({
      message: 'Records fetched',
      data: results
    });
  })
}

exports.updateUser = (req, res) => {
  let sql = `UPDATE tutors SET first_name = '${req.body.first_name}',last_name = '${req.body.last_name}' WHERE id = ${req.params.id}`;
  db.query(sql,(err) => {
    if (err) throw err
    return res.json({
      message: 'Records updated',
    });
  })
}