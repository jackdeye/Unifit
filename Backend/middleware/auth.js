import jwt from 'jsonwebtoken';
import db from '../connection.js';
import { ObjectId } from 'mongodb';

//wants to like a post
//click the like button -> auth middleware (next) => only if satisfied, do like controller...
const auth = async (req, res, next) => {
    try { 
        if (!req.headers.authorization) return res.status(401).json({ message: "Authorization token missing" });

        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;

        if (token && isCustomAuth) {
            const decodedData = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decodedData?.id;
        } else {
            const decodedData = jwt.decode(token);
            req.userId = decodedData?.sub; 
        }

        // Fetch user information from the database
        const userCollection = db.collection('users');
        const user = await userCollection.findOne({ _id: new ObjectId(req.userId) });

        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // Set the full user object on req.user

        next();
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: "Token is not valid" });
    }
}

export default auth;