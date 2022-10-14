const jwt = require('jsonwebtoken');


exports.generateToken = (userInfo) => {
    const payload = {
        email: userInfo.email,
        role: userInfo.role,
        _id: userInfo._id,
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}