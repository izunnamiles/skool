const express = require('express');
const router = express.Router();
const { verifyToken } = require('./helpers/middleware')
const userController = require('./controllers/userController');
const studentController = require('./controllers/studentController');
const guardianController = require('./controllers/guardianController');
const tutorController = require('./controllers/tutorController');

router.get('/', verifyToken, userController.index);
router.post('/login', userController.login);
router.post('/register', userController.createUser);
router.get('/users', userController.users);
router.get('/user/:id', userController.finduser);
router.put('/user/:id', userController.updateUser);
router.get('/students', verifyToken, studentController.allStudent);
router.post('/student/register', studentController.studentRegister);
router.post('/student/login', studentController.studentLogin);
router.get('/student/:id/guardian', studentController.fetchWardsGuardian);
router.get('/guardians', verifyToken, guardianController.fetchGuardians);
router.post('/guardian/register', guardianController.guardianRegister);
router.post('/guardian/login', guardianController.guardianLogin);
router.get('/guardian/:id/wards', guardianController.fetchWards);
router.post('/tutor/search', guardianController.searchGuardians);
router.post('/tutor/login', tutorController.login);
router.post('/tutor/register', tutorController.registerTutor);
router.get('/tutors', tutorController.tutors);
router.get('/tutor/:id', tutorController.getTutor);
router.put('/tutor/:id', tutorController.update);

module.exports = router