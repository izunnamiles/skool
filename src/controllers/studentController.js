const db = require('../helpers/db');
const bcrypt = require('bcrypt');
const mail = require('../helpers/mail');
const util = require('../util');
const { loginValidation } = require('../helpers/validate');
const Student = require('../models/Student');
const Guardian = require('../models/Guardian');
const User = require('../models/User');
const { use } = require('../router');

exports.students =  async (req, res) => {
  const students = await Student.findAll().catch(err => console.log(err))
  res.json({
    message: 'success',
    data: students
  })
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
}
exports.studentLogin = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) res.status(400).json({ message: error.details[0].message })
  const checkEmailExist = await Student.findOne({ where: { email: req.body.email }, attributes:['email,password'] })
    .catch(err => console.log(err));
  if (checkEmailExist == null) res.json({
    message: 'Incorrect Login Details'
  });
  let sql = `SELECT * FROM students WHERE email = '${req.body.email}'`;
  const isMatch = await bcrypt.compare(req.body.password, checkEmailExist.password)
  if(!isMatch) res.json({
    message: 'Incorrect Login Details'
  });
  let student = {
    first_name: checkEmailExist.first_name,
    last_name: checkEmailExist.last_name,
    email: checkEmailExist.email
  }
  jwt.sign({ student }, 'studentsecretkey', (err, token) => {
    res.json({
      token,
      message: 'Login successful'
    });
  })
}
exports.fetchWardsGuardian = async (req, res) => {
  Student.belongsTo(Guardian, { as: 'guardian' });
  const student = await Student.findByPk(req.params.id, {include: 'guardian'})
    .catch(err => console.log(err));
  res.json({
    message: 'success',
    data: student.guardian
  })
}