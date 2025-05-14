import request from "supertest";
import app from "../src/server.js";
import { prisma } from "../src/utils/prisma/index.js";
import jwt from "jsonwebtoken";

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

  describe("GET /tokens", () => {
    let user, validToken;

    // 테스트 유저 생성
    beforeAll(async () => {
      await prisma.users.deleteMany();

      user = await prisma.users.create({
        data: { username: "u", password: "h", nickname: "n" },
      });

      validToken = jwt.sign({ id: user.id }, "custom-secret-key", {
        expiresIn: "1h",
      });
    });

    // 유효 토큰
    it("should return 201 when token is valid", async () => {
      const res = await request(app)
        .get("/tokens")
        .set("Cookie", `authorization=Bearer ${validToken}`);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ test: "test" });
    });

    // 토큰 없음
    it("should return TOKEN_NOT_FOUND when no token provided", async () => {
      const res = await request(app).get("/tokens");

      expect(res.status).toBe(401);
      expect(res.body.error).toMatchObject({
        code: "TOKEN_NOT_FOUND",
        message: "토큰이 없습니다.",
      });
    });

    // 토큰 만료
    it("should return TOKEN_EXPIRED when token is expired", async () => {
      // 즉시 만료된 토큰 생성
      const expired = jwt.sign({ id: user.id }, "custom-secret-key", {
        expiresIn: "-1s",
      });

      const res = await request(app)
        .get("/tokens")
        .set("Cookie", `authorization=Bearer ${expired}`);

      expect(res.status).toBe(401);
      expect(res.body.error).toMatchObject({
        code: "TOKEN_EXPIRED",
        message: "토큰이 만료되었습니다.",
      });
    });

    // 유효하지 않은 토큰
    it("should return INVALID_TOKEN when token is malformed", async () => {
      const res = await request(app)
        .get("/tokens")
        .set("Cookie", `authorization=Bearer not-a-valid-token`);

      expect(res.status).toBe(401);
      expect(res.body.error).toMatchObject({
        code: "INVALID_TOKEN",
        message: "토큰이 유효하지 않습니다.",
      });
    });
  });
});
