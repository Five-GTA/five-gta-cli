import fs from "fs";
import { logWarning } from "../logger";

export const FN_SERVER_CONFIG = ".fiveserver.json";
export const FN_RESOURCE_CONFIG = ".fiveresource.json";


export interface ServerConfig {
    startCommand:string,
    workDir:string
}


export interface ResouceConfig {
    resourceName:string
    resourceDir:string,
    deployDir:string
}

export class ConfigService {
    constructor(type:string){
        switch(type){
        case "server":
            if (fs.existsSync(FN_SERVER_CONFIG)){
                logWarning(`File ${FN_SERVER_CONFIG} already exists`);
                return;
            }
            fs.writeFileSync(FN_SERVER_CONFIG, JSON.stringify({
                startCommand:"start.bat",
                workDir:".\\",
            } as ServerConfig));
            break;
        case "resource":
            if (fs.existsSync(FN_RESOURCE_CONFIG)){
                logWarning(`File ${FN_RESOURCE_CONFIG} already exists`);
                return;
            }
            fs.writeFileSync(FN_RESOURCE_CONFIG, JSON.stringify({
                resourceName: "five_",
                resourceDir: "dist/five_",
                deployDir: "",
            } as ResouceConfig));
            break;    
        }
    }
}