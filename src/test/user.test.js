const request = require("supertest");
const app = require("../app");
const prisma = require("../config/prisma");
const { _removeAllUsers } = require("../controller/UserController");
const endpointUser = "/api/users";

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await _removeAllUsers(); // bersihin data
});
const userData = {
  name: "rifqi",
  email: "rifqi@gmail.com",
  password: "rifqi123",
  role: "ADMIN",
};
const createAndLoginUser = async () => {
  const newUser = await request(app).post(endpointUser).send(userData);
  const login = await request(app)
    .post(`${endpointUser}/login`)
    .send({ email: userData.email, password: userData.password });
  const { email, id, name, role } = newUser.body.data;
  const data = {
    token: login.body.data.token,
    user: { id, email, name, role },
  };
  return data;
};

describe("API Users", () => {
  test("should be able to create user", async () => {
    const res = await request(app).post(endpointUser).send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("email", "rifqi@gmail.com");
  });
  //get all
  test("should be able to get all users", async () => {
    const res = await request(app).get(endpointUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    // expect(res.body.data).toEqual([]);
  });

  //get one
  test("should be able get one user", async () => {
    const dataLogin = await createAndLoginUser();
    const res = await request(app)
      .get(`${endpointUser}/${dataLogin.user.id}`)
      .set("Authorization", `Bearer ${dataLogin.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.status).toBe("success");
    expect(res.body.data.id).toBe(dataLogin.user.id);
    expect(res.body.data.name).toBe("rifqi");
    expect(res.body.data.email).toBe("rifqi@gmail.com");
  });

  //update user
  test("should be able update user", async () => {
    const dataLogin = await createAndLoginUser();
    const res = await request(app)
      .patch(`${endpointUser}/${dataLogin.user.id}`)
      .send({
        name: "rifqi update",
      })
      .set("Authorization", `Bearer ${dataLogin.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.status).toBe("success");
  });

  //remove
  test("should be able remove user", async () => {
    const dataLogin = await createAndLoginUser();
    const res = await request(app)
      .delete(`${endpointUser}/${dataLogin.user.id}`)
      .set("Authorization", `Bearer ${dataLogin.token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBeTruthy();
  });

  //login
  test("should be able login", async () => {
    const user = await request(app).post(endpointUser).send(userData);
    const { email } = user.body.data;
    const res = await request(app)
      .post(`${endpointUser}/login`)
      .send({ email, password: "rifqi123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("message");
    expect(res.body.data.token).toBeDefined();
  });
  //currentuser
  test("should be able get current user", async () => {
    const dataLogin = await createAndLoginUser();
    const res = await request(app)
      .get(endpointUser + "/currentUser")
      .set("Authorization", `Bearer ${dataLogin.token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
  });

  //test
  // test("should return 401 if no token is provided", async () => {
  //   const res = await request(app).get(endpointUser + "/currentUser");
  //   expect(res.status).toBe(401);
  //   expect(res.body).toEqual({ message: "Unauthorized" });
  // });
});
