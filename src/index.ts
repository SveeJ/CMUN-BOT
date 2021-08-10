import Logger from "./logger";

const logger = new Logger("Main");

import bot from "./managers/bot"
import { MessageButton, MessageActionRow, CollectorFilter, ColorResolvable, Message, MessageEmbed, MessageReaction, TextChannel, User, VoiceChannel, Interaction, GuildMember, Role, Snowflake } from "discord.js";
import { Constants } from "./constants";
import { codes } from "./codes.json";

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
    
        const command: string = firstArg.toLowerCase()

        
        

        // Verification --> 

        if(Constants.VERIFICATION_CHANNELS.includes(message.channel.id)) {
            
            // if code valid code to be removed from valid code list [pending]

            if(codes.includes(message.content)) {

                if(message.member.roles.cache.find(role => role.name == "Delegate")) {
                    message.reply({embeds: [createEmbed(`Sorry, you are already registered.`, Constants.RED)]});
                    return;
                }

                if(await message.member.roles.add(message.guild.roles.cache.find(r => r.name == "Delegate")!).catch(() => { 
                    message.reply({embeds: [createEmbed("Sorry I cannot locate the Delegate role. Please contact your nearest `CMUN IT` Representative for further assistance.", Constants.RED)]});
                    report(`Delegate Role cannot be found in ${message.guild!.name}.`);
                    return;
                })) {
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
            const poi_ch = await guild!.channels.create(msg, { type: 'GUILD_TEXT', parent: category, permissionOverwrites: [
                {
                    id: guild.id,
                    deny: ['VIEW_CHANNEL']
                }
            ] });

            ids.forEach(id => {
                poi_ch.permissionOverwrites.edit(id, { VIEW_CHANNEL: true, ATTACH_FILES: true, SEND_MESSAGES: true, ADD_REACTIONS: true });
            });

            await poi_ch.send({embeds: [createEmbed("Archive POI by using `=archive`", Constants.AQUA)]});
        }

        // Archive -->

        else if(message.content == "=archive" && Constants.POI_CATEGORIES.includes((message.channel as TextChannel).parentId!)) {
            const archive = Constants.ARCHIVE_CHANNELS[Constants.GUILDS.indexOf(message.guild.id)];

            (message.channel as TextChannel).setParent(archive);

            await (message.channel as TextChannel).permissionOverwrites.create(guild.id, { VIEW_CHANNEL: false });

            message.channel.send({embeds: [createEmbed("Archived.", "RED")]});
        }

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
                const logChannel = await guild.channels.fetch('874580965048078377')
                if (logChannel?.isText()) {
                    logChannel.send({embeds: [votersResult(votes, delRole)]})
                }
                votesCollection.delete(voteMessage.id)
            })
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

/*async function deleteCode(code: string) {
    let data = fs.readFileSync('codes.json');
    let json = JSON.parse(data.toString());
    console.log(json);
}*/

