import app from "./server.js";

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
