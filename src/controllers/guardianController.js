const Guardian = require('../models/Guardian');
const bcrypt = require('bcrypt');
const mail = require('../helpers/mail');
const jwt = require('jsonwebtoken');
const { QueryTypes } = require('sequelize');
const { loginValidation, registerValidation } = require('../helpers/validate');
const Student = require('../models/Student');

exports.guardians = async (req, res) => {
  const guardians = await Guardian.findAll().catch(err => console.log(err));
  res.status(200).json({
    message: 'Record fetched',
    data: guardians
  })
}
exports.searchGuardians = async(req, res) => {
  let query = `${req.query.q}%`;
  const search = await sequelize.query(
    'SELECT id, first_name, last_name, email FROM guardians WHERE first_name LIKE :q OR last_name LIKE :q',
    {
      replacements: { q: query },
      type: QueryTypes.SELECT
    }
  ).catch(err => console.log(err));
  if (search == null) {
    res.status(404).json({
      message: 'No record found'
    });
  } else {
    res.json({
      message: 'Record fetched',
      data:search
    });
  }
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
    const checkEmailExist = Guardian.findOne({
      where: { email: req.body.email },
      attributes: ['email']
    }).catch(err => console.log(err));
    if (checkEmailExist !== null) {
      res.json({
        message:'Email already exist'
      })
    }
    newGuardian.password = bcrypt.hash(newGuardian.password, 10);
    
    User.create(newUser)
    .then(() => {
      mail(newUser.email, 'Account registration', '<p>Welcome to our platform</p>')
      res.status(201).json({
        message: 'User registered'
      })
    })
    .catch(err => console.log(err));
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
exports.fetchWards = async (req, res) => {
  Guardian.hasMany(Student,{ as: 'ward' })
  const tasks = await Guardian.findByPk(req.params.id, { include: 'ward' })
    .catch(err => console.log(err));
  
  res.json({
    message: 'success',
    data: tasks.ward
  })
}