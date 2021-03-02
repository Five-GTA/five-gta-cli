import fs from "fs";
import { ncp } from "ncp";
import { exitError, parseJson } from "../util";
import { FN_RESOURCE_CONFIG, ResouceConfig } from "./Config";
import { connectToServer } from "./Server";

export class Resource {

    private config:ResouceConfig;

    constructor(){
        if (!fs.existsSync(FN_RESOURCE_CONFIG)){
            exitError("\x1b[31m[FIVE-CLI] resource config not exists.\x1b[0m");
        }
        const config = parseJson(fs.readFileSync(FN_RESOURCE_CONFIG).toLocaleString()) as ResouceConfig;
        if (!config.resourceDir || !config.deployDir || !config.resourceName){
            exitError("\x1b[31m[FIVE-CLI] Invalid resource config.\x1b[0m");
        }
        this.config = config;
        connectToServer()
            .then((socket)=>{
                this.deployDir().then(()=>{
                    socket.send("restart", this.config.resourceName);
                    socket.close();
                }).catch(()=>{
                    exitError("\x1b[31m[FIVE-CLI] Error while copy to deploy directory.\x1b[0m");
                });
                console.log(`\x1b[32m[FIVE-CLI] successfully deployed ${this.config.resourceName} resource!\x1b[0m`);
            }).catch(()=>{
                exitError("\x1b[31m[FIVE-CLI] The deploytmet server not started.\x1b[0m");
            });
    }

    private async deployDir():Promise<void>{
        return new Promise<void>((resolve,reject)=>{
            ncp(this.config.resourceDir, this.config.deployDir, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}