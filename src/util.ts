/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { logError } from "./logger";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function parseJson(text:string):any{
    try {
        return JSON.parse(text);
    } catch (e){
        return {};
    }
}
export function exitError(data?:any):void {
    logError(data);
    process.exit(0);
}

export function setTitle(title:string):void{
    process.stdout.write(`${String.fromCharCode(27)}]0;${title}${String.fromCharCode(7)}`);
}