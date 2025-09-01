import RecordService from "./record-service.js";
import BaseResponse from "../../utils/base-response.js";

class RecordController {
  async getAll(req, res, next) {
    try {
      const { id: userId } = req.user;
      const records = await RecordService.getAll(userId);
      return BaseResponse.success(res, { records }, "Records retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;
      const record = await RecordService.getById(id, userId);
      return BaseResponse.success(res, { record }, "Record retrieved successfully");
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { amount, description, type } = req.body;
      const { id: userId } = req.user;
      const record = await RecordService.create({ amount, description, type }, userId);
      return BaseResponse.created(
        res,
        { record },
        "Record created successfully"
      );
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { amount, description, type } = req.body;
      const { id: userId } = req.user;
      const record = await RecordService.update(id, { amount, description, type }, userId);
      return BaseResponse.success(
        res,
        { record },
        "Record updated successfully"
      );
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;
      const record = await RecordService.delete(id, userId);
      return BaseResponse.success(
        res,
        { record },
        "Record deleted successfully"
      );
    } catch (err) {
      next(err);
    }
  }
}

export default new RecordController();
