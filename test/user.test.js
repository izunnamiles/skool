const app = require('../src/server');
const request = require('supertest');

test('fetch index without auth', async () => {
  const response = await request(app).get('/api/v1/')
  .expect(403)
});

test('can register', async () => {
  const response = await request(app).post('/api/v1/register')
    .send({
      first_name: 'Nduka',
      last_name: 'Oforka',
      email: "nduka@oforka.com",
      password: "password"
    })
  .expect(201)
});


test('validate password for login', async () => {
  let data = {
    email: "nduka@oforka.com",
    password: ""
  }
  const response = await request(app).post('/api/v1/login')
    .send(data)
  .expect(400)
});