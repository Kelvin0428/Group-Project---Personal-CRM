const mongoose = require('mongoose')
const { PersonalUser } = require('../../models/db');
const AuthenController = require('../../Controllers/AuthenController.js')

describe("Unit testing signup", () => {
    const req = {
        params: {id:"1234"},
    };
    const res = {
        send: jest.fn()
    };
    beforeAll(async () => {
        res.send.mockClear();
        const obj = {
            _id: '1234',
            email: "ka@gmail.com",
            userName: 'ka',
            personalInfo: {nameFamily:"family",nameGiven:"Given"},
            active: true,
            secretID: null,
            __v: 0
        };
        PersonalUser.findOneAndUpdate = jest.fn().mockResolvedValue(obj);
        AuthenController.activateAccount(req, res);
      });
    test("Test case 1: activate account \
        ", async () => {
        expect(res.send).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith({
            _id: '1234',
            email: "ka@gmail.com",
            userName: 'ka',
            personalInfo: {nameFamily:"family",nameGiven:"Given"},
            active: true,
            secretID: null,
            __v: 0
        });
    });
  });

