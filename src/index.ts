import Logger from "./logger";

const logger = new Logger("Main");

import bot from "./managers/bot"
import { MessageButton, MessageActionRow, CollectorFilter, ColorResolvable, Message, MessageEmbed, MessageReaction, TextChannel, User, VoiceChannel, Interaction, GuildMember, Role, Snowflake, GuildChannel, Guild, CategoryChannel } from "discord.js";
import { Constants } from "./constants";
import fs from 'fs';

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

    function buttonsRow(bool: boolean, votes1: number, votes2: number): MessageActionRow {
        return new MessageActionRow()
            .addComponents(
              [new MessageButton()
                .setCustomId(VotesOptions.Yes)
                .setLabel(`Yes ${votes1}`)
                .setStyle('SUCCESS')
                .setDisabled(bool),
                new MessageButton()
                .setCustomId(VotesOptions.No)
                .setLabel(`No ${votes2}`)
                .setStyle('DANGER')
                .setDisabled(bool)]
            );
    }

    client.on('messageCreate', async function(message){

        if(message.author.bot || !message.guild || !message.member) { return };
        
        const guild = message.guild;


        const prefix = '='
        if (!prefix) return    
        const args: string[] = message.content.slice(prefix.length).trim().split(/ +/g)
        const firstArg: string | undefined = args.shift()
        if (!firstArg) return

        // Verification --> 

        if(Constants.VERIFICATION_CHANNELS.includes(message.channel.id)) {
            
            // if code valid code to be removed from valid code list [pending]

            if(Constants.CODES.includes(message.content)) {

                const logs = admin.channels.cache.get('874600703786614804') as TextChannel;

                if(message.member.roles.cache.find(role => role.name === "Delegate")) {
                    message.reply({embeds: [createEmbed(`Sorry, you are already registered.`, Constants.RED)]});
                    return;
                }

                const data: string[] = [];

                (await logs.messages.fetch()).forEach((value) => {
                    data.push(value.content);
                });

                let stringified = "";

                data.forEach(da => {
                    stringified += da.split(" ");
                })

                let d = stringified.split(",");
                d = d.filter(da => da.length === 8 && /^\d+$/.test(da));

                if(d.includes(message.content)) {
                    report(`${message.author.id} tried to input a code that was already used before. Code: ${message.content} in ${guild.name}`);
                    message.reply({ embeds: [ createEmbed("This code has already been used. Please try again.", "RED") ] });
                    return;
                }

                if(await message.member.roles.add(message.guild.roles.cache.find(r => r.name === "Delegate")!).catch(() => { 
                    message.reply({embeds: [createEmbed("Sorry I cannot locate the Delegate role. Please contact your nearest `CMUN IT` Representative for further assistance.", Constants.RED)]});
                    report(`Delegate Role cannot be found in ${message.guild!.name}.`);
                    return;
                })) {

                    logs.send(`Code: ${message.content} User: ${message.author.id} Server: ${guild.name}`);
                    message.channel.send({embeds: [createEmbed("You have successfully registered!")]});     
                }               
            }

            else if(/^\d+$/.test(message.content)) {
                report(`${message.author.id} tried to enter an incorrect code in ${message.guild.name}.`); 
                message.reply("Sorry but that isn't a valid code. Please try again.");
                return;
            }

            else {
                report(`${message.author.id} is spamming the verification channels in ${message.guild.name}.`);
            }
        }

        // chit --> 

        if(message.content.toLowerCase().startsWith('=chit')) {

            const ids: string[] = [message.author.id];

            const mem = message.mentions.members?.first();
            let msg = "";

            if(mem) {
                msg = `${message.member.displayName}'s chit to ${mem?.displayName}`; 
                ids.push(mem.id);
            }
            else {
                msg = `${message.member.displayName}'s chit`; 
            }
        
            msg = msg.substring(0, 100);

            const category = await getCategory('chits', guild);
            if(!category) 
            {
                message.reply({ embeds: [createEmbed("We encountered an issue. Please contact your nearest `CMUN IT Representative` for further assistance.", "RED")] });
                return;
            }
            const poi_ch = await guild!.channels.create(msg, { type: 'GUILD_TEXT', parent: category, permissionOverwrites: [
                {
                    id: guild.id,
                    deny: ['VIEW_CHANNEL']
                }
            ] });

            ids.forEach(id => {
                poi_ch.permissionOverwrites.edit(id, { VIEW_CHANNEL: true, ATTACH_FILES: true, SEND_MESSAGES: true, ADD_REACTIONS: true });
            });

            await poi_ch.send({embeds: [createEmbed("Archive chit by using `=archive`", Constants.AQUA)]});
        }

        // Archive -->

        else if(message.content === "=archive" && message.member.permissions.has('ADMINISTRATOR')) {
            if(!((message.channel as TextChannel).parent?.name === 'chits')) {
                return;
            }
            const archive = await getCategory('archive', guild);

            if(!archive) {
                message.reply({ embeds: [createEmbed("We encountered an issue. Please contact your nearest `CMUN IT Representative` for further assistance.", "RED")] });
                return;
            }

            (message.channel as TextChannel).setParent(archive);

            await (message.channel as TextChannel).permissionOverwrites.create(guild.id, { VIEW_CHANNEL: false });

            message.channel.send({embeds: [createEmbed("Archived.", "RED")]});
        }

        // Vote -->

        else if(message.content.startsWith("=vote") && Constants.EB_COMMAND_CHANNELS.includes(message.channel.id)) {

            const motion = args.join(' ');

            if(!motion) {
                message.reply({embeds: [createEmbed("Please enter a name for the motion to be voted on.", "RED")]});
                return;
            }

            const voting_ch = guild.channels.cache.get(Constants.VOTING_CHANNELS[Constants.GUILDS.indexOf(guild.id)]) as TextChannel;
            const delRole = guild.roles.cache.find(r => r.name === "Delegate");

            if(!voting_ch || !delRole) {
                message.reply({embeds: [createEmbed("Something went wrong when trying to create a vote. I cannot identify the voting channel or the Delegate Role. Please contact your nearest `CMUN IT` representative.", "RED")]});
                report(`Delegate role or Voting Channel cannot be found in ${guild.name}`);
                return;
            }
            
            const time = 60;
            let count = 1;
            const voteMessage = await voting_ch.send({embeds: [createEmbed(`Voting on motion \`${motion}\`\n**In progress**\n\n**Timer**\nTime Left: ${time}s`, 'BLUE')], components: [buttonsRow(false, 0, 0)]})

            const interval = setInterval(() => {
                if (!voteMessage.deleted) {
                    voteMessage.edit({embeds: [createEmbed(`Voting on motion \`${motion}\`\n**In progress**\n\n**Timer**\nTime Left: ${time - 5*count}s`, 'BLUE')]})
                }
                count++;
            }, 5000)

            votesCollection.set(voteMessage.id, {
                votes: {yes: {members: [], count: 0}, no: {members: [], count: 0}},
                message: voteMessage,
                interval,
                motion 
            })
  
            message.reply({embeds:[createEmbed("Vote has been created successfully!")]});

            const voteCollector = voteMessage.createMessageComponentCollector({componentType: 'BUTTON', time: 60000})

            voteCollector.on('collect', (i: Interaction) => {
                if (!i.isButton()) return;

                const member = i.member

                if (!(member instanceof GuildMember)) return;

                const votesData = votesCollection.get(voteMessage.id)

                if (!votesData) return;

                if (!canVote(delRole, member, voteMessage)) {
                    i.reply({embeds: [createEmbed("You cannot vote without the delegate role or you have already voted.", "RED")], ephemeral: true})
                    return;
                }

                switch(i.customId as VotesOptions) {
                    case VotesOptions.Yes : 
                        votesData.votes.yes.members.push(member)
                        votesData.votes.yes.count+=1
                        voteMessage.edit({components: [buttonsRow(false, votesData.votes.yes.count,votesData.votes.no.count)]})
                    break
                    case VotesOptions.No : 
                        votesData.votes.no.members.push(member)
                        votesData.votes.no.count+=1
                        voteMessage.edit({components: [buttonsRow(false, votesData.votes.yes.count, votesData.votes.no.count)]})
                    break
                }

                i.reply({embeds: [createEmbed('Your vote has been registered!', 'GREEN')], ephemeral: true})
                
            })
 


            voteCollector.on('end', async (collected) => {
                const votes = votesCollection.get(voteMessage.id)
                if (!votes) return;

                const percentage = votes.votes.yes.count/(votes.votes.yes.count + votes.votes.no.count)*100;
                voteMessage.edit({embeds: [createEmbed(`**Concluded**\nPercentage of 'yes votes' is \`${percentage.toFixed(2)}%\``, 'BLUE')], components: [buttonsRow(true, votes.votes.yes.count, votes.votes.no.count)]})
                clearInterval(votes.interval);
                const logChannel = await guild.channels.fetch('874174044612747338')
                if (logChannel?.isText()) {
                    logChannel.send({embeds: [votersResult(votes, delRole)]})
                }
                votesCollection.delete(voteMessage.id)
            })
        }

        // VC + TC --> 

        if(message.content.startsWith("=")) {

            const msgs = (await (admin.channels.cache.get(Constants.CHANNEL_LOG) as TextChannel).messages.fetch().catch(() => undefined));
            const userMsg: string[] = [];

            if(!msgs) return;

            msgs.forEach(msg => {
                if(msg.content.split(" ").includes(message.author.id) && msg.content.split(" ")) {
                    userMsg.push(msg.content);
                }
            });

            if(message.content.toLowerCase() === "=tc") {

                if(userMsg.find(msg => msg.includes('TEXT'))) {
                    message.reply({ embeds: [createEmbed("Sorry you already have an active `Text Channel`.", "RED")] });
                    return;
                };

                const cat = await getCategory('lobby', guild);

                if(!cat) {
                    message.reply({ embeds: [createEmbed("We encountered an issue. Please contact your nearest `CMUN IT Representative` for further assistance.", "RED")] });
                    return;
                }

                const channel = await guild.channels.create(`${message.member.displayName}`, { type: "GUILD_TEXT", parent: cat, permissionOverwrites: [{ id: guild.id, deny: ['VIEW_CHANNEL'] }, { id: message.author.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'ADD_REACTIONS'] }] });
                const ch = admin.channels.cache.get(Constants.CHANNEL_LOG) as TextChannel;
                ch.send(`Channel: ${channel.id} User: ${message.author.id} Type: TEXT`).catch(() => null); 
            }
            else if(message.content.toLowerCase() === "=vc") {

                if(userMsg.find(msg => msg.includes('VOICE'))) {
                    message.reply({ embeds: [createEmbed("Sorry you already have an active `Voice Channel`.", "RED")] });
                    return;
                };
                
                const cat = await getCategory('lobby', guild);

                if(!cat) {
                    message.reply({ embeds: [createEmbed("We encountered an issue. Please contact your nearest `CMUN IT Representative` for further assistance.", "RED")] });
                    return;
                }

                if(guild.channels.cache.find(ch => ch.name === message.member?.displayName && ch.type === 'GUILD_VOICE')) {
                    message.reply({ embeds: [ createEmbed("Sorry but you have already created a voice channel.", "RED") ] });
                    return;
                }

                const channel = await guild.channels.create(`${message.member.displayName}`, { type: "GUILD_VOICE", parent: cat, permissionOverwrites: [{ id: guild.id, deny: ['VIEW_CHANNEL'] }, { id: message.author.id, allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM'] }] });
                const ch = admin.channels.cache.get(Constants.CHANNEL_LOG) as TextChannel;
                ch.send(`Channel: ${channel.id} User: ${message.author.id} Type: VOICE`).catch(() => null); 
            }
            
            if(message.content.toLowerCase().startsWith("=invitevc") || message.content.toLowerCase().startsWith("=removevc")) {
                
                const vcMsg = userMsg.find(msg => msg.includes('VOICE'));

                const chID = vcMsg?.split(" ")[1];

                if(!chID) {
                    message.reply({ embeds: [ createEmbed("You don't have an active Voice Channel. Please create one with `=VC`.", "RED") ] });
                    return;
                }

                const channel = guild.channels.cache.get(chID);

                if(!channel) {
                    message.reply({ embeds: [createEmbed("We could not find your channel. Please contact your nearest `CMUN IT Representative` for further assistance.", "RED")] });
                    return;
                }

                const opt = message.content.toLowerCase().startsWith("=invitevc") ? "invite" : "remove";

                if(!message.mentions.members?.first()) { 
                    message.reply({ embeds: [ createEmbed(`You must mention someone to ${opt} them.`, "RED") ] });
                    return;    
                }

                message.mentions.members?.forEach((mem) => {
                    if(opt === "invite") {
                        (channel as VoiceChannel).permissionOverwrites.edit(mem.id, { 'CONNECT': true, 'VIEW_CHANNEL': true, 'SPEAK': true, 'STREAM': true });
                        message.reply({embeds: [ createEmbed("User is now allowed to join your Voice Channel!") ]});
                    }
                    else {
                        (channel as VoiceChannel).permissionOverwrites.delete(mem.id);
                        message.reply({embeds: [ createEmbed("User is now removed from your Voice Channel!", "RED") ]});
                    }
                });
            }
            else if(message.content.toLowerCase().startsWith("=invitetc") || message.content.toLowerCase().startsWith("=removetc")) {
                
                const tcMsg = userMsg.find(msg => msg.includes('TEXT'));

                const chID = tcMsg?.split(" ")[1];

                if(!chID) {
                    message.reply({ embeds: [ createEmbed("You don't have an active Text Channel. Please create one with `=TC`.", "RED") ] });
                    return;
                }

                const channel = guild.channels.cache.get(chID);

                if(!channel) {
                    message.reply({ embeds: [createEmbed("We could not find your channel. Please contact your nearest `CMUN IT Representative` for further assistance.", "RED")] });
                    return;
                }

                const opt = message.content.toLowerCase().startsWith("=invitetc") ? "invite" : "remove";

                if(!message.mentions.members?.first()) { 
                    message.reply({ embeds: [ createEmbed("You must mention someone to invite them.", "RED") ] });
                    return;    
                }

                message.mentions.members?.forEach((mem) => {
                    if(opt === "invite") {
                        (channel as TextChannel).permissionOverwrites.edit(mem.id, { 'SEND_MESSAGES': true, 'VIEW_CHANNEL': true, 'ATTACH_FILES': true, 'ADD_REACTIONS': true });
                        message.reply({embeds: [ createEmbed("User is now allowed to join your Text Channel!") ]});
                    }
                    else {
                        (channel as TextChannel).permissionOverwrites.delete(mem.id);
                        message.reply({embeds: [ createEmbed("User is now removed from your Text Channel!", "RED") ]});
                    }
                });
            }

            else if(message.content.toLowerCase().startsWith("=rename")) {

                const opt = message.content.toLowerCase().startsWith("=renametc") ? "TEXT" : message.content.toLowerCase().startsWith("=renamevc") ? "VOICE" : undefined;

                if(!opt) {
                    message.reply({ embeds: [ createEmbed("Please use `=renametc [name]` or `=renamevc [name]` to rename your personal channels.", "RED") ] });
                    return;
                }

                const chID = userMsg.find(msg => msg.includes(opt));

                if(!chID) {
                    message.reply({ embeds: [ createEmbed(`You do not have a personal \`${opt}\` channel to rename. Use \`=TC\` or \`=VC\` to create your own.`, "RED") ] });
                    return;
                }

                const channel = guild.channels.cache.get(chID.split(" ")[1]);

                if(!channel) {
                    message.reply({ embeds: [createEmbed("We could not find your channel. Please contact your nearest `CMUN IT Representative` for further assistance.", "RED")] });
                    return;
                }

                const name = message.content.split(" ").slice(1).join(" ").substring(0, 100);

                (channel as GuildChannel).setName(name).catch(() => null);

                message.reply({ embeds: [createEmbed("Channel successfully renamed!", "GREEN")] });
            }
        }
    });

    logger.info("App is now online!");
}();



enum VotesOptions {
    Yes = 'yes',
    No = 'no'
}

const votesCollection: Map<Snowflake, {votes: {yes: {members: GuildMember[], count: number}, no: {members: GuildMember[], count: number}}, message: Message, interval: NodeJS.Timer, motion: string}> = new Map();


function canVote(delegateRole: Role, member: GuildMember, voteMessage: Message): boolean {
    const votesData = votesCollection.get(voteMessage.id)

    return !(votesData?.votes.yes.members.concat(votesData?.votes.no.members).includes(member) || !member.roles.cache.has(delegateRole.id));
}

function votersResult(votesData: {votes: {yes: {members: GuildMember[], count: number}, no: {members: GuildMember[], count: number}}, message: Message, interval: NodeJS.Timer, motion: string}, delRole: Role): MessageEmbed {
    const votedMembers = votesData.votes.yes.members.concat(votesData.votes.no.members)
    const noVote = delRole.members?.filter(m => m.roles.cache.size <= 2 && !votedMembers.includes(m))
    const votedYes = votesData.votes.yes.members.map(m => `\`${m.displayName}\``).join('\n')
    const votedNo = votesData.votes.no.members.map(m => `\`${m.displayName}\``).join('\n')
    const noVoteMembers = noVote.map(m => `\`${m.displayName}\``).join('\n')


    return new MessageEmbed()
    .setColor('BLUE')
    .setTitle(`Voting result for ${votesData.motion}`)
    .addField('Voted Yes', votedYes ? votedYes : `\`None\``, true) 
    .addField('Voted No',  votedNo ? votedNo : `\`None\``, true) 
    .addField('Didn\'t vote',  noVoteMembers ? noVoteMembers : `\`None\``, true) 

}

async function getCategory(cat: string, guild: Guild) {
    const category = guild.channels.cache.find(c => c.name.toLowerCase() === cat) as CategoryChannel;

    if(!cat) return undefined;

    if(category.children.size >= 20) return await category.clone();
    
    else return category;
}   

// Create a queue for category limits