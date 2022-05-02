const db = require('../helpers/db');
const Guardian = require('../models/Guardian');
const bcrypt = require('bcrypt');
const mail = require('../helpers/mail');
const jwt = require('jsonwebtoken');
const { loginValidation, registerValidation } = require('../helpers/validate');

exports.guardians = async (req, res) => {
  const guardians = await Guardian.findAll().catch(err => console.log(err));
  res.status(200).json({
    message: 'Record fetched',
    data: guardians
  })
}
exports.searchGuardians = (req, res) => {
  let query = `'%${req.query.q}%'`;
  let sql = `SELECT id, first_name, last_name, email FROM guardians WHERE first_name LIKE ${query} OR last_name LIKE ${query}`;
  db.query(sql, (err, data) => {
    if (err) throw err
    if (!data.length) {
      res.status(404).json({
        message: 'No record found',
        data
      })
    } else {
      res.json({
        message: 'Record fetched',
        data
      })
    }
  });
}
exports.createGuardian = async (req, res) => {
  let guardians = req.body ;
  if (!Array.isArray(req.body)) {
    let data = [];
    data.push(req.body)
    guardians = data;
  } 
  const { error } = registerValidation(req.body);
  if (error) res.status(400).json({
    message: error.details[0].message.replace(/"([^"]+(?="))"/g, '$1')
  })
  guardians.forEach(guardian => {
    let newGuardian = {
      first_name: guardian.first_name,
      last_name: guardian.last_name,
      email: guardian.email,
      password: guardian.password,
    } 
    newGuardian.password = await bcrypt.hash(newGuardian.password, 10);
    // bcrypt.genSalt(10, (err, salt) => {
    //   bcrypt.hash(newGuardian.password, salt, (err, hash) => {
    //     // Store hash in your password DB.
    //     if (err) throw err
    //     newUser.password = hash
    //     let sql = "INSERT into guardians SET ?";
    //     return db.query(sql, newGuardian, (err,result) => {
    //       if (err) throw err
    //       mail(newGuardian.email, 'Account registration', '<p>Welcome to our platform</p>')
      
    //     })
    //   });
    // })
    newUser.password = await bcrypt.hash(newUser.password, 10);
  User.create(newUser)
  .then(() => {
    mail(newUser.email, 'Account registration', '<p>Welcome to our platform</p>')
    res.status(201).json({
      message: 'User registered'
    })
  })
  .catch(err => console.log(err));
  })
  res.status(201).json({
    message:'Registration successful '
  })
}
exports.login = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) res.status(400).json({ message: error.details[0].message.replace(/"([^"]+(?="))"/g, '$1') })
  const checkEmailExist = await Guardian.findOne({
    where: { email: req.body.email },
    attributes: ['email', 'password']
  }).catch(err => console.log(err));
  if (checkEmailExist == null) {
    res.json({
      message:'Invalid login details'
    })
  }
  const match = await bcrypt.compare(req.body.password, checkEmailExist.password);
  if (!match)  res.status(422).json({message:"Invalid login details"})
  let guardian = {
    first_name: checkEmailExist.first_name,
    last_name: checkEmailExist.last_name,
    email: checkEmailExist.email
  }
  jwt.sign({ guardian }, 'parentsecretkey', (err, token) => {
    res.json({
      token,
      message: 'Login successful'
    });
  })
}
exports.fetchWards = (req, res) => {
  let sql = `SELECT id, first_name, last_name, email, created_at FROM students where guardian_id = ${req.params.id}`;
  db.query(sql, (err, data) => {
    if (err) throw err
    let kids = []
    data.map((ward) => {
      let array = {
        id: ward.id,
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