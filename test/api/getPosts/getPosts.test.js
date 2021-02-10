const chakram = require('chakram')
const { expect } = chakram;

const schema = require('./schema')
const bookingSchema = require('./bookingSchema')
let bookingId = 0

describe('Full Booking Path', () => {
    it('verify multistep API workflow ', async () =>{
        let url = 'https://restful-booker.herokuapp.com/booking'
        let body = {
            "firstname" : "Julia",
            "lastname" : "Brown",
            "totalprice" : 567,
            "depositpaid" : true,
            "bookingdates" : {
                "checkin" : "2020-01-01",
                "checkout" : "2021-01-01"
            },
            "additionalneeds" : "Breakfast,Lunch"
          }
        let options = {
            headers: {
                'content-type': 'application/json',
            }
        }

        let res = await chakram.post(url,body,options)

        let bookingId = res.body.bookingid

        expect(res).to.have.status(200)
        expect(res).to.have.schema(bookingSchema)

        // Use Id to get booking details
        let getResponse = await chakram.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`)
        expect(getResponse).to.have.status(200)
        expect(getResponse.body.firstname).to.equal('Julia')
        expect(getResponse.body.lastname).to.equal('Brown')
        expect(getResponse.body.additionalneeds).to.equal('Breakfast,Lunch')

        // Use Id to update booking details
        url = `https://restful-booker.herokuapp.com/booking/${bookingId}`
        body = {
            "firstname" : "JuliaUpdate",
            "lastname" : "Browns",
            "totalprice" : 567,
            "depositpaid" : true,
            "bookingdates" : {
                "checkin" : "2020-01-01",
                "checkout" : "2021-01-01"
            },
            "additionalneeds" : "Breakfast,Dinner"
        }
        options = {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='
            }
        }

        let putResponse = await chakram.put(url,body,options)
        expect(putResponse).to.have.status(200)
        expect(putResponse.body.firstname).to.equal('JuliaUpdate')
        expect(putResponse.body.lastname).to.equal('Browns')
        expect(putResponse.body.additionalneeds).to.equal('Breakfast,Dinner')
    })
})

describe('Get all posts', ()=>{
    it('verify correct response for valid get post', async ()=>{
       let response = await chakram.get('https://jsonplaceholder.typicode.com/posts')
       expect(response).to.have.schema(schema)
       expect(response).to.have.status(200)
       expect(response).to.have.header("content-type", "application/json; charset=utf-8")
    })
})

describe('Update Post',() =>{
    it('Verify that the post is not updated with an invalid token', async ()=>{
        const url = 'https://restful-booker.herokuapp.com/booking/10'
        const body = {
            "firstname" : "Julia",
            "lastname" : "Browns",
            "totalprice" : 567,
            "depositpaid" : true,
            "bookingdates" : {
                "checkin" : "2020-01-01",
                "checkout" : "2021-01-01"
            },
            "additionalneeds" : "Breakfast,Lunch"
        }
        const options = {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM'
            }
        }
        let res = await chakram.put(url,body,options)

        expect(res).to.have.status(403)
        expect(res.body).to.equal('Forbidden')

    })

    it('Verify that the post is not updated with an invalid body', async ()=>{
        const url = 'https://restful-booker.herokuapp.com/booking/10'
        const body = {
            "lastname" : "Potting",
            "totalprice" : 111,
            "depositpaid" : true,
            "bookingdates" : {
                "checkin" : "2018-01-01",
                "checkout" : "2019-01-01"
            },
            "additionalneeds" : "Breakfast"
        }
        const options = {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='
            }
        }

        let res = await chakram.put(url,body,options)

        expect(res).to.have.status(400)
        expect(res.body).to.equal('Bad Request')

    })
})

describe('Create Booking', ()=>{
    it('verify correct response when booking has been created', async()=>{
        const url = 'https://restful-booker.herokuapp.com/booking'
        const body = {
            "firstname" : "Julia",
            "lastname" : "Brown",
            "totalprice" : 567,
            "depositpaid" : true,
            "bookingdates" : {
                "checkin" : "2020-01-01",
                "checkout" : "2021-01-01"
            },
            "additionalneeds" : "Breakfast,Lunch"
        }
        let res = await chakram.post(url,body,{headers: {'content-type': 'application/json'}})

        // console.log(res)

        expect(res).to.have.schema(bookingSchema)
    })
})