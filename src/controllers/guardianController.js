const db = require('../config/db');
const bcrypt = require('bcrypt');
const mail = require('../config/mail');

exports.fetchGuardians = (req, res) => {
  let sql = 'SELECT * FROM guardians';
  db.query(sql, (err, data) => {
    if (err) throw err
    res.json({
      message: 'success',
      data
    })
  });
}
exports.guardianRegister = (req, res) => {
  let guardians = req.body ;
  if (!Array.isArray(req.body)) {
    let data = [];
    data.push(req.body)
    guardians = data;
  } 
  guardians.forEach(guardian => {
    let newGuardian = {
      first_name: guardian.first_name,
      last_name: guardian.last_name,
      email: guardian.email,
      password: guardian.password
    }
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newGuardian.password, salt, (err, hash) => {
        // Store hash in your password DB.
        if (err) throw err
        newUser.password = hash
        let sql = "INSERT into guardians SET ?";
        return db.query(sql, newGuardian, (err,result) => {
          if (err) throw err
          mail(newGuardian.email, 'Account registration', '<p>Welcome to our platform</p>')
      
        })
      });
    })
    
  })
  res.status(201).json({
    message:'Registration successful '
  })
}
exports.guardianLogin = (req, res) => {
  let sql = `SELECT * FROM guardians WHERE email = '${req.body.email}'`;
  db.query(sql,(err, result) => {
    if (err) throw err
    if (Array.isArray(result) && result.length) {
      let fetchedGuardian = result[0]
      bcrypt.compare(req.body.password, fetchedGuardian.password, function(err, isMatch) {
        // result == true
        if (isMatch) {
          let guardian = {
            first_name: fetchedGuardian.first_name,
            last_name: fetchedGuardian.last_name,
            email: fetchedGuardian.email
          }
          jwt.sign({ guardian }, 'parentsecretkey', (err, token) => {
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
exports.fetchWards = (req, res) => {
  let sql = `SELECT * FROM students where guardian_id = ${req.params.id}`;
  db.query(sql, (err, data) => {
    if (err) throw err
    let kids = []
    data.map((ward) => {
      let array = {
        name: ward.first_name + ' ' + ward.last_name,
        email: ward.email,
        registered_on: new Date(ward.created_at).toLocaleDateString()
      }
      kids.push(array)
    })
    res.json({
      message: 'success',
      data: kids
    })
  });
}