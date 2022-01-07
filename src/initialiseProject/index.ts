import {UserPreferences} from "./UserPreferences.js";
import {Builder} from "./Builder.js";
import {createPrompt} from "./createPrompt.js";
import {logger, logWelly} from "../lib/logger.js";
import {Configurator} from "./Configurator.js";


export function initialiseProject(): void {
    createPrompt()
        .then(async answers => {
            const preferences = new UserPreferences(answers);
            logWelly();
            await new Builder(preferences).init();
            return preferences;
        }).then(async (preferences) => {
            return await new Configurator(preferences).configure();
        }).catch(e => logger.error(e));
}