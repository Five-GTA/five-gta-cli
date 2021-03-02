import fs from "fs";
import { ncp } from "ncp";
import { logSuccess } from "../logger";
import { exitError, parseJson } from "../util";
import { FN_RESOURCE_CONFIG, ResouceConfig } from "./ConfigSerivce";
import { connectToServer } from "./ServerService";

export class ResourceService {

    private config:ResouceConfig;

    constructor(){
        if (!fs.existsSync(FN_RESOURCE_CONFIG)){
            exitError("Resource config not exists");
        }
        const config = parseJson(fs.readFileSync(FN_RESOURCE_CONFIG).toLocaleString()) as ResouceConfig;
        if (!config.resourceDir || !config.deployDir || !config.resourceName){
            exitError("Invalid resource config");
        }
        this.config = config;
        connectToServer()
            .then((socket)=>{
                this.deployDir().then(()=>{
                    socket.send("restart", this.config.resourceName);
                    socket.close();
                }).catch(()=>{
                    exitError("Error while copy to deploy directory");
                });
                logSuccess(`Successfully deployed ${this.config.resourceName} resource!`);
            }).catch(()=>{
                exitError("The deploytmet server not started");
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