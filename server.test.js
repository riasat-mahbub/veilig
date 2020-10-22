const app = require('./src/app').app
const req = require('supertest')

describe('Root path', () =>{
    test("Root Path", async () =>{
        const res = await req(app).get('/')
        expect(res.statusCode).toBe(200)      
    })
})

describe('pass/', () =>{
    test("pass/ with no args", async () =>{
        const res = await req(app).get('/pass/')
        expect(res.statusCode).toBe(200)
    })
})

describe('pass/len', () =>{
    test("pass/len with len=5", async () =>{
        const res = await req(app).get('/pass/len=5/')
        expect(res.statusCode).toBe(200)
    })

    test("pass/len with len<5", async () =>{
        const res = await req(app).get('/pass/len=2/')
        expect(res.statusCode).toBe(400)
    })


    test("pass/len with len>200", async () =>{
        const res = await req(app).get('/pass/len=220/')
        expect(res.statusCode).toBe(400)
    })
})

describe('pass/passFlags', () =>{

    test("flags=000", async () =>{
        const res = await req(app).get('/pass/passFlags=000/')
        expect(res.statusCode).toBe(200)
    })

    test("flags=001", async () =>{
        const res = await req(app).get('/pass/passFlags=001/')
        expect(res.statusCode).toBe(200)
    })

    test("flags=010", async () =>{
        const res = await req(app).get('/pass/passFlags=010/')
        expect(res.statusCode).toBe(200)
    })

    test("flags=011", async () =>{
        const res = await req(app).get('/pass/passFlags=011/')
        expect(res.statusCode).toBe(200)
    })

    test("flags=100", async () =>{
        const res = await req(app).get('/pass/passFlags=100/')
        expect(res.statusCode).toBe(200)
    })

    test("flags=101", async () =>{
        const res = await req(app).get('/pass/passFlags=101/')
        expect(res.statusCode).toBe(200)
    })

    test("flags=110", async () =>{
        const res = await req(app).get('/pass/passFlags=110/')
        expect(res.statusCode).toBe(200)
    })

    test("flags=111", async () =>{
        const res = await req(app).get('/pass/passFlags=111/')
        expect(res.statusCode).toBe(200)
    })

})