import AuthService from "./auth-service.js";
import BaseResponse from "../../utils/base-response.js";

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);
      return BaseResponse.success(
        res,
        { 
          user: { 
            id: user.id, 
            email: user.email, 
            name: user.name,
          }, 
          token 
        },
        "Login successful"
      );
    } catch (err) {
      next(err);
    }
  }

  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const user = await AuthService.register({ name, email, password });
      return BaseResponse.created(
        res,
        { 
          user: { 
            id: user.id, 
            name: user.name, 
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
          } 
        },
        "Registration successful"
      );
    } catch (err) {
      next(err);
    }
  }

  async me(req, res, next) {
    try {
      const { id } = req.user;
      const user = await AuthService.me(id);
      return BaseResponse.success(
        res,
        {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
          },
        },
        "User profile retrieved successfully"
      );
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.user;
      const { name, email, new_password } = req.body || {};
      const user = await AuthService.update(id, { name, email, new_password });
      return BaseResponse.success(
        res,
        {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
        },
        "User profile updated successfully"
      );
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.user;
      const user = await AuthService.delete(id);
      return BaseResponse.success(
        res,
        {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
          },
        },
        "User account deleted successfully"
      );
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
