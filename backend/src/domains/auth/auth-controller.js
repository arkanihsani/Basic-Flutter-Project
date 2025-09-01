import AuthService from "./auth-service.js";
import BaseResponse from "../../utils/base-response.js";
import logger from "../../utils/logger.js";

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      logger.info(`Login attempt for email: ${email}`);
      const { user, token } = await AuthService.login(email, password);
      
      return BaseResponse.success(
        res,
        { 
          user, 
          token,
        },
        "Login successful"
      );
    } catch (err) {
      logger.error(`Login controller error: ${err.message}`);
      next(err);
    }
  }

  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      
      logger.info(`Registration attempt for email: ${email}`);
      const user = await AuthService.register({ username, email, password });
      
      return BaseResponse.created(
        res,
        { 
          user,
        },
        "Registration successful"
      );
    } catch (err) {
      logger.error(`Registration controller error: ${err.message}`);
      next(err);
    }
  }

  async me(req, res, next) {
    try {
      const { id } = req.user;
      
      logger.info(`Get profile request for user: ${id}`);
      const user = await AuthService.me(id);
      
      return BaseResponse.success(
        res,
        {
          user,
        },
        "User profile retrieved successfully"
      );
    } catch (err) {
      logger.error(`Get profile controller error: ${err.message}`);
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.user;
      const { username, email, new_password } = req.body || {};
      
      logger.info(`Update profile request for user: ${id}`);
      const user = await AuthService.update(id, { username, email, new_password });
      
      return BaseResponse.success(
        res,
        {
          user
        },
        "User profile updated successfully"
      );
    } catch (err) {
      logger.error(`Update profile controller error: ${err.message}`);
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.user;
      
      logger.info(`Delete account request for user: ${id}`);
      const user = await AuthService.delete(id);
      
      return BaseResponse.success(
        res,
        {
          user
        },
        "User account deleted successfully"
      );
    } catch (err) {
      logger.error(`Delete account controller error: ${err.message}`);
      next(err);
    }
  }
}

export default new AuthController();