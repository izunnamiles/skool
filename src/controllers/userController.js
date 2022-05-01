const jwt = require('jsonwebtoken');
const mail = require('../helpers/mail');
const bcrypt = require('bcrypt');
const { loginValidation, registerValidation, updateValidtion } = require('../helpers/validate');
const User = require('../models/User');

exports.index = (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.status(403);
    } else {
      res.json({
        data: 'data',
        authData
      });
    }
  })
}

exports.login = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) res.status(400).json({
    message: error.details[0].message
  })
  const user = await User.findOne({
    where: { email: req.body.email },
    attributes: ['email', 'password']
  }).catch(err => console.log(err));
  if (user === null) {
    res.status(422).json({ message: 'Invalid login details'});
  }
  const match = await bcrypt.compare(req.body.password, user.password);
  if(!match) {
    res.status(422).json({ message: 'Invalid login details'});
  }
  jwt.sign({ user }, 'secretkey', (err, token) => {
    res.json({
      token,
      message: 'Login successful'
    });
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
 
  const user = await User.findOne({ where: { email: newUser.email } }).catch(err => console.log(err));
  if (user !== null) {
    res.status(400).json({ message: 'Email exists' });
  }
  
  newUser.password = await bcrypt.hash(newUser.password, 10);
  User.create(newUser)
  .then(() => {
    mail(newUser.email, 'Account registration', '<p>Welcome to our platform</p>')
    res.status(201).json({
      message: 'User registered'
    })
  })
  .catch(err => console.log(err));
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
exports.updateUser = async (req, res) => {
  const user = await User.findByPk(req.params.id)
  .catch(err => console.log(err));
  if (user === null) {
    res.status(422).json({ message: 'User does not exist'});
  }
  const updateUser = {
    first_name:req.body.first_name ? req.body.first_name : user.first_name,
    last_name:req.body.last_name ? req.body.last_name : user.last_name,
    email: req.body.email? req.body.email : user.email,
  }
  const { error, value } = updateValidtion(updateUser);
  if (error) res.status(422).json({
    message: error.details[0].message.replace(/"([^"]+(?="))"/g, '$1')
  })
  const newMail = req.body.email && user.email !== req.body.email;
  const checkEmailExist = await User.findOne({
    where: { email: req.body.email }
  }).catch(err => console.log(err));
  if (checkEmailExist !== null &&  newMail) {
    res.status(422).json({ message: 'User does not exist'});
  }

  Object.assign(user, value);
  await user.save()
  .then(() => {
    res.json({
      message: "Record updated"
    })
  })
  .catch(err => console.log(err));
}