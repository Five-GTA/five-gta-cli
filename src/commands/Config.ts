import fs from "fs";

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

export class Config {
    constructor(type:string){
        switch(type){
        case "server":
            fs.writeFileSync(FN_SERVER_CONFIG, JSON.stringify({
                startCommand:"start.bat",
                workDir:".\\",
            } as ServerConfig));
            break;
        case "resource":
            fs.writeFileSync(FN_RESOURCE_CONFIG, JSON.stringify({
                resourceName: "five_",
                resourceDir: "dist/five_",
                deployDir: "",
            } as ResouceConfig));
            break;    
        }
    }
}