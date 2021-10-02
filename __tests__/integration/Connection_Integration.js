const request = require('supertest')
const app = require('../../app')
const { PersonalUser, Usernis } = require('../../models/db');


let token;

jest.setTimeout(30000)

beforeAll((done) =>{
    request(app)
    .post('/authenticate/login')
    .send({
        userName:"frank",
        password:"123"
    })
    .end((err,response)=>{
        token = response.body.token
        done();
    })
})


describe('GET /connections' ,() => {
    test('It response with a connection list with id and name', async () =>{
        return request(app)
        .get('/connections')
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toContain("frank wan")
          });

    })

})

describe('POST /createUser' ,() => {
    test("user's connections should include the created user", async () =>{
        return request(app)
        .post('/createUser')
        .send({
            nameFamily:"test",
            nameGiven:"test"
        })
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.type).toBe('application/json');
          });

    })

    afterAll(async()=>{
        const unis = await Usernis.findOne({fullName:"test test"})
        const user = await PersonalUser.findOne({userName:"frank"})
        for(const obj of user.connections.cnis){
            if(obj.id.equals(unis._id)){
                user.connections.cnis.pull(obj)
            }
        }
        await Usernis.findOneAndDelete({fullName:"test test"})
        user.save()
    })

})