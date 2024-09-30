import jwt from 'jsonwebtoken'
export const verify = (req, resp, next) => {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) return resp.status(203).json({
        massg: "Your not Authorized!",
    });

    const token = authHeaders.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
        if (err) {
            return resp.status(203).json({
                massg: "Token is not valid",
            });
        }
        else {
            req.user = user;
            next();
        }
    });
};


export const generateAccessToken = (payload) => {
    return jwt.sign(
        { id: payload.id},
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: process.env.EXPIRES_IN }
    )
}