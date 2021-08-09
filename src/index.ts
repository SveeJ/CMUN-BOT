import dotenv from "dotenv";
dotenv.config();

import Logger from "./logger";

const logger = new Logger("Main");

import bot from "./managers/bot"
import { CategoryChannel, Collection, ColorResolvable, Message, MessageEmbed, TextChannel, VoiceChannel } from "discord.js";
import { Constants } from "./constants";

!async function(){

    const [ client ] = await Promise.all([ bot ]).catch(err => {
        logger.error(`Startup failed:\n${err.stack}`);
        return process.exit(1);
    });

    function createEmbed(footerSuffix: string, description?: string, color: ColorResolvable = "#228B22"){
        const embed = new MessageEmbed() 
            .setAuthor('CMUN', Constants.BRANDING_URL)
            .setColor(color)
            .setFooter(`© CMUN | ${footerSuffix}`, Constants.BRANDING_URL);

        if(description) embed.setDescription(description);
        
        return embed;
    }

    client.on("message", async function(message){

        if(message.author.bot) { return } 
        
        console.log("message received");
        message.channel.send(createEmbed("", "You have successfully registered!"));
    });
 
    client.on('guildMemberAdd', async member => {

    });

    client.on('guildMemberRemove', async member => {
        
    });

    logger.info("App is now online!");
}();