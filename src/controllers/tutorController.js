const jwt = require('jsonwebtoken');
const mail = require('../helpers/mail');
const bcrypt = require('bcrypt');
const { loginValidation, registerValidation } = require('../helpers/validate');
const Tutor = require('../models/Tutor');

exports.login = async(req, res) => {
  const { error } = loginValidation(req.body);
  if (error) res.status(422).json({ message: error.details[0].message.replace(/"([^"]+(?="))"/g, '$1') })
  const checkEmailExist = await Tutor.findOne({ where: { email: req.body.email }, attributes:['email,password'] })
    .catch(err => console.log(err));
  if (checkEmailExist == null) res.status(422).json({
    message: 'Incorrect Login Details'
  });
  const isMatch = await bcrypt.compare(req.body.password, checkEmailExist.password)
  if(!isMatch) res.json({
    message: 'Incorrect Login Details'
  });
  let tutor = {
    first_name: checkEmailExist.first_name,
    last_name: checkEmailExist.last_name,
    email: checkEmailExist.email
  }
  jwt.sign({ tutor }, 'teachersecretkey', (err, token) => {
    res.json({
      token,
      message: 'Login successful'
    });
  })
  
}

exports.registerTutor = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) res.status(400).json({
    message: error.details[0].message.replace(/"([^"]+(?="))"/g, '$1')
  })
  let newTutor = {
    first_name:req.body.first_name,
    last_name:req.body.last_name,
    email: req.body.email,
    password: req.body.password,
  }
  const tutor = await Tutor.findOne({ where: { email: newTutor.email } }).catch(err => console.log(err));
  if (tutor !== null) {
    res.status(400).json({ message: 'Email exists' });
  }
  newTutor.password = await bcrypt.hash(newTutor.password, 10);
  await Tutor.create(newTutor)
  .then(() => {
    mail(newTutor.email, 'Account registration', '<p>Welcome to our platform</p>')
    res.status(201).json({
      message: 'User registered'
    })
  })
  .catch(err => console.log(err));
}

exports.tutors = async (req, res) => {
  const tutors = await Tutor.findAll().catch(err => console.log(err));
  res.status(200).json({
    message: 'Record fetched',
    data: tutors
  })
}

exports.getTutor = async (req, res) => {
  const data = await Tutor.findByPk(req.params.id).catch( err => console.log(err));
  res.json({
    message: 'Records fetched',
    data
  });
}

exports.update = async (req, res) => {
  const tutor = await Tutor.findByPk(req.params.id)
  .catch(err => console.log(err));
  if (tutor === null) {
    res.status(422).json({ message: 'tutor does not exist'});
  }
  const updateRocrd = {
    first_name:req.body.first_name ? req.body.first_name : tutor.first_name,
    last_name:req.body.last_name ? req.body.last_name : tutor.last_name,
    email: req.body.email? req.body.email : tutor.email,
  }
  const { error, value } = updateValidtion(updateRocrd);
  if (error) res.status(422).json({
    message: error.details[0].message.replace(/"([^"]+(?="))"/g, '$1')
  })
  const newMail = req.body.email && tutor.email !== req.body.email;
  const checkEmailExist = await Tutor.findOne({
    where: { email: req.body.email }
  }).catch(err => console.log(err));
  if (checkEmailExist !== null &&  newMail) {
    res.status(422).json({ message: 'User does not exist'});
  }

  Object.assign(tutor, value);
  await tutor.save()
  .then(() => {
    res.json({
      message: "Record updated"
    })
  })
  .catch(err => console.log(err));
}