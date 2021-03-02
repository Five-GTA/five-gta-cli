#!/usr/bin/env node
import { ConfigService } from "./commands/ConfigSerivce";
import { ResourceService } from "./commands/ResouceService";
import { ServerService } from "./commands/ServerService";

const args = process.argv;
const type = args[2];

switch (type){
case "new-server":
    new ConfigService("server");
    break;
case "new-resource":
    new ConfigService("resource");
    break;
case "start":
    new ServerService();
    break;
case "deploy":
    new ResourceService();
    break; 
default:
    console.log("Use: five-cli\n\tnew-server - To make a new server config file\n\tnew-resource - To make a new resource config file\n\tstart - To start a new dev server based on config in directory\n\tdeploy - To deploy resource into dev server (the server need to be started before)");
    break;    
}