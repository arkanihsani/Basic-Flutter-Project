import db from "../../utils/db.js";
import BaseError from "../../errors/base-error.js";
import logger from "../../utils/logger.js";

class RecordService {
  async getAll(userId) {
    logger.info(`DB: findMany records for user: ${userId}`);
    const records = await db.record.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    return records.map((item) => ({
      id: item.id,
      user_id: item.user_id,
      amount: item.amount,
      description: item.description,
      type: item.type,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  }

  async getById(id, userId) {
    logger.info(`DB: findUnique record by id: ${id} for user: ${userId}`);
    const record = await db.record.findFirst({
      where: { 
        id: id,
        user_id: userId
      }
    });
    
    if (!record) {
      logger.warn(`Record not found for id: ${id}`);
      throw BaseError.notFound("Record not found");
    }
    
    return {
      id: record.id,
      user_id: record.user_id,
      amount: record.amount,
      description: record.description,
      type: record.type,
      created_at: record.created_at,
      updated_at: record.updated_at,
    };
  }

  async create({ amount, description, type }, userId) {
    logger.info(`DB: create record for user: ${userId}`);
    const record = await db.record.create({
      data: {
        user_id: userId,
        amount: parseFloat(amount),
        description: description,
        type: type,
      },
    });

    logger.info(`Create record success for user: ${userId}`);
    return {
      id: record.id,
      user_id: record.user_id,
      amount: record.amount,
      description: record.description,
      type: record.type,
      created_at: record.created_at,
      updated_at: record.updated_at,
    };
  }

  async update(id, { amount, description, type }, userId) {
    logger.info(`DB: findFirst record by id: ${id} for user: ${userId}`);
    const record = await db.record.findFirst({
      where: { 
        id: id,
        user_id: userId,
      }
    });

    if (!record) {
      logger.warn(`Record not found for id: ${id}`);
      throw BaseError.notFound("Record not found");
    }

    logger.info(`DB: update record by id: ${id}`);
    const data = {};
    if (amount !== undefined) data.amount = parseFloat(amount);
    if (description !== undefined) data.description = description;
    if (type !== undefined) data.type = type;

    const updated = await db.record.update({
      where: { id },
      data,
    });

    logger.info(`Update record success for id: ${id}`);
    return {
      id: updated.id,
      user_id: updated.user_id,
      amount: updated.amount,
      description: updated.description,
      type: updated.type,
      created_at: updated.created_at,
      updated_at: updated.updated_at,
    };
  }

  async delete(id, userId) {
    logger.info(`DB: findFirst record by id: ${id} for user: ${userId}`);
    const record = await db.record.findFirst({
      where: { 
        id: id,
        user_id: userId
      }
    });

    if (!record) {
      logger.warn(`Record not found for id: ${id}`);
      throw BaseError.notFound("Record not found");
    }

    logger.info(`DB: delete record by id: ${id}`);
    const deleted = await db.record.delete({
      where: { id },
    });

    logger.info(`Delete record success for id: ${id}`);
    return {
      id: deleted.id,
      user_id: deleted.user_id,
      amount: deleted.amount,
      type: deleted.type,
      description: deleted.description,
      created_at: deleted.created_at,
    };
  }
}

export default new RecordService();
