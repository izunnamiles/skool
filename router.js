const express = require('express');
const router = express.Router();
const verifyToken = require('./config/verify')
const userController = require('./controllers/userController');
const studentController = require('./controllers/studentController');

router.get('/', verifyToken, userController.index);
router.post('/login', userController.login);
router.post('/register', userController.createUser);
router.get('/users', userController.users);
router.get('/user/:id', userController.getUser);
router.put('/user/:id', userController.updateUser);
router.get('/students', verifyToken, studentController.allStudent);
router.post('/student/register', studentController.studentRegister);
module.exports = router