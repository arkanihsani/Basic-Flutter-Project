import db from "../../utils/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BaseError from "../../errors/base-error.js";
import logger from "../../utils/logger.js";

class AuthService {
  async login(email, password) {
    logger.info(`DB: findUnique user by email: ${email}`);
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      logger.warn(`Login failed: user not found for email ${email}`);
      throw BaseError.notFound("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed: invalid password for email ${email}`);
      throw BaseError.unauthorized("Invalid password");
    }

    logger.info(`Login success for user: ${email}`);
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { user, token };
  }

  async register({ name, email, password }) {
    logger.info(`DB: findUnique user by email: ${email}`);
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      logger.warn(`Register failed: email already registered (${email})`);
      throw BaseError.badRequest("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    logger.info(`DB: create user: ${email}`);
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    logger.info(`Register success for user: ${email}`);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async me(id) {
    logger.info(`DB: findUnique user by id: ${id}`);
    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      logger.warn(`User not found for id: ${id}`);
      throw BaseError.notFound("User not found");
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async update(id, { email, name, new_password }) {
    logger.info(`DB: findUnique user by id: ${id}`);
    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      logger.warn(`User not found for id: ${id}`);
      throw BaseError.notFound("User not found");
    }

    if (email && email !== user.email) {
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) {
        logger.warn(`Update failed: email already registered (${email})`);
        throw BaseError.badRequest("Email already registered");
      }
    }

    logger.info(`DB: update user by id: ${id}`);
    const data = {};
    if (email) data.email = email;
    if (name) data.name = name;
    if (new_password) {
      const hashedPassword = await bcrypt.hash(new_password, 10);
      data.password = hashedPassword;
      logger.info(`Password updated for user: ${id}`);
    }

    const updated = await db.user.update({
      where: { id },
      data,
    });

    logger.info(`Update success for user: ${id}`);
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      created_at: updated.created_at,
      updated_at: updated.updated_at,
    };
  }

  async delete(id) {
    logger.info(`DB: findUnique user by id: ${id}`);
    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      logger.warn(`User not found for id: ${id}`);
      throw BaseError.notFound("User not found");
    }

    logger.info(`DB: delete user by id: ${id}`);
    const deleted = await db.user.delete({
      where: { id },
    });
    logger.info(`Delete success for user: ${id}`);
    return {
      id: deleted.id,
      name: deleted.name,
      email: deleted.email,
      created_at: deleted.created_at,
      updated_at: deleted.updated_at,
    };
  }
}

export default new AuthService();
