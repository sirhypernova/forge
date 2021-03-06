import Collection from "./collection";
import fs from "fs";

/**
 * @extends Collection
 */
export default class EmojiCollection extends Collection {
    /**
     * @param {Array<*>} emojis
     */
    constructor(emojis: any[] = []) {
        super(emojis);
    }

    /**
     * @param {string} name
     * @return {string}
     */
    public get(name: string): string {
        return this.find("name", name).id;
    }

    /**
     * @param {string} path
     * @return {EmojiCollection}
     */
    public static fromFile(path: string): EmojiCollection {
        if (!fs.existsSync(path)) {
            throw new Error(`[EmojiCollection.fromFile] Path does not exist: ${path}`);
        }

        return new EmojiCollection(JSON.parse(fs.readFileSync(path).toString()));
    }
}
