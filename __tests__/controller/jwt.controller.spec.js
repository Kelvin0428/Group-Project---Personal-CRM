//code skeleton from web info tech S1 2021 - workshop 11

//from memory, this was somewhat difficult last semester - we ended up hardcoding in a jwt token to test lol
//looking online there's definitely strategies to test passport authentication

//import necessary libraries
//need to also import controllers, eg.

/*   require('../../controllers/authorController');    const Author = require('../../models/author'); */ 

describe('jwtCheck', function () {

    const mockResponse = {
                         
        render: jest.fn()     
    }    
    const mockRequest = {

    }

    describe('getAllAuthor', function() {

        test("the render method should have been called", function(){
            expect(mockResponse.render).toHaveBeenCalledTimes(1); 
        })
        test("should   have   rendered   the   authorlist   template",   function(){

        })  
    });

    beforeAll(() => {
        // clear the render method (also read about mockReset)         
        mockResponse.render.mockClear();         
        // mock the Mongoose find() method return a         
        // dummy list of authors         
        Author.find = jest.fn().mockResolvedValue([{
            id: 1234,                 
            first_name: "test1_fn",                 
            last_name: "test1_ln"},             
            {                
                id: 1235,                 
                first_name: "test2_fn",                 
                last_name: "test2_ln"}]);         
                // We are using the lean() method, so need to          
                // mock that as well. I'm mocking the function         
                // to return Plain Old JavaScript Object (POJO)         
                Author.find.mockImplementationOnce(() => ({             
                    lean: jest.fn().mockReturnValue([{                     
                        id: 1234,                     
                        first_name: "test1",                     
                        last_name: "test1"},                 
                        {                    
                            id: 1235,                     
                            first_name: "test2",                     
                            last_name: "test2"}]),         
                        }));         
                        // call the controller function before testing various properties of        
                        // it         
                        authorController.getAllAuthors(mockRequest, mockResponse);       
                    });
});