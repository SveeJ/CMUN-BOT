import { Client, Guild } from "discord.js";
import Logger from "../logger";

const TOKEN = "ODc0Mjk1MTM1MTEyOTQ1Njk1.YRE4yw.c9Um6NYcB1cslHQWK48JDA3XBR4";

const logger = new Logger("Bot Manager");

if(!TOKEN){
    logger.error("Required environment variable TOKEN is not defined.");
    process.exit(1);
}

const bot = new Promise<Client>((res, rej) => {
    const client = new Client({ intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS','DIRECT_MESSAGE_TYPING', 'GUILDS', 'GUILD_BANS',
    'GUILD_INTEGRATIONS', 'GUILD_INVITES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS',
    'GUILD_PRESENCES', 'GUILD_VOICE_STATES', 'GUILD_WEBHOOKS'], partials: ['MESSAGE']});

    client.login(TOKEN).catch(err => {
        logger.error("Failed to login to Discord.");
        rej(err);
    });

    client.on("ready", async () => {
        console.log("I am ready!");
    });

    res(client);
});

export default bot;