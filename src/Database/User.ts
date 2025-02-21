import {Database} from "sqlite3";
import IUser from "../Types/User";
import DatabaseController from "./Database";
import {logError, logOk} from "../logging/logging";


class UserDatabase
{
    private db: Database;
    constructor()
    {
        const dbController = DatabaseController.get_instance();
        this.db = dbController.get_connection();
    }

    // Todo: Implement database read/write for creating users
    async create_user(user: IUser): Promise<IUser>
    {
        const createUserData = `
            INSERT INTO User (id, username, password, token, inviteCode, accountCreationDate)
            VALUES ('${user.id}', '${user.username}', '${user.password}','${user.token}', '${user.inviteCode}', '${user.accountCreationDate}')
        `;

        //@ts-ignore
        this.db.run(createUserData, function (err,)
        {
            if(err)
            {
                logError(`Failed to create user data inside of the database, detailed error: ${err}`, false);
                throw err;
            }
            else
            {
                logOk("Successfully created user data inside of the database", false);
            }
        });

        return user;
    }

    async delete_user(userToken: string): Promise<boolean> {
        const deleteUserData = `
            DELETE FROM User WHERE token = ?;
        `;

        return new Promise<boolean>((resolve, reject) => {
            this.db.run(deleteUserData, [userToken], function (error: Error | null)
            {
                if (error)
                {
                    reject(error);
                }
                else
                {
                    if (this.changes > 0)
                    {
                        resolve(true);
                    }
                    else
                    {
                        resolve(false);
                    }
                }
            });
        });
    }


    async does_user_token_exist(token: string): Promise<boolean>
    {
        return new Promise<boolean>((resolve, reject) => {
            const dataQuery = `SELECT token FROM User WHERE token = ?`;
            this.db.get(dataQuery, [token], (error, row) => {
                if (error)
                {
                    reject(error); // not found
                }
                else
                {
                    resolve(row !== undefined); // found
                }
            });
        });
    }
}


export default UserDatabase;