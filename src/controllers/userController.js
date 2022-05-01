const jwt = require('jsonwebtoken');
const db = require('../helpers/db');
const mail = require('../helpers/mail');
const bcrypt = require('bcrypt');
const util = require('../util')
const { loginValidation, registerValidation } = require('../helpers/validate');
const User = require('../models/User');
const { json } = require('express/lib/response');

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
exports.login = (req, res) => {
  const { error } = loginValidation(req.body);
  if(error) res.status(400).json({message:error.details[0].message})
  let sql = `SELECT * FROM users WHERE email = '${req.body.email}'`;
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
exports.createUser = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) res.status(400).json({
    message: error.details[0].message.replace(/"([^"]+(?="))"/g, '$1')
  })
  let newUser = {
    first_name:req.body.first_name,
    last_name:req.body.last_name,
    email: req.body.email,
    password: req.body.password,
  }
  ;
  if (await User.findOne({ where: { email: newUser.email } })) {
    res.status(400).json({
      message: `Email ${newUser.email} is already registered`
    });
  }
  //const user = new User(newUser);
  newUser.password = await bcrypt.hash(newUser.password, 10);
  await User.create(newUser).catch(err => console.log(err)).then(() =>
    res.status(201).json({
      message: 'User registered'
    })
  );
  mail(newUser.email,'Account registration','<p>Welcome to our platform</p>')
  res.status(201).json({
    message:'User registered'
  });
  // bcrypt.genSalt(10, (err, salt) => {
  //   bcrypt.hash(newUser.password, salt, (err, hash)=> {
  //       // Store hash in your password DB.
  //       if(err) throw err
  //       newUser.password = hash
  //     let sql = "INSERT into users SET ?";
  //       db.query(sql, newUser,(err) => {
  //         if (err) throw err
  //         mail(newUser.email,'Account registration','<p>Welcome to our platform</p>')
  //         return res.status(201).json({
  //           message:'User registered'
  //         });
  //       })
  //   });
  // });
  
}
exports.users = async (req, res) => {
  const users = await User.findAll().catch( err => console.log(err));
  res.json({
    message: 'Records fetched',
    data: users
  });
}
exports.finduser = async (req, res) => {
  const data = await User.findByPk(req.params.id).catch( err => console.log(err));
  res.json({
    message: 'Records fetched',
    data
  });
}
exports.updateUser = (req, res) => {
  let sql = `UPDATE users SET first_name = '${req.body.first_name}',last_name = '${req.body.last_name}' WHERE id = ${req.params.id}`;
  db.query(sql,(err) => {
    if (err) throw err
    return res.json({
      message: 'Records updated',
    });
  })
}