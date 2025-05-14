import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma/index.js";

export default async function (req, res, next) {
  const { authorization } = req.cookies;

  // 토큰 확인
  if (!authorization) {
    const error = new Error("토큰이 없습니다.");
    error.name = "TokenNotFoundError";
    error.status = 401;
    error.code = "TOKEN_NOT_FOUND";
    throw error;
  }

  const [tokenType, token] = authorization.split(" ");
  if (tokenType !== "Bearer") throw new Error("토큰 타입이 Bearer이 아니다.");

  // 서버에서 발급한 JWT가 맞는지 검증
  // custom-secret-key와 일치하는지 확인
  const decodeToken = jwt.verify(token, "custom-secret-key");

  // JWT의 usersId를 이용해 사용자를 조회
  const id = decodeToken.id;
  const user = await prisma.users.findFirst({
    where: { id: id },
  });
  if (!user) {
    throw new Error("토큰 사용자가 존재하지 않습니다.");
  }

  // req.user에 조회된 사용자 정보를 할당
  req.user = user;
  next();
}
