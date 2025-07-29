const request = require("supertest");
const app = require("../app");
const prisma = require("../config/prisma");
const { _clearBooks } = require("../controller/BookController");
const endpointBook = "/api/books";
const endpointUser = "/api/users";

//datas
const bookData = { title: "Buku 1", description: "Deskripsi Buku 1" };
const userData = {
  name: "rifqi",
  email: "rifqi@gmail.com",
  password: "rifqi123",
  role: "ADMIN",
};

beforeEach(async () => {
  await _clearBooks();
});

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

//function create and login for user
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

const createBook = async () => {
  const login = await createAndLoginUser();
  const data = await request(app)
    .post(endpointBook)
    .send(bookData)
    .set("Authorization", `Bearer ${login.token}`);

  return data;
};

describe("BOOK API", () => {
  it("should be able to create book", async () => {
    const login = await createAndLoginUser();
    const res = await request(app)
      .post(endpointBook)
      .send(bookData)
      .set("Authorization", `Bearer ${login.token}`);

    expect(res.status).toBe(201);
  });

  it("should be able to get one book", async () => {
    const login = await createAndLoginUser();
    const create = await createBook();
    const res = await request(app)
      .get(`${endpointBook}/${create.body.data.id}`)
      .set("Authorization", `Bearer ${login.token}`);
    expect(res.status).toBe(200);
  });
});
