"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
const logger = new logger_1.default("Main");
const bot_1 = __importDefault(require("./managers/bot"));
const discord_js_1 = require("discord.js");
const constants_1 = require("./constants");
const codes_json_1 = require("./codes.json");
require("fs");
!async function () {
    const [client] = await Promise.all([bot_1.default]).catch(err => {
        logger.error(`Startup failed:\n${err.stack}`);
        return process.exit(1);
    });
    const admin = await client.guilds.fetch('874354069098094632');
    function createEmbed(description, color = "#228B22", footerSuffix = "25th Annual Session") {
        const embed = new discord_js_1.MessageEmbed()
            .setAuthor('CMUN', constants_1.Constants.BRANDING_URL)
            .setColor(color)
            .setFooter(`© CMUN | ${footerSuffix}`, constants_1.Constants.BRANDING_URL);
        if (description)
            embed.setDescription(description);
        return embed;
    }
    function report(message) {
        admin.channels.cache.get('874354091386601522').send(message);
    }
    function buttonsRow(bool, votes1, votes2) {
        return new discord_js_1.MessageActionRow()
            .addComponents([new discord_js_1.MessageButton()
                .setCustomId(VotesOptions.Yes)
                .setLabel(`Yes ${votes1}`)
                .setStyle('SUCCESS')
                .setDisabled(bool),
            new discord_js_1.MessageButton()
                .setCustomId(VotesOptions.No)
                .setLabel(`No ${votes2}`)
                .setStyle('DANGER')
                .setDisabled(bool)]);
    }
    client.on('messageCreate', async function (message) {
        if (message.author.bot || !message.guild || !message.member) {
            return;
        }
        ;
        const guild = message.guild;
        const prefix = '=';
        if (!prefix)
            return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const firstArg = args.shift();
        if (!firstArg)
            return;
        const command = firstArg.toLowerCase();
        if (constants_1.Constants.VERIFICATION_CHANNELS.includes(message.channel.id)) {
            if (codes_json_1.codes.includes(message.content)) {
                if (message.member.roles.cache.find(role => role.name == "Delegate")) {
                    message.reply({ embeds: [createEmbed(`Sorry, you are already registered.`, constants_1.Constants.RED)] });
                    return;
                }
                if (await message.member.roles.add(message.guild.roles.cache.find(r => r.name == "Delegate")).catch(() => {
                    message.reply({ embeds: [createEmbed("Sorry I cannot locate the Delegate role. Please contact your nearest `CMUN IT` Representative for further assistance.", constants_1.Constants.RED)] });
                    report(`Delegate Role cannot be found in ${message.guild.name}.`);
                    return;
                })) {
                    message.channel.send({ embeds: [createEmbed("You have successfully registered!")] });
                }
            }
            else if (/^\d+$/.test(message.content)) {
                report(`${message.author.id} tried to enter an incorrect code in ${message.guild.name}.`);
                message.reply("Sorry but that isn't a valid code. Please try again.");
                return;
            }
            else {
                report(`${message.author.id} is spamming the verification channels in ${message.guild.name}.`);
            }
        }
        if (message.content.startsWith('=POI') || message.content.startsWith('=poi')) {
            const ids = [message.author.id];
            const mem = message.mentions.members?.first();
            let msg = "";
            if (mem) {
                msg = `${message.member.displayName}'s POI to ${mem?.displayName}`;
                ids.push(mem.id);
            }
            else {
                msg = `${message.member.displayName}'s POI`;
            }
            msg = msg.substring(0, 100);
            const category = constants_1.Constants.POI_CATEGORIES[constants_1.Constants.GUILDS.indexOf(message.guild.id)];
            const poi_ch = await guild.channels.create(msg, { type: 'GUILD_TEXT', parent: category, permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: ['VIEW_CHANNEL']
                    }
                ] });
            ids.forEach(id => {
                poi_ch.permissionOverwrites.edit(id, { VIEW_CHANNEL: true, ATTACH_FILES: true, SEND_MESSAGES: true, ADD_REACTIONS: true });
            });
            await poi_ch.send({ embeds: [createEmbed("Archive POI by using `=archive`", constants_1.Constants.AQUA)] });
        }
        else if (message.content == "=archive" && constants_1.Constants.POI_CATEGORIES.includes(message.channel.parentId)) {
            const archive = constants_1.Constants.ARCHIVE_CHANNELS[constants_1.Constants.GUILDS.indexOf(message.guild.id)];
            message.channel.setParent(archive);
            await message.channel.permissionOverwrites.create(guild.id, { VIEW_CHANNEL: false });
            message.channel.send({ embeds: [createEmbed("Archived.", "RED")] });
        }
        else if (message.content.startsWith("=vote") && constants_1.Constants.EB_COMMAND_CHANNELS.includes(message.channel.id)) {
            const motion = args.join(' ');
            if (!motion) {
                message.reply({ embeds: [createEmbed("Please enter a name for the motion to be voted on.", "RED")] });
                return;
            }
            const voting_ch = guild.channels.cache.get(constants_1.Constants.VOTING_CHANNELS[constants_1.Constants.GUILDS.indexOf(guild.id)]);
            const delRole = guild.roles.cache.find(r => r.name === "Delegate");
            if (!voting_ch || !delRole) {
                message.reply({ embeds: [createEmbed("Something went wrong when trying to create a vote. I cannot identify the voting channel or the Delegate Role. Please contact your nearest `CMUN IT` representative.", "RED")] });
                report(`Delegate role or Voting Channel cannot be found in ${guild.name}`);
                return;
            }
            const time = 60;
            let count = 1;
            const voteMessage = await voting_ch.send({ embeds: [createEmbed(`Voting on motion \`${motion}\`\n**In progress**\n\n**Timer**\nTime Left: ${time}s`, 'BLUE')], components: [buttonsRow(false, 0, 0)] });
            const interval = setInterval(() => {
                if (!voteMessage.deleted) {
                    voteMessage.edit({ embeds: [createEmbed(`Voting on motion \`${motion}\`\n**In progress**\n\n**Timer**\nTime Left: ${time - 5 * count}s`, 'BLUE')] });
                }
                count++;
            }, 5000);
            votesCollection.set(voteMessage.id, {
                votes: { yes: { members: [], count: 0 }, no: { members: [], count: 0 } },
                message: voteMessage,
                interval,
                motion
            });
            message.reply({ embeds: [createEmbed("Vote has been created successfully!")] });
            const voteCollector = voteMessage.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });
            voteCollector.on('collect', (i) => {
                if (!i.isButton())
                    return;
                const member = i.member;
                if (!(member instanceof discord_js_1.GuildMember))
                    return;
                const votesData = votesCollection.get(voteMessage.id);
                if (!votesData)
                    return;
                if (!canVote(delRole, member, voteMessage)) {
                    i.reply({ embeds: [createEmbed("You cannot vote without the delegate role or you have already voted.", "RED")], ephemeral: true });
                    return;
                }
                switch (i.customId) {
                    case VotesOptions.Yes:
                        votesData.votes.yes.members.push(member);
                        votesData.votes.yes.count += 1;
                        voteMessage.edit({ components: [buttonsRow(false, votesData.votes.yes.count, votesData.votes.no.count)] });
                        break;
                    case VotesOptions.No:
                        votesData.votes.no.members.push(member);
                        votesData.votes.no.count += 1;
                        voteMessage.edit({ components: [buttonsRow(false, votesData.votes.yes.count, votesData.votes.no.count)] });
                        break;
                }
                i.reply({ embeds: [createEmbed('Your vote has been registered!', 'GREEN')], ephemeral: true });
            });
            voteCollector.on('end', async (collected) => {
                const votes = votesCollection.get(voteMessage.id);
                if (!votes)
                    return;
                const percentage = votes.votes.yes.count / (votes.votes.yes.count + votes.votes.no.count) * 100;
                voteMessage.edit({ embeds: [createEmbed(`**Concluded**\nPercentage of 'yes votes' is \`${percentage.toFixed(2)}%\``, 'BLUE')], components: [buttonsRow(true, votes.votes.yes.count, votes.votes.no.count)] });
                clearInterval(votes.interval);
                const logChannel = await guild.channels.fetch('874580965048078377');
                if (logChannel?.isText()) {
                    logChannel.send({ embeds: [votersResult(votes, delRole)] });
                }
                votesCollection.delete(voteMessage.id);
            });
        }
    });
    logger.info("App is now online!");
}();
var VotesOptions;
(function (VotesOptions) {
    VotesOptions["Yes"] = "yes";
    VotesOptions["No"] = "no";
})(VotesOptions || (VotesOptions = {}));
const votesCollection = new Map();
function canVote(delegateRole, member, voteMessage) {
    const votesData = votesCollection.get(voteMessage.id);
    return !(votesData?.votes.yes.members.concat(votesData?.votes.no.members).includes(member) || !member.roles.cache.has(delegateRole.id));
}
function votersResult(votesData, delRole) {
    const votedMembers = votesData.votes.yes.members.concat(votesData.votes.no.members);
    const noVote = delRole.members?.filter(m => m.roles.cache.size <= 2 && !votedMembers.includes(m));
    const votedYes = votesData.votes.yes.members.map(m => `\`${m.displayName}\``).join('\n');
    const votedNo = votesData.votes.no.members.map(m => `\`${m.displayName}\``).join('\n');
    const noVoteMembers = noVote.map(m => `\`${m.displayName}\``).join('\n');
    return new discord_js_1.MessageEmbed()
        .setColor('BLUE')
        .setTitle(`Voting result for ${votesData.motion}`)
        .addField('Voted Yes', votedYes ? votedYes : `\`None\``, true)
        .addField('Voted No', votedNo ? votedNo : `\`None\``, true)
        .addField('Didn\'t vote', noVoteMembers ? noVoteMembers : `\`None\``, true);
}
