
const request = require('supertest');
const app = require('../../app'); 
jest.setTimeout(30000)

let token;
beforeAll((done) => {
    request(app)
      .post('/authenticate/login')
      .send({
        userName: "kaerwyn",
        password: "test",
      })
      .end((err, response) => {
        token = response.body.token; 
        done();
      });
  });

describe('Integration test: Tasks', () => {
    let agent = request.agent(app);
    test('Test 1 View tasks', () => {
      return agent
        .get('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.text).toEqual(expect.anything());
        });
    });

    test('Test 1 create tasks', () => {
      return agent
        .post('/createTask')
        .send({taskName:"Integration Testing",
          description:"This task is added due to integration testing",
          connectionID:"1234",
          dueDate:"2021-10-28",
          wantNotified:true})
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.text).toEqual(expect.anything());
        });
    });

    
});