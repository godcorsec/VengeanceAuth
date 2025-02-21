import express, { Request, Response } from 'express';
import UserDatabase from "../../Database/User";
import uuid4 from "uuid4";
import IUser from "../../Types/User";
import {CreateToken, HashPassword} from "../../Services/AuthenticationServices";

const router = express.Router();

function sanitize_username(username: string): string
{
    return username.replace(/[^a-zA-Z0-9]/g, "");
}

function isValidPassword(input: string): boolean
{
    const hasUpperCase = /[A-Z]/.test(input);
    const hasNumber = /\d/.test(input);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(input);
    const hasMinLength = input.length >= 8;

    return hasUpperCase && hasNumber && hasSpecialChar && hasMinLength;
}


router.post('/users/create', async (req: Request, res: Response) => {
    const userDB = new UserDatabase();

    const { username, password, invitecode } = req.body;

    if (!username || !password)
    {
        return res.status(400).json({ error: "Username and password are required." });
    }

    if (!isValidPassword(password))
    {
        return res.status(400).json({ error: "Each password should contain at least 8 characters, 1 upper case character, 1 number and 1 special character." });
    }

    //if(sanitize_username(username).length > 4)
    //{
    //    return res.status(400).json({ error: "Each username should be at least 4 characters after sanitization." });
   // }

    // Todo -> check if username exists
    // Todo -> check if uuid exists

    const hashedPassword = await HashPassword(password);
    const sanitizedUsername = sanitize_username(username);
    const id = uuid4();
    const generatedToken = await CreateToken(hashedPassword, id);

    if(sanitizedUsername.length < 4)
    {
        return res.status(400).json({ error: "Each username should be at least 4 characters after sanitization." });
    }

    const newUser: IUser = {
        username: username,
        password: hashedPassword,
        token: generatedToken,
        id: id,
        inviteCode: "No Invite Code",
        accountCreationDate: new Date()
    };

    await userDB.create_user(newUser);


    // return res.status(400).json({ error: "Username and password are required" });
    res.status(201).json({ message: "User created successfully" });
});

router.post('/users/me', async (req: Request, res: Response) => {
    const userDB = new UserDatabase();

    const {pw, id} = req.body;

    const token = await CreateToken(pw, id);

    const doesit: boolean = await userDB.does_user_token_exist(token);

    if(doesit)
    {
        res.status(200).json({ message: "Yes it does" });
    }
    else
    {
        res.status(401).json({ message: "No it doesn't" });
    }

});



export default router;
