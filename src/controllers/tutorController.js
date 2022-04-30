const jwt = require('jsonwebtoken');
const db = require('../config/db');
const mail = require('../config/mail');
const bcrypt = require('bcrypt');
const util = require('../util')
const { loginValidation, registerValidation } = require('../config/validate');

exports.login = (req, res) => {
  const { error } = loginValidation(req.body);
  if(error) res.status(400).json({message:error.details[0].message})
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
          jwt.sign({ user }, 'tutorsecret', (err, token) => {
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

exports.registerTutor = (req, res) => {
  const { error } = registerValidation(req.body);
  if(error) res.status(400).json({message:error.details[0].message})
  let newUser = {
    first_name:req.body.first_name,
    last_name:req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    created_at: util.getDateTime(),
    updated_at: util.getDateTime(),
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
          return res.status(201).json({
            message:'User registered'
          });
        })
    });
  });
  
}

exports.tutors = (req, res) => {
  let sql = "SELECT first_name, last_name, email, created_at from tutors";
  db.query(sql,(err, results) => {
    if (err) throw err
    return res.json({
      message: 'Records fetched',
      data: results
    });
  })
}
exports.getTutor = (req, res) => {
  let sql = `SELECT first_name, last_name, email, created_at FROM tutors WHERE id = ${req.params.id}`;
  db.query(sql,(err, results) => {
    if (err) throw err
    return res.json({
      message: 'Records fetched',
      data: results
    });
  })
}

exports.update = (req, res) => {
  let sql = `UPDATE tutors SET first_name = '${req.body.first_name}',last_name = '${req.body.last_name}' WHERE id = ${req.params.id}`;
  db.query(sql,(err) => {
    if (err) throw err
    return res.json({
      message: 'Records updated',
    });
  })
}