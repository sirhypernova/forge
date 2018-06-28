import Bot from "../core/bot";
import Behaviour from "./behaviour";
import Log from "../core/log";

const fs = require("fs");

const path = require("path");

export default class BehaviourManager {
    private readonly bot: Bot;
    private readonly path: string;
    private readonly behaviours: Array<Behaviour>;

    constructor(bot: Bot, path: string) {
        /**
         * @type {Bot}
         * @private
         * @readonly
         */
        this.bot = bot;

        /**
         * @type {string}
         * @private
         * @readonly
         */
        this.path = path;

        /**
         * @type {Array<Behaviour>}
         * @private
         * @readonly
         */
        this.behaviours = [];
    }

    register(behaviour: Behaviour): boolean {
        if (!this.getBehaviour(behaviour.name)) {
            this.behaviours.push(behaviour);

            return true;
        }

        return false;
    }

    registerMultiple(multipleBehaviours: Array<Behaviour>): number {
        let registered: number = 0;

        for (let i: number = 0; i < multipleBehaviours.length; i++) {
            if (this.register(multipleBehaviours[i])) {
                registered++;
            }
        }

        return registered;
    }

    enable(name: string): boolean {
        const behaviour = this.getBehaviour(name);

        if (behaviour) {
            behaviour.enabled(this.bot, this.bot.api);

            return true;
        }

        return false;
    }

    /**
     * Enable all behaviours
     * @return {number} The amount of successfully enabled behaviours
     */
    enableAll(): number {
        let enabled: number = 0;

        for (let i = 0; i < this.behaviours.length; i++) {
            if (this.enable(this.behaviours[i].name)) {
                enabled++;
            }
        }

        return enabled;
    }

    getBehaviour(name: string): Behaviour | null {
        for (let i = 0; i < this.behaviours.length; i++) {
            if (this.behaviours[i].name === name) {
                return this.behaviours[i];
            }
        }

        return null;
    }

    loadAllSync(): number {
        const loadedBehaviours = BehaviourManager.loadAllSync(this.path);

        if (loadedBehaviours) {
            return this.registerMultiple(loadedBehaviours);
        }

        return 0;
    }

    static loadAllSync(directory: string): Array<Behaviour> | null {
        if (!fs.existsSync(directory)) {
            Log.error(`[BehaviourManager.loadAll] Target directory does not exist, no behaviours were loaded: ${directory}`);

            return null;
        }

        const loadedBehaviours: Array<Behaviour> = [];
        const files = fs.readdirSync(directory);

        // TODO: Add ability to ignore files like in command loader (@ character at the start of the name)
        // TODO: Also validate the behaviour
        // TODO: This function should be async, or maybe make other async func implementing this async and returning Promise
        for (let i: number = 0; i < files.length; i++) {
            if (files[i].endsWith(".js")) {
                let module = require(path.resolve(path.join(directory, files[i])));

                // Support for transpiled ES6 modules
                if (module.default) {
                    module = module.default;
                }

                loadedBehaviours.push(new Behaviour(module));
            }
        }

        return loadedBehaviours;
    }
}