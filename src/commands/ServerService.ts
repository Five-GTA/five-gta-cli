import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import fs from "fs";
import net from "net";
import readline from "readline";
import { logError, logSuccess } from "../logger";
import { exitError, parseJson, setTitle } from "../util";
import { FN_SERVER_CONFIG, ServerConfig } from "./ConfigSerivce";

const SERVER_PORT = 30069;

interface ServerMessage {
    type:string,
    data:string,
}

export async function connectToServer(): Promise<SocketWrapper> {
    return new Promise<SocketWrapper>((resolve, reject)=>{
        const client = new net.Socket();
        client.connect(SERVER_PORT, "127.0.0.1", function() {
            resolve(new SocketWrapper(client));
        });
        client.on("error", reject);
        client.on("close", reject);
    });
}

class SocketWrapper {
    private socket:net.Socket;
    constructor (socket:  net.Socket){
        this.socket = socket;
    }
    public send(type:string, data:string){
        this.socket.write(JSON.stringify({type: type, data: data}));
    }
    public close(){
        this.socket.destroy();
    }
}

export class ServerService {

    private config:ServerConfig;
    private proc:ChildProcessWithoutNullStreams;

    constructor(){
        if (!fs.existsSync(FN_SERVER_CONFIG)){
            exitError("Server config not exists");
        }
        const config = parseJson(fs.readFileSync(FN_SERVER_CONFIG).toLocaleString()) as ServerConfig;
        if (!config.startCommand || !config.workDir){
            exitError("Invalid server config");
        }
        this.config = config;
        this.listen();
        this.proc = this.runFivemServer(config.startCommand);
    }
    
    public runFivemServer(startCommand:string): ChildProcessWithoutNullStreams {
        const proc = spawn(startCommand, {cwd:this.config.workDir});
        proc.stdout.on("data", (data) => process.stdout.write(data));
        proc.stderr.on("data", process.stderr.write);
        proc.on("exit", (code) => {
            exitError(`Child exited with code ${code}`);
        });
        
        const prompt = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        //Proxy prompt
        prompt.on("line", (line)=> {proc.stdin.write(`${line}\n`);});
        return proc;
    }

    public writeInFivem(command:string):void{
        this.proc.stdin.write(`${command}\n`);
    }

    public listen():void {
        
        const tcp = net.createServer((socket)=>{
            socket.on("data", (msg)=>{
                const obj = parseJson(msg.toLocaleString()) as ServerMessage;
                switch (obj.type){
                //TODO: Move this to anotother func/file
                case "restart":
                    setTitle(`🔃 - ${obj.data}`);
                    this.writeInFivem("refresh");
                    this.writeInFivem(`stop ${obj.data}`);
                    this.writeInFivem("refresh");
                    this.writeInFivem(`start ${obj.data}`);
                    logSuccess(`Resource ${obj.data} reloaded`);
                    setTitle(`✔ ${obj.data} reloaded`);
                    break;
                default:
                    logError("Invalid server command");
                    break;
                }
            });
        });
        tcp.listen(SERVER_PORT, "127.0.0.1", ()=>{
            logSuccess(`TCP Server: Start listening on port: ${SERVER_PORT}`);
            setTitle("⌛ Waiting modifications...");
        });
    }
}