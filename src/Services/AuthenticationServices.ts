import argon2 from 'argon2';
import * as crypto from "node:crypto";

export async function HashPassword(password: string): Promise<string>
{
    try
    {
        return await argon2.hash(password);
    }
    catch(err)
    {
        throw new Error(`Error occurred when hashing password: ${err}`);
    }
}

export async function VerifyPassword(hashed_password: string, password: string): Promise<boolean>
{
    try
    {
        return await argon2.verify(hashed_password, password);
    }
    catch(err)
    {
        throw new Error(`Error occurred when verifying password ${err}`);
    }
}

export async function CreateToken(accountPassword: string, accountID: string): Promise<any>
{
    return crypto.createHmac('sha256', accountPassword)
        .update(accountID)
        .digest('hex');
}

export async function VerifyToken(providedToken: string, accountPassword: string, accountID: string): Promise<any>
{
    const expectedToken = crypto.createHmac('sha256', accountPassword)
    .update(accountID)
    .digest('hex');

    return providedToken == expectedToken;
}