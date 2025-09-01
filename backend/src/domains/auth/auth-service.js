import db from "../../utils/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BaseError from "../../errors/base-error.js";
import logger from "../../utils/logger.js";

class AuthService {
  async login(email, password) {
    try {
      // Add email sanitization
      const trimmedEmail = email.toLowerCase().trim();
      
      logger.info(`DB: findUnique user by email: ${trimmedEmail}`);
      const user = await db.user.findUnique({ where: { email: trimmedEmail } });
      
      if (!user) {
        logger.warn(`Login failed: user not found for email ${trimmedEmail}`);
        throw BaseError.notFound("User not found");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        logger.warn(`Login failed: invalid password for email ${trimmedEmail}`);
        throw BaseError.unauthorized("Invalid password");
      }

      logger.info(`Login success for user: ${trimmedEmail}`);
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return { user, token };
    } catch (error) {
      logger.error(`Login error for ${email}: ${error.message}`);
      throw error;
    }
  }

  async register({ username, email, password }) {
    try {
      const trimmedEmail = email.toLowerCase().trim();
      const trimmedUsername = username.trim();

      logger.info(`DB: findUnique user by email: ${trimmedEmail}`);
      const existing = await db.user.findUnique({ where: { email: trimmedEmail } });
      
      if (existing) {
        logger.warn(`Register failed: email already registered (${trimmedEmail})`);
        throw BaseError.badRequest("Email already registered");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      logger.info(`DB: create user: ${trimmedEmail}`);
      const user = await db.user.create({
        data: {
          username: trimmedUsername,
          email: trimmedEmail,
          password: hashedPassword,
        },
      });

      logger.info(`Register success for user: ${trimmedEmail}`);
      return {
        user
      };
    } catch (error) {
      logger.error(`Registration error for ${trimmedEmail || email}: ${error.message}`);
      throw error;
    }
  }

  async me(id) {
    try {
      logger.info(`DB: findUnique user by id: ${id}`);
      const user = await db.user.findUnique({ where: { id } });
      
      if (!user) {
        logger.warn(`User not found for id: ${id}`);
        throw BaseError.notFound("User not found");
      }

      return {
        user
      };
    } catch (error) {
      logger.error(`Get user profile error for ${id}: ${error.message}`);
      throw error;
    }
  }

  async update(id, { email, username, new_password }) {
    try {
      logger.info(`DB: findUnique user by id: ${id}`);
      const user = await db.user.findUnique({ where: { id } });
      
      if (!user) {
        logger.warn(`User not found for id: ${id}`);
        throw BaseError.notFound("User not found");
      }

      // Sanitize inputs
      const data = {};
      
      if (email) {
        const trimmedEmail = email.toLowerCase().trim();
        if (trimmedEmail !== user.email) {
          const existing = await db.user.findUnique({ where: { email: trimmedEmail } });
          if (existing) {
            logger.warn(`Update failed: email already registered (${trimmedEmail})`);
            throw BaseError.badRequest("Email already registered");
          }
          data.email = trimmedEmail;
        }
      }

      if (username) {
        data.username = username.trim();
      }

      if (new_password) {
        const hashedPassword = await bcrypt.hash(new_password, 12);
        data.password = hashedPassword;
        logger.info(`Password updated for user: ${id}`);
      }

      logger.info(`DB: update user by id: ${id}`);
      const updated = await db.user.update({
        where: { id },
        data,
      });

      logger.info(`Update success for user: ${id}`);
      return {
        updated
      };
    } catch (error) {
      logger.error(`Update user error for ${id}: ${error.message}`);
      throw error;
    }
  }

  async delete(id) {
    try {
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
        deleted
      };
    } catch (error) {
      logger.error(`Delete user error for ${id}: ${error.message}`);
      throw error;
    }
  }
}

export default new AuthService();