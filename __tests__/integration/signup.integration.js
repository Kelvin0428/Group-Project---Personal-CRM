
// supertest allows us to send HTTP requests to our app
// install it: npm install supertest --save-dev
const request = require('supertest');

// since this file is inside __test__/integration folder, we will
// need to go back two levels ('../../') to get to the root folder
// and then we import our app (from app.js)
// IMPORTANT: make sure your export your app in app.js .e.g.
// module.exports = app
const app = require('../../app'); // the express server

const sendMailMock = jest.fn(); // this will return undefined if .sendMail() is called

// In order to return a specific value you can use this instead
// const sendMailMock = jest.fn().mockReturnValue(/* Whatever you would expect as return value */);

jest.mock("nodemailer");

const nodemailer = require("nodemailer"); //doesn't work with import. idk why
nodemailer.createTransport.mockReturnValue({"sendMail": sendMailMock});

beforeEach( () => {
    sendMailMock.mockClear();
    nodemailer.createTransport.mockClear();
});
jest.setTimeout(30000)
describe("", () => {

    test("", async () => {
        // 1 - 200 status code; 2 - check email was sent
        let email = "ka@gmail.com"
        const response = await request(app)
            .post("/authenticate/signup")
            // global variable
            .send({ userName:"beeboooop",password:"testing",email: "kaar@gmail.com",nameGiven:"Givnet",nameFamily:"family" })
            .set("Accept", "application/json")

        // should complete successfully
        expect(response.status).toBe(200);

        // TODO not sure how to express the expect statement here
        expect(sendMailMock).toHaveBeenCalled();
    });
});