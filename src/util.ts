/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function parseJson(text:string):any{
    try {
        return JSON.parse(text);
    } catch (e){
        return {};
    }
}
export function exitError(data?:any):void {
    console.error(data);
    process.exit(0);
}