const express = require('express');
const router = express.Router();
const verifyToken = require('./config/verify')
const userController = require('./controllers/userController');
const studentController = require('./controllers/studentController');
const guardianController = require('./controllers/guardianController');

router.get('/', verifyToken, userController.index);
router.post('/login', userController.login);
router.post('/register', userController.createUser);
router.get('/users', userController.users);
router.get('/user/:id', userController.getUser);
router.put('/user/:id', userController.updateUser);
router.get('/students', verifyToken, studentController.allStudent);
router.post('/student/register', studentController.studentRegister);
router.post('/student/login', studentController.studentLogin);
router.get('/guardians', verifyToken, guardianController.fetchGuardians);
router.post('/guardian/register', guardianController.guardianRegister);
router.post('/guardian/login', guardianController.guardianLogin);
router.get('/guardian/:id/wards', guardianController.fetchWards);

module.exports = router