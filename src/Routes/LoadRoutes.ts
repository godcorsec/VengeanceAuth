import { Application } from 'express';
import path from 'node:path';
import { logOk, logWarn, logError } from "../logging/logging";
import fs from 'node:fs';

function LoadRoutes(app: Application) {
    const routePath = path.join(__dirname, '..', 'routes');
    logOk(`Attempting to load routes from: ${routePath}...`, false);

    const loadRouteFiles = (dir: string) => {
        fs.readdirSync(dir).forEach((file) => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory())
            {
                //logOk(`Found directory in routes: ${filePath}`);
                loadRouteFiles(filePath); // Recursively load files
            }
            else if (stats.isFile() && (file.endsWith('.ts') || file.endsWith('.js')))
            {
                logOk(`Found route file: ${filePath}`, false);
                try
                {
                    if(filePath.includes("LoadRoutes.ts")) return;
                    // Use require instead of import for synchronous loading
                    const route = require(filePath).default;
                    if (route)
                    {
                        app.use("/api", route);
                    }
                }
                catch (error)
                {
                    // @ts-ignore
                    logError(`Error loading route file ${filePath}: ${error.message}`, false);
                }
            }
        });
    };

    loadRouteFiles(routePath);
    logOk("Route loading completed.", true);
}

export default LoadRoutes;
