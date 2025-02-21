import express, { Request, Response } from 'express';
import path from "node:path";
import LoadRoutes from "./Routes/LoadRoutes";
import DatabaseController from "./Database/Database";
import {logError, logOk, logWarn} from "./logging/logging";
import { HashPassword, VerifyPassword } from "./Services/AuthenticationServices";
import IUser from "./Types/User";
import UserDatabase from "./Database/User";
import uuid4 from "uuid4";
import loadRoutes from "./Routes/LoadRoutes";
import {CreateToken} from "./Services/AuthenticationServices";

const app = express();
const port = 3000;

const database = DatabaseController.get_instance();

app.use(express.json());

app.get('/api/ping', async (req: Request, res: Response) => {
    res.send('Pong!');
});

/*
// Ensure that the database connection is established before loading routes
async function initialize() {
    try {
        const isConnected = await database.connect();
        if (isConnected) {
            logOk(`Database connection successful. Starting the server...`, true);
            LoadRoutes(app);
            app.listen(port, () => {
                logOk(`VengeanceAuth is online, running at http://localhost:${port}`, true);
                logOk(`New UUID4: ${uuid4()}`, false);
                logOk(`New UUID4: ${uuid4()}`, false);
            });
        } else {
            logError('Failed to connect to the database. Exiting...', true);
            process.exit(1);
        }
    } catch (err) {
        logError(`Error initializing app: ${err}`, true);
        process.exit(1);
    }
}
initialize();
 */

async function start_server()
{
    try
    {
        const isStarted = await database.startup();
        if(isStarted)
        {
            logOk(`Database connection successful. Starting the server...`, true);
            loadRoutes(app);
            app.listen(port, async () => {
                logOk(`VengeanceAuth is online, running at http://localhost:${port}`, true);
                logOk(`New UUID4: ${uuid4()}`, false);
                logOk(`New UUID4: ${uuid4()}`, false);


                const userid = uuid4();
                const password = "Natalia77@";
                const token = await CreateToken(userid, password);
                logWarn(`CREATED NEW USER TOKEN: ${token}`, false);

            });
        }
        else
        {
            logError('Failed to connect to the database. Exiting...', true);
            process.exit(1);
        }
    }
    catch (error)
    {
        logError(`Error initializing app: ${error}`, true);
        process.exit(1);
    }
}

start_server();