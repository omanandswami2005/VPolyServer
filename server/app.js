const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const app = express();
const authenticateJWT = require('./authMiddleware');


const PORT = process.env.PORT || 5000;

// Middleware to parse JSON, URL-encoded data and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const secretKey = '85f55ae3bbf0d828d8e485122661a88d98956b6b0b35b164ab89315caeefbad9';


// Serve the dashboard for authorized users (protected by JWT)
app.post('/dashboard', authenticateJWT, (req, res) => {
    // Serve the dashboard content here
    const userData = {
        name: req.user.username, // Replace with the actual user's name
        email: 'omanandswami@2005.com', // Replace with the actual user's email
    };

    res.json({ data: true, userData });
});

app.post('/dashboard/profile', authenticateJWT, (req, res) => {
    // Serve the dashboard HTML file or content here
    const userData = req.user.username;

    res.json({ data: true, userData });
});

// Example login route to generate a JWT token
app.post('/login', (req, res) => {
    // Simulate authentication logic
    const { facultyId, password } = req.body;
    const username = facultyId;

    if (username === 'om' && password === 'omiii') {
        // Generate a JWT token and send it to the client
        const token = jwt.sign({ username }, secretKey, { expiresIn: '30s' });
        console.log('Generated Token:', token);
        // res.json({ token }); // Include the token in the response
        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true,
            maxAge: 60 * 1/2 , // 1 minute
            sameSite: 'strict', // Adjust this based on your security requirements
            path: '/', // Specify the path where the cookie is accessible
        }));

        // Respond with any other necessary data
        res.json({ message: 'Login om successful' });
    } 
    else if (username === 'akshay' && password === 'akshuuu'){

         // Generate a JWT token and send it to the client
         const token = jwt.sign({ username }, secretKey, { expiresIn: '30s' });
         console.log('Generated Token:', token);
         // res.json({ token }); // Include the token in the response
         res.setHeader('Set-Cookie', cookie.serialize('token', token, {
             httpOnly: true,
             maxAge: 60 * 1/2 , // 1 minute
             sameSite: 'strict', // Adjust this based on your security requirements
             path: '/', // Specify the path where the cookie is accessible
         }));
 
         // Respond with any other necessary data
         res.json({ message: 'Login om successful' });
    }
    else {
        res.status(401).json({ message: 'Authentication failed' });
    }
});




app.get('/logout', (req, res) => {
    // Clear the token cookie by setting it to an empty value and specifying an immediate expiration time
    res.setHeader('Set-Cookie', cookie.serialize('token', '', {
        httpOnly: true,
        maxAge: 0, // Set the cookie to expire immediately
        sameSite: 'strict', // Adjust this based on your security requirements
        path: '/', // Specify the path where the cookie was originally set
    }));

    res.json({ logout: false }).sendStatus(200);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



