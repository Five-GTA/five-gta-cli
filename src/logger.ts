enum Color {
    RED,
    GREEN,
    YELLOW,
}

export function logSuccess(text:string):void{
    log(text, Color.GREEN);
}
export function logError(text:string):void{
    log(text, Color.RED);
}
export function logWarning(text:string):void{
    log(text, Color.YELLOW);
}

function log(text:string, color?:Color):void{
    let c = "\x1b[0m";
    switch(color){
    case Color.RED:
        c = "\x1b[31m";
        break;
    case Color.GREEN:
        c = "\x1b[32m";
        break;
    case Color.YELLOW:
        c = "\x1b[33m";
        break;    
    }
    console.log(`${c}[FIVE-CLI] - ${text}\x1b[0m`);
}