const request = require('supertest');
const app = require("../server");

describe("Backend API Tests", () => {
    if("should return 200 for the home route", async () => {
        const res = await request(app).get("/");
        expect(res.status).toBe(200);
        expect (res.body.message).toBe("Welcome to Student Hub");
    });

    it("should return 404 for a route that does not exist", async () => {
        const res = await request(app).get("/invalidroute");
        expect(res.status).toBe(404);
    });

    it("register a new user", async () => {
        const res = await request(app)
            .post("/routes/auth/signup")
            .send({
                email: "testuser@calvin.edu",
                password: "password",
                firstName: "Test",
                lastName: "User"
            });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("User created successfully");
});

    it("login an existing user", async () => {
        const res = await request(app)
            .post("/routes/auth/login")
            .send({
                email: "testuser@calvin.edu",
                password: "password"
            });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("User logged in successfully");
    });
});