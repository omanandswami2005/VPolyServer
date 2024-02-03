

const cookie = require('cookie');
const Faculty = require('../models/Faculty');
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_ENCRYPTION_KEY;

const authControllers = {
login:
async (req, res) => {
    const { facultyId, password } = req.body;

    try {
        const faculty = await Faculty.findOne({ id: facultyId });

        if (faculty) {
            if (faculty.password === password) {
                // Create a payload for the JWT token with faculty information
                const payload = {
                    username: faculty.name,
                    name: faculty.name,
                    role: faculty.role,
                };
// console.log(payload);
                // Generate a JWT token and send it to the client
                const token = jwt.sign(payload, secretKey, { expiresIn: '100m' });
                console.log('Generated Token:', token);

                // Set the JWT token as a cookie
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    httpOnly: true,
                    maxAge: 60 * 100, // 10 minutes
                    sameSite: 'strict', // Adjust this based on your security requirements
                    path: '/', // Specify the path where the cookie is accessible
                }));

                // Respond with any other necessary data
                res.json({ name: faculty.name, role: faculty.role });
            } else {
                res.status(401).json({ message: 'Authentication failed' });
            }
        } else if (facultyId === 'Admin' && password === 'Admin') {
            // Hardcoded user for fallback authentication
            // Create a payload for the JWT token with faculty information
            const payload = {
                username: facultyId,
                name: 'Admin',
                role: 'Admin',
            };

            // Generate a JWT token and send it to the client
            const token = jwt.sign(payload, secretKey, { expiresIn: '100m' });
            console.log('Generated Token:', token);

            // Set the JWT token as a cookie
            res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                httpOnly: true,
                maxAge: 60 * 100, // 100 minutes
                sameSite: 'strict', // Adjust this based on your security requirements
                path: '/', // Specify the path where the cookie is accessible
            }));

            // Respond with any other necessary data
            res.json({ name: 'Hardcoded User', role: 'Default Role' });
        } else {
            res.status(401).json({ message: 'Authentication failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
},

loggedin:
(req, res) => {
    console.log(req.user.role);
      // Serve the dashboard content here
      const userData = {
          name: req.user.username, // Replace with the actual user's name
          email: 'omanandswami@2005.com',
          role: req.user.role // Replace with the actual user's email
      };
  
      res.json({ data: true, userData});
  },
  logout:
  (req, res) => {
    // Clear the token cookie by setting it to an empty value and specifying an immediate expiration time
    res.setHeader('Set-Cookie', cookie.serialize('token', '', {
        httpOnly: true,
        maxAge: 0, // Set the cookie to expire immediately
        sameSite: 'strict', // Adjust this based on your security requirements
        path: '/', // Specify the path where the cookie was originally set
    }));

    res.json({ logout: false }).sendStatus(200);
},

}


module.exports = authControllers;