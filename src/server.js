import express from "express";
import UserRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

import errorHandlingMiddleware from "./middlewares/error-handling.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", [UserRouter]);

app.use(errorHandlingMiddleware);

export default app;
