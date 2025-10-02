const app = require("../app")
const req = require("supertest")

describe("test app",()=>{
    test("Home Page",async ()=>{
        return await req(app).get("/").expect(200)
    }, 1000)

    /* test("Prediction Page",async ()=>{
        return await req(app).get("/predicate").expect(200)
    }, 1000)

    test("Contribute Page",async ()=>{
        return await req(app).get("/contribute").expect(200)
    }, 1000)

    test("Analysis Page",async ()=>{
        return await req(app).get("/analysis").expect(200)
    }, 1000)
    
    test("Signup Page",async ()=>{
        return await req(app).get("/signup").expect(200)
    }, 1000)

    test("Login Page",async ()=>{
        return await req(app).get("/login").expect(200)
    }, 1000)

    test("Not Found Page",async ()=>{
        return await req(app).get("/not-exsit").expect(404)
    }, 1000) */
})