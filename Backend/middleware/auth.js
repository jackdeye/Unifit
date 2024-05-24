import jwt from 'jsonwebtoken';

//wants to like a post
//click the like button -> auth middleware (next) => only if satisfied, do like controller...
const auth = async (req, res, next) => {
    try {
        const token = req.jeaders.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;

        let decodedData;
        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, "test");

            req.userId.decodedData ?.id;
        } else {
            decodedData = jwt.decode(token);

            req.userId = decodedData ?.sub;
        }

        next();
    } catch (error) {
        console.log(error);
    }
}

export default auth;