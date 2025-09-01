import BaseError from "../errors/base-error.js";

const adminAuth = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw BaseError.forbidden("Admin access required");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default adminAuth;
