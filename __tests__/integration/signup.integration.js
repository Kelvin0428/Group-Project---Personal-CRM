//node mailer test code inspired from  https://stackoverflow.com/questions/53420562/mock-nodemailer-createtransport-sendmail-with-jest 

const request = require('supertest');
const app = require('../../app'); 
jest.setTimeout(30000)

const sendMailMock = jest.fn(); 
jest.mock("nodemailer");
const nodemailer = require("nodemailer"); 
nodemailer.createTransport.mockReturnValue({"sendMail": sendMailMock});
beforeEach( () => {
    MockMailer.mockClear();
    nodemailer.createTransport.mockClear();
});
describe("Signup", () => {
    test("Integration Test: Send Acitvation Mail", async () => {
        let email = "ka@gmail.com"
        const response = await request(app)
            .post("/authenticate/signup")
            .send({ userName:"beeboooop",password:"testing",email: "kaar@gmail.com",nameGiven:"Givnet",nameFamily:"family" })
            .set("Accept", "application/json")
        expect(response.status).toBe(200);
        expect(MockMailer).toHaveBeenCalled();
    });
});


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

describe('Integration test: Login & following features', () => {
    let agent = request.agent(app);
    console.log(token);
    test('Test 1 reset password', () => {
      return agent
        .post('/authenticate/resetPassword')
        .send({currentPassword:"test",newPassword:"test"})
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.text).toContain('reset password successful');
        });
    });

    
});