

const SECRET_KEY = process.env.JWT_SECRET;

const userModel = require('../models/User')
const jwt =  require('jsonwebtoken')

const validateJWT = async (req, res, next) => {
    try {
        const authorizationHeader = req.get('authorization');

        // Check if the authorization header is present and starts with 'Bearer '
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: Token missing or malformed' });
        }

        // Extract the token from the header
        const token = authorizationHeader.split(' ')[1];

        // Check if the token is empty
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: Token missing' });
        }

        // Verify the token
        const payload = jwt.verify(token, SECRET_KEY);

        // Validate payload
        if (!payload || !payload.email) {
            return res.status(403).json({ error: 'Forbidden: Invalid token payload' });
        }

        // Fetch the user from the database
        const user = await userModel.findOne({ email: payload.email });

        // If user not found, return an error
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Attach user to the request object for downstream middleware/routes
        req.user = user;

        // Proceed to the next middleware
        next();
    } catch (err) {
        console.error(err);
        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: 'Forbidden: Invalid token' });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports={validateJWT}
