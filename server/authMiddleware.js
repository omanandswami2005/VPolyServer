const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
// const express = require('express');


const secretKey = '85f55ae3bbf0d828d8e485122661a88d98956b6b0b35b164ab89315caeefbad9';


async function authenticateJWT(req, res, next) {

	const token =req.cookies.token;
	console.log(token);
	// const token = req.headers('Authorization').split(' ')[1]; 

	if (!token) {
		
		return res.status(401).json({ data: "Login again to access" });

		// console.log(token);
	}

	try {
		const decoded = jwt.verify(token, secretKey);
		req.user = decoded;
		console.log(req.user);
		 // Store the user information in the request object
		next(); // User is authenticated, allow access
	} catch (error) {
		res.status(403).json({ data: 'Token expired or invalid' });
		console.log("token expired or invalid");
	}
}

module.exports = authenticateJWT;
