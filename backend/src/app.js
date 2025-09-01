import express from "express";
import morgan from "morgan";
import errorHandler from "./errors/error-handler.js";
import BaseError from "./errors/base-error.js";

import authRoutes from "./domains/auth/auth-routes.js";
import recordRoutes from "./domains/record/record-routes.js";

class ExpressApplication {
  constructor(port) {
    this.app = express();
    this.port = port;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan("tiny"));
  }

  setupRoutes() {
    this.app.use("/api/v1/auth", authRoutes);
    this.app.use("/api/v1/record", recordRoutes);

    this.app.use((req, res, next) => {
      next(BaseError.notFound("Route not found"));
    });
  }

  setupErrorHandler() {
    this.app.use(errorHandler);
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

export default ExpressApplication;
