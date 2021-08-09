import dotenv from "dotenv";
dotenv.config();

import Logger from "./logger";

const logger = new Logger("Main");

import bot from "./managers/bot"
import { CategoryChannel, Collection, ColorResolvable, Message, MessageEmbed, TextChannel, VoiceChannel } from "discord.js";
import { Constants } from "./constants";
import { codes } from "./codes.json";

!async function(){

    const [ client ] = await Promise.all([ bot ]).catch(err => {
        logger.error(`Startup failed:\n${err.stack}`);
        return process.exit(1);
    });

    const admin = await client.guilds.fetch('874354069098094632');

    function createEmbed(description?: string, color: ColorResolvable = "#228B22", footerSuffix: string = "25th Annual Session"){
        const embed = new MessageEmbed() 
            .setAuthor('CMUN', Constants.BRANDING_URL)
            .setColor(color)
            .setFooter(`© CMUN | ${footerSuffix}`, Constants.BRANDING_URL);

        if(description) embed.setDescription(description);
        
        return embed;
    }

    function report(message: string) {
        (admin!.channels.cache.get('874354091386601522') as TextChannel).send(message);
    }

    client.on("message", async function(message){

        if(message.author.bot || !message.guild || !message.member) { return };
        
        const guild = message.guild;

        // Verification --> 

        if(Constants.VERIFICATION_CHANNELS.includes(message.channel.id)) {
            
            // if code valid code to be removed from valid code list [pending]

            if(codes.includes(message.content)) {

                if(message.member.roles.cache.find(role => role.name == "Delegate")) {
                    return message.reply(createEmbed(`Sorry, you are already registered.`, Constants.RED));
                }

                if(await message.member.roles.add(message.guild.roles.cache.find(r => r.name == "Delegate")!).catch(() => { 
                    message.reply(createEmbed("Sorry I cannot locate the Delegate role. Please contact your nearest `CMUN IT` Representative for further assistance.", Constants.RED));
                    return report(`Delegate Role cannot be found in ${message.guild!.name}.`) 
                })) {
                    message.channel.send(createEmbed("You have successfully registered!"));     
                }               
            }

            else if(/^\d+$/.test(message.content)) {
                report(`${message.author.id} tried to enter an incorrect code in ${message.guild.name}.`);
                return message.reply("Sorry but that isn't a valid code. Please try again.");
            }

            else {
                report(`${message.author.id} is spamming the verification channels in ${message.guild.name}.`);
            }
        }

        // POI --> 

        if(message.content.startsWith('=POI') || message.content.startsWith('=poi')) {

            const ids: string[] = [message.author.id];

            const mem = message.mentions.members?.first();
            let msg = "";

            if(mem) {
                msg = `${message.member.displayName}'s POI to ${mem?.displayName}`; 
                ids.push(mem.id);
            }
            else {
                msg = `${message.member.displayName}'s POI`; 
            }
        
            msg = msg.substring(0, 100);

            const category = Constants.POI_CATEGORIES[Constants.GUILDS.indexOf(message.guild.id)];
            const poi_ch = await guild!.channels.create(msg, { type: "text", parent: category, permissionOverwrites: [
                {
                    id: guild.id,
                    deny: ['VIEW_CHANNEL']
                }
            ] });

            ids.forEach(id => {
                poi_ch.updateOverwrite(id, { VIEW_CHANNEL: true, ATTACH_FILES: true, SEND_MESSAGES: true, ADD_REACTIONS: true });
            });

            await poi_ch.send(createEmbed("Archive POI by using `=archive`", Constants.AQUA));
        }

        // Archive -->

        else if(message.content == "=archive" && Constants.POI_CATEGORIES.includes((message.channel as TextChannel).parentID!)) {
            const archive = Constants.ARCHIVE_CHANNELS[Constants.GUILDS.indexOf(message.guild.id)];

            (message.channel as TextChannel).setParent(archive);

            await (message.channel as TextChannel).overwritePermissions([{ id: message.guild.id, deny: 'VIEW_CHANNEL' }]);

            message.channel.send(createEmbed("Archived.", "RED"));
        }

    });

    logger.info("App is now online!");
}();