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
        if (constants_1.Constants.VERIFICATION_CHANNELS.includes(message.channel.id)) {
            if (constants_1.Constants.CODES.includes(message.content)) {
                const logs = admin.channels.cache.get('874600703786614804');
                if (message.member.roles.cache.find(role => role.name === "Delegate")) {
                    message.reply({ embeds: [createEmbed(`Sorry, you are already registered.`, constants_1.Constants.RED)] });
                    return;
                }
                const data = [];
                (await logs.messages.fetch()).forEach((value) => {
                    data.push(value.content);
                });
                let stringified = "";
                data.forEach(da => {
                    stringified += da.split(" ");
                });
                let d = stringified.split(",");
                d = d.filter(da => da.length === 8 && /^\d+$/.test(da));
                if (d.includes(message.content)) {
                    report(`${message.author.id} tried to input a code that was already used before. Code: ${message.content} in ${guild.name}`);
                    message.reply({ embeds: [createEmbed("This code has already been used. Please try again.", "RED")] });
                    return;
                }
                if (await message.member.roles.add(message.guild.roles.cache.find(r => r.name === "Delegate")).catch(() => {
                    message.reply({ embeds: [createEmbed("Sorry I cannot locate the Delegate role. Please contact your nearest `CMUN IT` Representative for further assistance.", constants_1.Constants.RED)] });
                    report(`Delegate Role cannot be found in ${message.guild.name}.`);
                    return;
                })) {
                    logs.send(`Code: ${message.content} User: ${message.author.id} Server: ${guild.name}`);
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
        if (message.content.toLowerCase().startsWith('=chit')) {
            const ids = [message.author.id];
            const mem = message.mentions.members?.first();
            let msg = "";
            if (mem) {
                msg = `${message.member.displayName}'s chit to ${mem?.displayName}`;
                ids.push(mem.id);
            }
            else {
                msg = `${message.member.displayName}'s chit`;
            }
            msg = msg.substring(0, 100);
            const category = await getCategory('chits', guild);
            if (!category) {
                message.reply({ embeds: [createEmbed("We encountered an issue. Please contact your nearest `CMUN IT Representative` for further assistance.", "RED")] });
                return;
            }
            const poi_ch = await guild.channels.create(msg, { type: 'GUILD_TEXT', parent: category, permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: ['VIEW_CHANNEL']
                    }
                ] });
            ids.forEach(id => {
                poi_ch.permissionOverwrites.edit(id, { VIEW_CHANNEL: true, ATTACH_FILES: true, SEND_MESSAGES: true, ADD_REACTIONS: true });
            });
            await poi_ch.send({ embeds: [createEmbed("Archive chit by using `=archive`", constants_1.Constants.AQUA)] });
        }
        else if (message.content === "=archive" && message.member.permissions.has('ADMINISTRATOR') && message.channel.type === 'GUILD_TEXT') {
            if (!(message.channel.parent?.name.toLowerCase() === 'chits')) {
                return;
            }
            const archive = guild.channels.cache.find(ch => ch.name.toLowerCase() === 'archives');
            if (!archive || archive.type != 'GUILD_TEXT') {
                message.reply({ embeds: [createEmbed("We encountered an issue. Please contact your nearest `CMUN IT Representative` for further assistance.", "RED")] });
                return;
            }
            const msgs = (await message.channel.messages.fetch()).map(m => m.content).reverse().join('\n\n');
            archive.send({ embeds: [createEmbed(`Archive for: \`${message.channel.name}\``, "AQUA")], files: [{ name: "archive.txt", attachment: Buffer.from(msgs, 'utf-8') }] });
            await message.channel.delete();
        }
        else if (message.content.startsWith("=vote") && message.channel.isText()) {
            if (!(message.channel.name === 'eb-commands' && message.member.permissions.has('ADMINISTRATOR'))) {
                message.reply({ embeds: [createEmbed("You cannot create a vote.", "RED")] });
                return;
            }
            const last_arg = args[args.length - 1];
            if (!last_arg)
                return;
            if (last_arg[0] != '(' || last_arg[last_arg.length - 1] != ')') {
                message.reply({ embeds: [createEmbed(`Use \`=vote [Name] [(time)]\` to specify time. \n\n \`Example: =vote Test Motion (30)\``, "RED")] });
                return;
            }
            const motion = args.slice(0, -1).join(' ');
            if (!motion) {
                message.reply({ embeds: [createEmbed("Please enter a name for the motion to be voted on.", "RED")] });
                return;
            }
            const time = args[args.length - 1].substring(1, args[args.length - 1].length - 1);
            if (!(/^\d+$/.test(time))) {
                message.reply({ embeds: [createEmbed(`Time specified must be a valid number.`, "RED")] });
                return;
            }
            const voting_ch = guild.channels.cache.find(ch => ch.name === 'voting');
            const delRole = guild.roles.cache.find(r => r.name === "Delegate");
            if (!voting_ch || !delRole) {
                message.reply({ embeds: [createEmbed("Something went wrong when trying to create a vote. I cannot identify the voting channel or the Delegate Role. Please contact your nearest `CMUN IT` representative.", "RED")] });
                report(`Delegate role or Voting Channel cannot be found in ${guild.name}`);
                return;
            }
            let count = 1;
            const voteMessage = await voting_ch.send({ embeds: [createEmbed(`Voting on motion \`${motion}\`\n**In progress**\n\n**Timer**\nTime Left: ${time}s`, 'BLUE')], components: [buttonsRow(false, 0, 0)] });
            const interval = setInterval(() => {
                if (!voteMessage.deleted) {
                    voteMessage.edit({ embeds: [createEmbed(`Voting on motion \`${motion}\`\n**In progress**\n\n**Timer**\nTime Left: ${parseInt(time) - 5 * count}s`, 'BLUE')] });
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
            const voteCollector = voteMessage.createMessageComponentCollector({ componentType: 'BUTTON', time: parseInt(time) * 1000 });
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
                voteMessage.edit({ embeds: [createEmbed(`${motion}\n\n**Concluded**\nPercentage of 'yes votes' is \`${percentage.toFixed(2)}%\``, 'BLUE')], components: [buttonsRow(true, votes.votes.yes.count, votes.votes.no.count)] });
                clearInterval(votes.interval);
                const logChannel = guild.channels.cache.find(ch => ch.name === 'voting-logs');
                if (logChannel?.isText()) {
                    logChannel.send({ embeds: [votersResult(votes, delRole)] });
                }
                else {
                    report(`Can't find voting-logs channel in ${guild.name}`);
                }
                votesCollection.delete(voteMessage.id);
            });
        }
        if (message.content.startsWith("=")) {
            const msgs = (await admin.channels.cache.get(constants_1.Constants.CHANNEL_LOG).messages.fetch().catch(() => undefined));
            const userMsg = [];
            if (!msgs)
                return;
            msgs.forEach(msg => {
                if (msg.content.split(" ").includes(message.author.id)) {
                    userMsg.push(msg.content);
                }
            });
            if (message.content.toLowerCase() === "=tc") {
                if (userMsg.find(msg => msg.includes('TEXT'))) {
                    message.reply({ embeds: [createEmbed("Sorry you already have an active `Text Channel`.", "RED")] });
                    return;
                }
                ;
                const cat = await getCategory('lobby', guild);
                if (!cat) {
                    message.reply({ embeds: [createEmbed("We encountered an issue. Please contact your nearest `CMUN IT Representative` for further assistance.", "RED")] });
                    return;
                }
                const channel = await guild.channels.create(`${message.member.displayName}`, { type: "GUILD_TEXT", parent: cat, permissionOverwrites: [{ id: guild.id, deny: ['VIEW_CHANNEL'] }, { id: message.author.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'ADD_REACTIONS'] }] });
                const ch = admin.channels.cache.get(constants_1.Constants.CHANNEL_LOG);
                ch.send(`Channel: ${channel.id} User: ${message.author.id} Type: TEXT Member: ${message.member.displayName}`).catch(() => null);
            }
            else if (message.content.toLowerCase() === "=vc") {
                if (userMsg.find(msg => msg.includes('VOICE'))) {
                    message.reply({ embeds: [createEmbed("Sorry you already have an active `Voice Channel`.", "RED")] });
                    return;
                }
                ;
                const cat = await getCategory('lobby', guild);
                if (!cat) {
                    message.reply({ embeds: [createEmbed("We encountered an issue. Please contact your nearest `CMUN IT Representative` for further assistance.", "RED")] });
                    return;
                }
                if (guild.channels.cache.find(ch => ch.name === message.member?.displayName && ch.type === 'GUILD_VOICE')) {
                    message.reply({ embeds: [createEmbed("Sorry but you have already created a voice channel.", "RED")] });
                    return;
                }
                const channel = await guild.channels.create(`${message.member.displayName}`, { type: "GUILD_VOICE", parent: cat, permissionOverwrites: [{ id: guild.id, deny: ['VIEW_CHANNEL'] }, { id: message.author.id, allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM'] }] });
                const ch = admin.channels.cache.get(constants_1.Constants.CHANNEL_LOG);
                ch.send(`Channel: ${channel.id} User: ${message.author.id} Type: VOICE`).catch(() => null);
            }
            if (message.content.toLowerCase().startsWith("=invitevc") || message.content.toLowerCase().startsWith("=removevc")) {
                const vcMsg = userMsg.find(msg => msg.includes('VOICE'));
                const chID = vcMsg?.split(" ")[1];
                if (!chID) {
                    message.reply({ embeds: [createEmbed("You don't have an active Voice Channel. Please create one with `=VC`.", "RED")] });
                    return;
                }
                const channel = guild.channels.cache.get(chID);
                if (!channel) {
                    message.reply({ embeds: [createEmbed("We could not find your channel. Please contact your nearest `CMUN IT Representative` for further assistance.", "RED")] });
                    return;
                }
                const opt = message.content.toLowerCase().startsWith("=invitevc") ? "invite" : "remove";
                if (!message.mentions.members?.first()) {
                    message.reply({ embeds: [createEmbed(`You must mention someone to ${opt} them.`, "RED")] });
                    return;
                }
                message.mentions.members?.forEach((mem) => {
                    if (opt === "invite") {
                        channel.permissionOverwrites.edit(mem.id, { 'CONNECT': true, 'VIEW_CHANNEL': true, 'SPEAK': true, 'STREAM': true });
                        message.reply({ embeds: [createEmbed("User is now allowed to join your Voice Channel!")] });
                    }
                    else {
                        channel.permissionOverwrites.delete(mem.id);
                        message.reply({ embeds: [createEmbed("User is now removed from your Voice Channel!", "RED")] });
                    }
                });
            }
            else if (message.content.toLowerCase().startsWith("=invitetc") || message.content.toLowerCase().startsWith("=removetc")) {
                const tcMsg = userMsg.find(msg => msg.includes('TEXT'));
                const chID = tcMsg?.split(" ")[1];
                if (!chID) {
                    message.reply({ embeds: [createEmbed("You don't have an active Text Channel. Please create one with `=TC`.", "RED")] });
                    return;
                }
                const channel = guild.channels.cache.get(chID);
                if (!channel) {
                    message.reply({ embeds: [createEmbed("We could not find your channel. Please contact your nearest `CMUN IT Representative` for further assistance.", "RED")] });
                    return;
                }
                const opt = message.content.toLowerCase().startsWith("=invitetc") ? "invite" : "remove";
                if (!message.mentions.members?.first()) {
                    message.reply({ embeds: [createEmbed("You must mention someone to invite them.", "RED")] });
                    return;
                }
                message.mentions.members?.forEach((mem) => {
                    if (opt === "invite") {
                        channel.permissionOverwrites.edit(mem.id, { 'SEND_MESSAGES': true, 'VIEW_CHANNEL': true, 'ATTACH_FILES': true, 'ADD_REACTIONS': true });
                        message.reply({ embeds: [createEmbed("User is now allowed to join your Text Channel!")] });
                    }
                    else {
                        channel.permissionOverwrites.delete(mem.id);
                        message.reply({ embeds: [createEmbed("User is now removed from your Text Channel!", "RED")] });
                    }
                });
            }
            else if (message.content.toLowerCase().startsWith("=rename")) {
                const opt = message.content.toLowerCase().startsWith("=renametc") ? "TEXT" : message.content.toLowerCase().startsWith("=renamevc") ? "VOICE" : undefined;
                if (!opt) {
                    message.reply({ embeds: [createEmbed("Please use `=renametc [name]` or `=renamevc [name]` to rename your personal channels.", "RED")] });
                    return;
                }
                const chID = userMsg.find(msg => msg.includes(opt));
                if (!chID) {
                    message.reply({ embeds: [createEmbed(`You do not have a personal \`${opt}\` channel to rename. Use \`=TC\` or \`=VC\` to create your own.`, "RED")] });
                    return;
                }
                const channel = guild.channels.cache.get(chID.split(" ")[1]);
                if (!channel) {
                    message.reply({ embeds: [createEmbed("We could not find your channel. Please contact your nearest `CMUN IT Representative` for further assistance.", "RED")] });
                    return;
                }
                const name = message.content.split(" ").slice(1).join(" ").substring(0, 100);
                if (constants_1.Constants.BANNED_NAMES.includes(name)) {
                    message.reply({ embeds: [createEmbed("You cannot rename your channel to that name. Please use another name.", "RED")] });
                    return;
                }
                channel.setName(name).catch(() => null);
                message.reply({ embeds: [createEmbed("Channel successfully renamed!", "GREEN")] });
            }
        }
    });
    client.on('channelDelete', async (ch) => {
        const admin_ch = admin.channels.cache.get(constants_1.Constants.CHANNEL_LOG);
        const msgs = (await (admin_ch).messages.fetch().catch(() => undefined));
        const userMsg = [];
        if (!msgs)
            return;
        const msg = msgs.find(m => m.content.split(" ").includes(ch.id));
        if (!msg)
            return;
        admin_ch.messages.delete(msg);
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
async function getCategory(cat, guild) {
    const cats = [];
    guild.channels.cache.forEach(c => {
        if (c.name.toLowerCase() === cat && c.type === 'GUILD_CATEGORY') {
            cats.push(c);
        }
    });
    if (cats.length === 0)
        return undefined;
    const returnable = cats.find(c => c.children.size <= 30);
    if (returnable)
        return returnable;
    return await cats[0].clone();
}
