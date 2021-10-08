const request = require('supertest')
const app = require('../../app')
const { Event } = require('../../models/db');


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


describe('Event Testing' ,() => {
    test('Test 1: Create event', async () =>{
        return request(app)
        .post('/createEvent')
        .send({
            eventDate:2020-1-1,
            eventName:'Integration testing',
            attendee:["614974267dd4443287f05382","6149745c7dd4443287f05388"]
        })
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toContain("create successful")
          });
    })

    test('Test 2: View all events',async ()=>{
        return request(app)
        .get('/events')
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.type).toBe('application/json');
          });
    })

    test('Test 3: View one event', async () =>{
        let event = await Event.findOne({eventName:'Integration testing'})
        return request(app)
        .get('/event/' + event._id)
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toContain("Integration testing")
          });

    })

    test('Test 4: edit one event',async ()=>{
        let event = await Event.findOne({eventName:'Integration testing'})
        return request(app)
        .post('/event/edit/' + event._id)
        .send({
            description:"this is for testing only"
        })
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toContain("this is for testing only")
          });
    })


    test('Test 5: remove attendee from the event',async() =>{
        let event = await Event.findOne({eventName:'Integration testing'})
        return request(app)
        .post('/event/' + event._id +'/removeAttendee')
        .send({id:'614974267dd4443287f05382'})
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toContain("remove successful")
          });
    })

    test('Test 6: delete event', async () =>{
        let event = await Event.findOne({eventName:'Integration testing'})
        return request(app)
        .get('/event/delete/' +event._id)
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toContain("delete successful")
          });
    })

})