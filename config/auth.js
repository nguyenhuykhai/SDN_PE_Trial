const jwt = require('jsonwebtoken');

module.exports = {
    jwtDecode: async function (req, res, next) {
        try {
            let token = req.cookies.token;
            if (token) {
                // Decode token
                const decoded = await jwt.verify(token, 'SDN301m');
                req.user = decoded;
                if (req.user) {
                    next();
                } else {
                    res.render('login', { error: 'Token invalid' });
                }
            } else {
                res.render('login', { error: 'Please log in' });
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            res.render('login', { error: 'Token invalid' }); // Render appropriate error message
        }
    },
    jwtDecodeApi: async function (req, res, next) {
        try {
            // Get Bearer token
            let token = req.headers['authorization'];
            if (token) {
                token = token.split(' ')[1];
                // Decode token
                const decoded = await jwt.verify(token, 'SDN301m');
                req.user = decoded;
                if (req.user) {
                    next();
                } else {
                    res.status(401).json({ error: 'Token invalid' });
                }
            } else {
                res.status(401).json({ error: 'Please log in' });
            }
        } catch (error) {
            res.status(401).json({ error: 'Token invalid' }); // Render appropriate error message
        }
    }
}
