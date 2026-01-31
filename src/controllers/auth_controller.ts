// Guy-Rozenbaum-214424814-Roni-Taktuk-213207640
import { Request, Response } from 'express';
import User from '../models/user_model';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

const generateTokens = (userId: string) => {
    const accessToken = jwt.sign(
        { _id: userId },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: process.env.JWT_TOKEN_EXPIRATION || '1h' } as SignOptions
    );
    const refreshToken = jwt.sign(
        { _id: userId },
        process.env.REFRESH_TOKEN_SECRET!
    );
    return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password) return res.status(400).send("Missing email or password");

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).send("User already exists");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ email, password: hashedPassword, username });
        await user.save();
        res.status(201).json({ _id: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send("Invalid email or password");

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send("Invalid email or password");

        const { accessToken, refreshToken } = generateTokens(user._id.toString());

        if (!user.refreshTokens) user.refreshTokens = [];
        user.refreshTokens.push(refreshToken);
        await user.save();

        res.status(200).send({ accessToken, refreshToken, _id: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
};

export const logout = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    console.log(req.headers);
    const refreshToken = authHeader && authHeader.split(' ')[1];
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, async (err: any, userInfo: any) => {
        if (err) return res.status(403).send("Invalid refresh token");
        try {
            const user = await User.findById(userInfo._id);
            if (!user || !user.refreshTokens.includes(refreshToken)) {
                if (user) {
                    user.refreshTokens = []; // אבטחה: ביטול כל הטוקנים אם יש חשד לשימוש חוזר
                    await user.save();
                }
                return res.status(403).send("Invalid request");
            }
            user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
            await user.save();
            res.status(200).send("Logged out");
        } catch (err) {
            res.status(400).send(err);
        }
    });
};

export const refresh = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, async (err: any, userInfo: any) => {
        if (err) return res.status(403).send("Invalid refresh token");
        try {
            const user = await User.findById(userInfo._id);
            if (!user || !user.refreshTokens.includes(refreshToken)) {
                if (user) {
                    user.refreshTokens = [];
                    await user.save();
                }
                return res.status(403).send("Invalid request");
            }

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user._id.toString());

            // החלפת הטוקן הישן בחדש (Rotation)
            user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
            user.refreshTokens.push(newRefreshToken);
            await user.save();

            res.status(200).send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        } catch (err) {
            res.status(400).send(err);
        }
    });
};