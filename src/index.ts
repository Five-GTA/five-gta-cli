#!/usr/bin/env node

import { Config } from "./commands/Config";
import { Resource } from "./commands/Resouce";
import { Server } from "./commands/Server";



const args = process.argv;
const type = args[2];

switch (type){
case "new-server":
    new Config("server");
    break;
case "new-resource":
    new Config("resource");
    break;
case "start":
    new Server();
    break;
case "deploy":
    new Resource();
    break;
case "help":    
default:
    console.log("Use: five-cli\n\tnew-server - To make a new server config file\n\tnew-resource - To make a new resource config file\n\tstart - To start a new dev server based on config in directory\n\tdeploy - To deploy resource into dev server (the server need to be started before)");
    break;    
}