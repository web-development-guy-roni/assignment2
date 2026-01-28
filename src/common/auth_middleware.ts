// Guy-Rozenbaum-214424814-Roni-Taktuk-213207640
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: { _id: string };
}

const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).send("Missing token");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
        if (err) return res.status(403).send("Invalid or expired token");
        req.user = user as { _id: string };
        next();
    });
};

export default authenticate;