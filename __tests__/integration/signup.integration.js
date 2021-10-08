const request = require('supertest');
const app = require('../../app'); 
jest.setTimeout(30000)
const mongoose = require('mongoose')
const { PersonalUser } = require('../../models/db');
// -------------------Section below is adapted from  https://stackoverflow.com/questions/53420562/mock-nodemailer-createtransport-sendmail-with-jest 
// set of nodemailer function mocking
const MockMailer = jest.fn(); 
jest.mock("nodemailer");
const nodemailer = require("nodemailer"); 
nodemailer.createTransport.mockReturnValue({"sendMail":MockMailer});
beforeEach( () => {
    MockMailer.mockClear();
    nodemailer.createTransport.mockClear();
});
//delete the account created after all has been tested, so the error of duplicated usernames will not occcur
afterAll( async()=>{
  await PersonalUser.deleteOne({userName:"Integration"});
})

describe("Signup", () => {
    test("Integration Test: Send Acitvation Mail", async () => {
        let email = "ka@gmail.com"
        //requesting and posting to signup route
        const response = await request(app)
            .post("/authenticate/signup")
            .send({ userName:"Integration",password:"Integration testing",email: "lll",nameGiven:"Testing",nameFamily:"Integration"})
            .set("Accept", "application/json")
        //status 200 signifies server no errors
        expect(response.status).toBe(200);
        //the mailer should be only called once, to send the email once
        expect(MockMailer).toHaveBeenCalledTimes(1);
        //the text response sent through res.send should be sign up successful instead of other error messages
        expect(response.text).toEqual('Sign Up Successful');
    });
});
//- -------------------------------------------------------------------------------------------------

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