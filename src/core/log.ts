import fs from "fs";
import colors from "colors";

export enum LogLevel {
    Fatal,
    Error,
    Warn,
    Info,
    Success,
    Verbose,
    Debug
}

export interface ComposeOptions {
    readonly message: any;
    readonly params: any[];
    readonly type: LogLevel;
    readonly color?: string;
    readonly prefix?: string;
}

export default class Log {
    public static level: LogLevel = LogLevel.Success;

    /**
     * @param {ComposeOptions} options
     * @return {Promise<void>}
     */
    public static async compose(options: ComposeOptions): Promise<any> {
        const finalColor = options.color ? options.color : "white";
        const finalPrefix = options.prefix ? options.prefix : null;

        let message = options.message;

        return new Promise((resolve) => {
            // TODO: Make sure check is working as intended, seems a bit suspicious
            if (Log.level < options.type) {
                resolve();

                return;
            }

            const date = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");

            // TODO: Make this next line work on the vps
            // process.stdout.write(`\x1B[2D[${date}] ${colors[color](message)}\n> `);
            if (typeof message === "string") {
                console.log(`[${date}] ${(colors as any)[finalColor](message)}`, ...options.params);
            }
            else {
                console.log(`[${date}] `, message, ...options.params);
            }

            // TODO
            /* if (finalPrefix !== null) {
                finalMessages = `<${finalPrefix.toUpperCase()}> ${finalMessages}`;
            } */

            fs.writeFile("bot.log", `[${date}] ${message} ${options.params.map((param: any) => param.toString()).join(" ")}\n`, {
                flag: "a"
            }, (error: Error) => {
                if (error) {
                    throw error;
                }

                resolve();
            });
        });
    }

    /**
     * @param {*} message
     * @param {Array<*>} params
     * @return {Promise<*>}
     */
    public static info(message: any, ...params: any[]): Promise<any> {
        const options: ComposeOptions = {
            message: message,
            params: params,
            type: LogLevel.Info,
            color: "cyan",
            prefix: "info"
        };

        return Log.compose(options);
    }

    /**
     * @param {*} message
     * @param {Array<*>} params
     * @return {Promise<*>}
     */
    public static success(message: any, ...params: any[]): Promise<any> {
        const options: ComposeOptions = {
            message: message,
            params: params,
            type: LogLevel.Success,
            color: "green",
            prefix: "sucs"
        };

        return Log.compose(options);
    }

    /**
     * @param {*} message
     * @param {Array<*>} params
     * @return {Promise<*>}
     */
    public static warn(message: any, ...params: any[]): Promise<any> {
        const options: ComposeOptions = {
            message: message,
            params: params,
            type: LogLevel.Warn,
            color: "yellow",
            prefix: "warn"
        };

        return Log.compose(options);
    }

    /**
     * @param {*} message
     * @param {Array<*>} params
     * @return {Promise<*>}
     */
    public static error(message: any, ...params: any[]): Promise<any> {
        const options: ComposeOptions = {
            message: message,
            params: params,
            type: LogLevel.Error,
            color: "red",
            prefix: "dang"
        };

        return Log.compose(options);
    }

    /**
     * @param {*} message
     * @param {Array<*>} params
     * @return {Promise<*>}
     */
    public static throw(message: any, ...params: any[]): Promise<any> {
        const options: ComposeOptions = {
            message: message,
            params: params,
            type: LogLevel.Fatal,
            color: "red",
            prefix: "fata"
        };

        const result = Log.compose(options);

        process.exit(1);

        return result;
    }

    /**
     * @param {*} message
     * @param {Array<*>} params
     * @return {Promise<*>}
     */
    public static verbose(message: any, ...params: any[]): Promise<any> {
        const options: ComposeOptions = {
            message: message,
            params: params,
            type: LogLevel.Verbose,
            color: "grey",
            prefix: "verb"
        };

        return Log.compose(options);
    }

    /**
     * @param {*} message
     * @param {Array<*>} params
     * @return {Promise<*>}
     */
    public static debug(message: any, ...params: any[]): Promise<any> {
        const options: ComposeOptions = {
            message: message,
            params: params,
            type: LogLevel.Debug,
            color: "magenta",
            prefix: "dbug"
        };

        return Log.compose(options);
    }
}
