
const request = require('supertest');
const app = require('../../app'); 
jest.setTimeout(30000)
const { PersonalUser } = require('../../models/db');
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
  let task;
beforeEach (async()=>{
  let user = await PersonalUser.findOne({userName:"kaerwyn"});
  console.log(user.tasks);
  task = user.tasks[user.tasks.length - 1];
})
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
    let newTask;
    test('Test 2 create tasks', () => {
      return agent
        .post('/createTask')
        .send({taskName:"Integration Testing",
          description:"This task is added due to integration testing",
          dueDate:"2021-10-28",
          wantNotified:true})
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          newTask = JSON.parse(response.text)[JSON.parse(response.text).length - 1];
          expect(newTask.taskName).toEqual('Integration Testing');
        })
    });
    test('Test 3 edit tasks', () => {
      return agent
        .post('/task/edit/' + task._id)
        .send({taskName:"Edited Integration Testing",
          description:"This task is added due to integration testing & is edited",
          wantNotified:false})
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          newTask = JSON.parse(response.text);
          expect(newTask.taskName).toEqual('Edited Integration Testing');
        });
    });

    test('Test 4 complete tasks', () => {
      return agent
        .get('/task/complete/' + task._id)
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          newTask = JSON.parse(response.text);
          expect(newTask.status).toEqual('completed');
        });
    });

    test('Test 4 remove tasks', () => {
      return agent
        .get('/task/remove/' + task._id)
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          newTask = JSON.parse(response.text)[JSON.parse(response.text).length - 1];
          expect(newTask._id).toEqual(expect.not.stringMatching(''+task._id));
        });
    });
    
});