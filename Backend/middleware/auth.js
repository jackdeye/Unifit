import jwt from 'jsonwebtoken';

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

        next();
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: "Token is not valid" });
    }
}

export default auth;