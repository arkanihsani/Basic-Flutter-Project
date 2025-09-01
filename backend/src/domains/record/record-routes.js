import express from "express";
import RecordController from "./record-controller.js";
import validate from "../../middlewares/request-validator.js";
import {
  createRecordSchema,
  updateRecordSchema,
  getRecordByIdSchema,
} from "./record-schema.js";
import authToken from "../../middlewares/auth-token.js";

class RecordRoutes {
  constructor() {
    this.router = express.Router();
    this.setRoutes();
  }

  setRoutes() {
    this.router.use(authToken);

    this.router.get("/", RecordController.getAll);

    this.router.get("/:id",
      validate(getRecordByIdSchema, "params"),
      RecordController.getById
    );
    
    this.router.post("/",
      validate(createRecordSchema),
      RecordController.create
    );
    
    this.router.put("/:id",
      validate(getRecordByIdSchema, "params"),
      validate(updateRecordSchema),
      RecordController.update
    );
    
    this.router.delete("/:id",
      validate(getRecordByIdSchema, "params"),
      RecordController.delete
    );
  }

  getRouter() {
    return this.router;
  }
}

export default new RecordRoutes().getRouter();
