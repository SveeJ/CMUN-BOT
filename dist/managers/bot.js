"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_1 = __importDefault(require("../logger"));
const TOKEN = "ODc0Mjk1MTM1MTEyOTQ1Njk1.YRE4yw.c9Um6NYcB1cslHQWK48JDA3XBR4";
const logger = new logger_1.default("Bot Manager");
if (!TOKEN) {
    logger.error("Required environment variable TOKEN is not defined.");
    process.exit(1);
}
const bot = new Promise((res, rej) => {
    const client = new discord_js_1.Client({ intents: ['DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING', 'GUILDS', 'GUILD_BANS',
            'GUILD_INTEGRATIONS', 'GUILD_INVITES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS',
            'GUILD_PRESENCES', 'GUILD_VOICE_STATES', 'GUILD_WEBHOOKS'], partials: ['MESSAGE'] });
    client.login(TOKEN).catch(err => {
        logger.error("Failed to login to Discord.");
        rej(err);
    });
    client.on("ready", async () => {
        console.log("I am ready!");
    });
    res(client);
});
exports.default = bot;
