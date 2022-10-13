exports.verifyRole = (...role) => { // here role is an array of recieved arguments
    return (req, res, next) => {
      const userRole = req.user.role; // recieved from verifyJWT
      if (!role.includes(userRole)) {
        return res.status(401).json({
          success: false,
          message: `Access denied for ${userRole} role`,
        });
      }
      next();
    };
  };