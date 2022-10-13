const jwt = require("jsonwebtoken");
const { promisify } = require("util");
/**
 * 1. check if token exists
 * 2. if not token send res
 * 3. decode the token
 * 4. if valid next
 */

exports.verifyJWT = async (req, res, next) => {
  try {
    // 1. check if token exists
    const token = req?.headers?.authorization?.split(" ")?.[1]; // using optional chaining is accessible for and array also

    // 2. if not token send res
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Auth failed verifyJWT implemented",
      });
    }

    // 3. decode the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // here promisify is used to convert callback to promise (callback which is used in jwt.verify)

    // 4. if decoded done then put user in req and next
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};