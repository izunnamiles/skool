const app = require('../src/server');
const request = require('supertest');

test('fetch students without auth', async () => {
  const response = await request(app).get('/api/v1/students')
  .expect(403)
});

test('can register new student', async () => {
  const response = await request(app).post('/api/v1/student/register')
    .send({
      first_name: 'Nduka',
      last_name: 'Oforka',
      email: "nduka@oforka.com",
      password: "password"
    })
  .expect(201)
});

test('can register multiple new student', async () => {
  let data = [{
    first_name: 'Nduka',
    last_name: 'Oforka',
    email: "nduka@oforka.com",
    password: "password"
  },{
    first_name: 'Jane',
    last_name: 'Oforka',
    email: "jane@oforka.com",
    password: "password"
  }]
  const response = await request(app).post('/api/v1/student/register')
    .send(data)
  .expect(201)
});

test('validate password for login', async () => {
  let data = {
    email: "nduka@oforka.com",
    password: ""
  }
  const response = await request(app).post('/api/v1/student/login')
    .send(data)
  .expect(400)
});