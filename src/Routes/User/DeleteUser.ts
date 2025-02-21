import express, { Request, Response } from 'express';
import UserDatabase from "../../Database/User";
import {VerifyPassword} from "../../Services/AuthenticationServices";
import {logWarn} from "../../logging/logging";

const router = express.Router();

router.delete('/users/delete', async (req: Request, res: Response) => {

    const userDB = new UserDatabase();


    const requestHeaders = req.headers.authorization;
    const token: string = requestHeaders?.toString() || "";


    const isTokenValid: boolean = await userDB.does_user_token_exist(token);

    if(!requestHeaders || !isTokenValid)
    {
        logWarn(`Unauthorized attempt to delete user via IP: ${req.ip}`, false);
        return res.status(401).send("Unauthorized attempt to delete user recorded.");
    }

    const wasDeleted = await userDB.delete_user(token);

    if(wasDeleted)
    {
        res.status(200).json({ message: "Successfully deleted the user" });
    }

    else
    {
        res.status(400).json({ message: "Failed to delete the user"});
    }


});

export default router;