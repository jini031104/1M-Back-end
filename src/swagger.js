// src/swagger.js
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "1M Back-end API",
      description: "node.js 백엔드 개발 과제",
    },
    servers: [{ url: "http://localhost:3000", description: "로컬 서버" }],
    components: {
      schemas: {
        SignupRequest: {
          type: "object",
          required: ["username", "password", "nickname"],
          properties: {
            username: { type: "string", example: "test" },
            password: { type: "string", example: "password123" },
            nickname: { type: "string", example: "tester" },
          },
        },
        SignupResponse: {
          type: "object",
          properties: {
            username: { type: "string", example: "test" },
            nickname: { type: "string", example: "tester" },
          },
        },
        SignupErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                code: { type: "string", example: "USER_ALREADY_EXISTS" },
                message: {
                  type: "string",
                  example: "이미 가입된 사용자입니다.",
                },
              },
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", example: "test" },
            password: { type: "string", example: "password123" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            token: { type: "string", example: "token" },
          },
        },
        LoginErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                code: { type: "string", example: "INVALID_CREDENTIALS" },
                message: {
                  type: "string",
                  example: "아이디 또는 비밀번호가 올바르지 않습니다.",
                },
              },
            },
          },
        },
        AuthToken: {
          type: "object",
          properties: {
            test: { type: "string", example: "test" },
          },
        },
        AuthTokenNot: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                code: { type: "string", example: "TOKEN_NOT_FOUND" },
                message: {
                  type: "string",
                  example: "토큰이 없습니다.",
                },
              },
            },
          },
        },
        AuthTokenEnd: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                code: { type: "string", example: "TOKEN_EXPIRED" },
                message: {
                  type: "string",
                  example: "토큰이 만료되었습니다.",
                },
              },
            },
          },
        },
        AuthTokenLess: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                code: { type: "string", example: "INVALID_TOKEN" },
                message: {
                  type: "string",
                  example: "토큰이 유효하지 않습니다.",
                },
              },
            },
          },
        },
      },
    },
  },
  // JSDoc 주석을 읽어 올 파일 경로
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
