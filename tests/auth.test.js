import request from "supertest";
import app from "../src/server.js";
import { prisma } from "../src/utils/prisma/index.js";

// 테스트 실행 전, DB 초기화
beforeAll(async () => {
  await prisma.users.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Auth API", () => {
  // 회원가입 테스트
  describe("POST /signup", () => {
    // 올바른 입력
    it("should signup with valid data", async () => {
      const res = await request(app).post("/signup").send({
        username: "test@example.com",
        password: "password123",
        nickname: "tester",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("username", "test@example.com");
    });

    // 같은 username 사용
    it("should fail to signup with existing username", async () => {
      const res = await request(app).post("/signup").send({
        username: "test@example.com",
        password: "password123",
        nickname: "tester2",
      });

      expect(res.statusCode).toBe(409);
      expect(res.body.error).toHaveProperty("code", "USER_ALREADY_EXISTS");
    });
  });

  // 로그인 테스트
  describe("POST /login", () => {
    // 올바른 로그인
    it("should login with correct credentials", async () => {
      const res = await request(app).post("/login").send({
        username: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    // 잘못된 username
    it("should fail with wrong credentials - username", async () => {
      const res = await request(app).post("/login").send({
        username: "test1234@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toHaveProperty("code", "INVALID_CREDENTIALS");
    });

    // 잘못된 비밀번호
    it("should fail with wrong credentials - password", async () => {
      const res = await request(app).post("/login").send({
        username: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toHaveProperty("code", "INVALID_CREDENTIALS");
    });
  });
});
