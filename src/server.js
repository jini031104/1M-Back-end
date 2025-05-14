import express from "express";
import UserRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import errorHandlingMiddleware from "./middlewares/error-handling.middleware.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World?");
});

app.use("/api", [UserRouter]);

app.use(errorHandlingMiddleware);

app.listen(PORT, "0.0.0.0", () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
