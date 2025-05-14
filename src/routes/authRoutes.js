import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma/index.js";
import { Prisma } from "@prisma/client";
import { asyncHandler } from "./../handler/asyncHandler.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// 회원가입
router.post(
  "/signup",
  asyncHandler(async (req, res, next) => {
    const { username, password, nickname } = req.body;

    // 이메일 중복 체크
    const isExisUser = await prisma.users.findFirst({
      where: {
        username,
      },
    });

    // 이미 존재할 경우, 예외처리
    if (isExisUser) {
      const error = new Error("이미 가입된 사용자입니다.");
      error.status = 409;
      error.code = "USER_ALREADY_EXISTS";
      throw error;
    }

    // 비밀번호 암호화
    const hashPassword = await bcrypt.hash(password, 10);

    // DB 트랜잭션
    const user = await prisma.$transaction(
      async (tx) => {
        const user = await tx.users.create({
          data: {
            username,
            password: hashPassword,
            nickname,
          },
        });

        return user;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );

    return res.status(201).json({ username: username, nickname: nickname });
  })
);

// 로그인
router.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;
    const user = await prisma.users.findFirst({
      where: {
        username,
      },
    });

    const isUsernameAndPasswordCheck =
      user && (await bcrypt.compare(password, user.password));

    // 아이디 또는 비밀번호 확인
    if (!isUsernameAndPasswordCheck) {
      const error = new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
      error.status = 401;
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    // 토큰(5초)
    const token = jwt.sign(
      {
        username,
      },
      "custom-secret-key",
      { expiresIn: "5s" }
    );

    res.cookie("authorization", `Bearer ${token}`);

    return res.status(200).json({ token: token });
  })
);

router.get(
  "/tokens",
  authMiddleware,
  asyncHandler(async (req, res) => {
    return res.status(201).json({ test: "test" });
  })
);

export default router;
