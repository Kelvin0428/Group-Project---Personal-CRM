const request = require('supertest')
const app = require('../../app')
const { PersonalUser } = require('../../models/db');

let token;

jest.setTimeout(30000)

beforeAll((done) =>{
    request(app)
    .post('/authenticate/login')
    .send({
        userName:"kaerwyn",
        password:"test"
    })
    .end((err,response)=>{
        token = response.body.token
        done();
    })
})

beforeEach (async()=>{
    let user = await PersonalUser.findOne({userName:"kaerwyn"});
    circle = user.circles[user.circles.length - 1];
  })


describe('Integration testing: Cricles',() =>{
    let agent = request.agent(app);
    test('Test 1: create Circles',() =>{
        return agent
        .post('/createCircle')
        .send({tag:'Friend',name:'Friends',description:'Integration testing'})
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          let newCircle = JSON.parse(response.text)[JSON.parse(response.text).length - 1];
          expect(newCircle.name).toEqual('Friends');
        });
    });

    test('Test 2 view all circles', () => {
        return agent
          .get('/circles')
          .set('Authorization', `Bearer ${token}`)
          .then((response) => {
            expect(response.statusCode).toBe(200);
            newCircle = JSON.parse(response.text)[JSON.parse(response.text).length - 1];
            expect(newCircle.name).toEqual(''+circle.name);
          })
      });
    test('Test 3 view one circles', () => {
        return agent
          .get('/circle/' + circle._id)
          .set('Authorization', `Bearer ${token}`)
          .then((response) => {
            expect(response.statusCode).toBe(200);
            newCircle = JSON.parse(response.text);
            expect(newCircle._id).toEqual(''+circle._id);
          })
      });      

    test('Test 4 remove circle', () => {
        return agent
          .get('/circle/delete/' + circle._id)
          .set('Authorization', `Bearer ${token}`)
          .then((response) => {
            expect(response.statusCode).toBe(200);
            newCircle = JSON.parse(response.text)[JSON.parse(response.text).length - 1];
            expect(newCircle._id).toEqual(expect.not.stringMatching(''+circle._id))
          })
      }); 

    
})
