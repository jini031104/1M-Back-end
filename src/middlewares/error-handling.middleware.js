export default function (err, req, res, next) {
  const status = err.status || 500;
  const code = err.code || "INTERNAL_SERVER_ERROR";
  const message = err.message || "서버 오류가 발생했습니다.";

  if (err.name === "TokenExpiredError") {
    return res.status(402).json({
      error: {
        code: "TOKEN_EXPIRED",
        message: "토큰이 만료되었습니다.",
      },
    });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(403).json({
      error: {
        code: "INVALID_TOKEN",
        message: "토큰이 유효하지 않습니다.",
      },
    });
  }
  res.status(status).json({
    error: {
      code,
      message,
    },
  });
}
