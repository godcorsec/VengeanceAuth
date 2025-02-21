import sqlite3 from 'sqlite3';

import fs from "node:fs";
import {logError, logOk, logWarn} from "../logging/logging";
import path from "node:path";
import * as sqlite from "node:sqlite";
import loadRoutes from "../Routes/LoadRoutes";
import {promises} from "node:dns";

const DB_PATH: string = "../LocalDatabase.sqlite";

class DatabaseController
{
    // @ts-ignore
    private db: Database;
    // @ts-ignore
    private dbConnection: sqlite3.Connection;
    private static instance: DatabaseController;
    private static isConnected: boolean = false;

    async complete_startup_queries(): Promise<void>
    {
        // Todo: Ensure all tables etc exist and if not then create them
    }


    async startup(): Promise<boolean>
    {
        const isConnected = await this.connect();
        if(isConnected)
        {
            logOk("Startup Routine -- Database detected as active, attempting SQL load", false);
            const isSQLLoaded = await this.load_sql_commands();
            if(isSQLLoaded) return true;
        }
        else
        {
            logOk("Startup Routine -- Database was not detected as active, attempting startup routing again.", false);
            await this.startup();
        }

        return true;
    }


    async connect(): Promise<boolean> {
        const dbPath = path.join(__filename, DB_PATH);

        return new Promise((resolve, reject) => {
            if (!fs.existsSync(dbPath))
            {
                logWarn("Local database wasn't found, attempting to create one..", false);
                this.db = new sqlite3.Database(dbPath, (err: Error | null) => {
                    if (err)
                    {
                        logError(`An error occurred while creating database. Detailed Error: ${err}`, false);
                        reject(false);
                    }
                    else
                    {
                        logOk(`Database was successfully created. It is located at ${dbPath}`, false);
                        resolve(true);
                    }
                });
            }
            else
            {
                logOk(`Database was successfully located at ${dbPath}`, false);
                this.db = new sqlite3.Database(dbPath, (err: Error | null) => {
                    if (err)
                    {
                        logError(`An error occurred whilst connecting to the database. Detailed Error: ${err}`, false);
                        reject(false);
                    }
                    else {
                        logOk(`Successfully established a connection to the database located at: ${dbPath}`, true);
                        resolve(true);
                    }
                });
            }
        });


    }


    async load_sql_commands(): Promise<boolean>
    {
        logOk("Beginning SQL File Loading..", false);

        const loadSQLCommandFiles = async (dir: string) => {
            const files = await fs.promises.readdir(dir);

            for (const file of files)
            {
                const filePath = path.join(dir, file);
                const stats = await fs.promises.stat(filePath);

                if (stats.isDirectory())
                {
                    logOk(`Found Directory In SQL Commands: ${filePath}`, false);
                    await loadSQLCommandFiles(filePath); // recurse
                }

                else if (stats.isFile() && file.endsWith(".sql"))
                {

                    logOk(`Found SQL Command File: ${filePath}`, false);
                    try
                    {
                        const commandData = await fs.promises.readFile(filePath, 'utf-8');
                        // @ts-ignore
                        this.db.run(commandData, (err) => {
                            if (err)
                            {
                                logError(`Error executing SQL in file ${filePath}: ${err}`, false);
                            }
                            else
                            {
                                logOk(`Successfully executed SQL from file: ${filePath}`, false);
                            }
                        });
                    }
                    catch (error)
                    {
                        logError(`Failed to read/execute command file: ${filePath}`, false);
                    }
                }
            }
        };

        try
        {
            await loadSQLCommandFiles(path.join(__filename, "../SQL"));
            //logOk("SQL Command File loading completed.", true);
            return true;
        }
        catch (err)
        {
            logError(`Error loading SQL commands: ${err}`, false);
            return false;
        }
    }

    public static get_instance(): DatabaseController
    {
        if(!DatabaseController.instance)
        {
            DatabaseController.instance = new DatabaseController();
        }
        return DatabaseController.instance;
    }

    public get_connection(): sqlite3.Database
    {
        if(!this.db)
        {
            throw new Error("A valid connection to the database couldn't be established. Ensure you have called connect() first.");
        }
        else
        {
            return this.db;
        }
    }

    public get_isConnected(): boolean
    {
        return this.db.isConnected;
    }
}

export default DatabaseController;