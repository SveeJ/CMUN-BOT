"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var logger_1 = require("./logger");
var logger = new logger_1["default"]("Main");
var bot_1 = require("./managers/bot");
var discord_js_1 = require("discord.js");
var constants_1 = require("./constants");
!function () {
    return __awaiter(this, void 0, void 0, function () {
        function createEmbed(description, color, footerSuffix) {
            if (color === void 0) { color = "#228B22"; }
            if (footerSuffix === void 0) { footerSuffix = "25th Annual Session"; }
            var embed = new discord_js_1.MessageEmbed()
                .setAuthor('CMUN', constants_1.Constants.BRANDING_URL)
                .setColor(color)
                .setFooter("\u00A9 CMUN | " + footerSuffix, constants_1.Constants.BRANDING_URL);
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
                    .setLabel("Yes " + votes1)
                    .setStyle('SUCCESS')
                    .setDisabled(bool),
                new discord_js_1.MessageButton()
                    .setCustomId(VotesOptions.No)
                    .setLabel("No " + votes2)
                    .setStyle('DANGER')
                    .setDisabled(bool)]);
        }
        var client, admin;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([bot_1["default"]])["catch"](function (err) {
                        logger.error("Startup failed:\n" + err.stack);
                        return process.exit(1);
                    })];
                case 1:
                    client = (_a.sent())[0];
                    return [4 /*yield*/, client.guilds.fetch('874354069098094632')];
                case 2:
                    admin = _a.sent();
                    client.on('messageCreate', function (message) {
                        var _a, _b, _c, _d, _e;
                        return __awaiter(this, void 0, void 0, function () {
                            var guild, prefix, args, firstArg, logs, data_1, stringified_1, d, ids, mem, msg, category, poi_ch_1, archive, motion_1, voting_ch, delRole_1, time_1, count_1, voteMessage_1, interval, voteCollector, channel_1, opt_1, channel_2, opt_2;
                            var _this = this;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        if (message.author.bot || !message.guild || !message.member) {
                                            return [2 /*return*/];
                                        }
                                        ;
                                        guild = message.guild;
                                        prefix = '=';
                                        if (!prefix)
                                            return [2 /*return*/];
                                        args = message.content.slice(prefix.length).trim().split(/ +/g);
                                        firstArg = args.shift();
                                        if (!firstArg)
                                            return [2 /*return*/];
                                        if (!constants_1.Constants.VERIFICATION_CHANNELS.includes(message.channel.id)) return [3 /*break*/, 4];
                                        if (!constants_1.Constants.CODES.includes(message.content)) return [3 /*break*/, 3];
                                        logs = admin.channels.cache.get('874600703786614804');
                                        if (message.member.roles.cache.find(function (role) { return role.name === "Delegate"; })) {
                                            message.reply({ embeds: [createEmbed("Sorry, you are already registered.", constants_1.Constants.RED)] });
                                            return [2 /*return*/];
                                        }
                                        data_1 = [];
                                        return [4 /*yield*/, logs.messages.fetch()];
                                    case 1:
                                        (_f.sent()).forEach(function (value) {
                                            data_1.push(value.content);
                                        });
                                        stringified_1 = "";
                                        data_1.forEach(function (da) {
                                            stringified_1 += da.split(" ");
                                        });
                                        d = stringified_1.split(",");
                                        d = d.filter(function (da) { return da.length === 8 && /^\d+$/.test(da); });
                                        if (d.includes(message.content)) {
                                            report(message.author.id + " tried to input a code that was already used before. Code: " + message.content + " in " + guild.name);
                                            message.reply({ embeds: [createEmbed("This code has already been used. Please try again.", "RED")] });
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, message.member.roles.add(message.guild.roles.cache.find(function (r) { return r.name === "Delegate"; }))["catch"](function () {
                                                message.reply({ embeds: [createEmbed("Sorry I cannot locate the Delegate role. Please contact your nearest `CMUN IT` Representative for further assistance.", constants_1.Constants.RED)] });
                                                report("Delegate Role cannot be found in " + message.guild.name + ".");
                                                return;
                                            })];
                                    case 2:
                                        if (_f.sent()) {
                                            logs.send("Code: " + message.content + " User: " + message.author.id);
                                            message.channel.send({ embeds: [createEmbed("You have successfully registered!")] });
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        if (/^\d+$/.test(message.content)) {
                                            report(message.author.id + " tried to enter an incorrect code in " + message.guild.name + ".");
                                            message.reply("Sorry but that isn't a valid code. Please try again.");
                                            return [2 /*return*/];
                                        }
                                        else {
                                            report(message.author.id + " is spamming the verification channels in " + message.guild.name + ".");
                                        }
                                        _f.label = 4;
                                    case 4:
                                        if (!(message.content.startsWith('=POI') || message.content.startsWith('=poi'))) return [3 /*break*/, 7];
                                        ids = [message.author.id];
                                        mem = (_a = message.mentions.members) === null || _a === void 0 ? void 0 : _a.first();
                                        msg = "";
                                        if (mem) {
                                            msg = message.member.displayName + "'s POI to " + (mem === null || mem === void 0 ? void 0 : mem.displayName);
                                            ids.push(mem.id);
                                        }
                                        else {
                                            msg = message.member.displayName + "'s POI";
                                        }
                                        msg = msg.substring(0, 100);
                                        category = constants_1.Constants.POI_CATEGORIES[constants_1.Constants.GUILDS.indexOf(message.guild.id)];
                                        return [4 /*yield*/, guild.channels.create(msg, { type: 'GUILD_TEXT', parent: category, permissionOverwrites: [
                                                    {
                                                        id: guild.id,
                                                        deny: ['VIEW_CHANNEL']
                                                    }
                                                ] })];
                                    case 5:
                                        poi_ch_1 = _f.sent();
                                        ids.forEach(function (id) {
                                            poi_ch_1.permissionOverwrites.edit(id, { VIEW_CHANNEL: true, ATTACH_FILES: true, SEND_MESSAGES: true, ADD_REACTIONS: true });
                                        });
                                        return [4 /*yield*/, poi_ch_1.send({ embeds: [createEmbed("Archive POI by using `=archive`", constants_1.Constants.AQUA)] })];
                                    case 6:
                                        _f.sent();
                                        return [3 /*break*/, 11];
                                    case 7:
                                        if (!(message.content === "=archive" && constants_1.Constants.POI_CATEGORIES.includes(message.channel.parentId))) return [3 /*break*/, 9];
                                        archive = constants_1.Constants.ARCHIVE_CHANNELS[constants_1.Constants.GUILDS.indexOf(message.guild.id)];
                                        message.channel.setParent(archive);
                                        return [4 /*yield*/, message.channel.permissionOverwrites.create(guild.id, { VIEW_CHANNEL: false })];
                                    case 8:
                                        _f.sent();
                                        console.log(guild.id);
                                        message.channel.send({ embeds: [createEmbed("Archived.", "RED")] });
                                        return [3 /*break*/, 11];
                                    case 9:
                                        if (!(message.content.startsWith("=vote") && constants_1.Constants.EB_COMMAND_CHANNELS.includes(message.channel.id))) return [3 /*break*/, 11];
                                        motion_1 = args.join(' ');
                                        if (!motion_1) {
                                            message.reply({ embeds: [createEmbed("Please enter a name for the motion to be voted on.", "RED")] });
                                            return [2 /*return*/];
                                        }
                                        voting_ch = guild.channels.cache.get(constants_1.Constants.VOTING_CHANNELS[constants_1.Constants.GUILDS.indexOf(guild.id)]);
                                        delRole_1 = guild.roles.cache.find(function (r) { return r.name === "Delegate"; });
                                        if (!voting_ch || !delRole_1) {
                                            message.reply({ embeds: [createEmbed("Something went wrong when trying to create a vote. I cannot identify the voting channel or the Delegate Role. Please contact your nearest `CMUN IT` representative.", "RED")] });
                                            report("Delegate role or Voting Channel cannot be found in " + guild.name);
                                            return [2 /*return*/];
                                        }
                                        time_1 = 60;
                                        count_1 = 1;
                                        return [4 /*yield*/, voting_ch.send({ embeds: [createEmbed("Voting on motion `" + motion_1 + "`\n**In progress**\n\n**Timer**\nTime Left: " + time_1 + "s", 'BLUE')], components: [buttonsRow(false, 0, 0)] })];
                                    case 10:
                                        voteMessage_1 = _f.sent();
                                        interval = setInterval(function () {
                                            if (!voteMessage_1.deleted) {
                                                voteMessage_1.edit({ embeds: [createEmbed("Voting on motion `" + motion_1 + "`\n**In progress**\n\n**Timer**\nTime Left: " + (time_1 - 5 * count_1) + "s", 'BLUE')] });
                                            }
                                            count_1++;
                                        }, 5000);
                                        votesCollection.set(voteMessage_1.id, {
                                            votes: { yes: { members: [], count: 0 }, no: { members: [], count: 0 } },
                                            message: voteMessage_1,
                                            interval: interval,
                                            motion: motion_1
                                        });
                                        message.reply({ embeds: [createEmbed("Vote has been created successfully!")] });
                                        voteCollector = voteMessage_1.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });
                                        voteCollector.on('collect', function (i) {
                                            if (!i.isButton())
                                                return;
                                            var member = i.member;
                                            if (!(member instanceof discord_js_1.GuildMember))
                                                return;
                                            var votesData = votesCollection.get(voteMessage_1.id);
                                            if (!votesData)
                                                return;
                                            if (!canVote(delRole_1, member, voteMessage_1)) {
                                                i.reply({ embeds: [createEmbed("You cannot vote without the delegate role or you have already voted.", "RED")], ephemeral: true });
                                                return;
                                            }
                                            switch (i.customId) {
                                                case VotesOptions.Yes:
                                                    votesData.votes.yes.members.push(member);
                                                    votesData.votes.yes.count += 1;
                                                    voteMessage_1.edit({ components: [buttonsRow(false, votesData.votes.yes.count, votesData.votes.no.count)] });
                                                    break;
                                                case VotesOptions.No:
                                                    votesData.votes.no.members.push(member);
                                                    votesData.votes.no.count += 1;
                                                    voteMessage_1.edit({ components: [buttonsRow(false, votesData.votes.yes.count, votesData.votes.no.count)] });
                                                    break;
                                            }
                                            i.reply({ embeds: [createEmbed('Your vote has been registered!', 'GREEN')], ephemeral: true });
                                        });
                                        voteCollector.on('end', function (collected) { return __awaiter(_this, void 0, void 0, function () {
                                            var votes, percentage, logChannel;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        votes = votesCollection.get(voteMessage_1.id);
                                                        if (!votes)
                                                            return [2 /*return*/];
                                                        percentage = votes.votes.yes.count / (votes.votes.yes.count + votes.votes.no.count) * 100;
                                                        voteMessage_1.edit({ embeds: [createEmbed("**Concluded**\nPercentage of 'yes votes' is `" + percentage.toFixed(2) + "%`", 'BLUE')], components: [buttonsRow(true, votes.votes.yes.count, votes.votes.no.count)] });
                                                        clearInterval(votes.interval);
                                                        return [4 /*yield*/, guild.channels.fetch('874174044612747338')];
                                                    case 1:
                                                        logChannel = _a.sent();
                                                        if (logChannel === null || logChannel === void 0 ? void 0 : logChannel.isText()) {
                                                            logChannel.send({ embeds: [votersResult(votes, delRole_1)] });
                                                        }
                                                        votesCollection["delete"](voteMessage_1.id);
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        _f.label = 11;
                                    case 11:
                                        // VC + TC --> 
                                        if (message.content === "=TC") {
                                            guild.channels.create("" + message.member.displayName, { type: "GUILD_TEXT", parent: constants_1.Constants.LOBBY_CATEGORIES[constants_1.Constants.GUILDS.indexOf(guild.id)], permissionOverwrites: [{ id: guild.id, deny: ['VIEW_CHANNEL'] }, { id: message.author.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'ADD_REACTIONS'] }] });
                                        }
                                        else if (message.content === "=VC") {
                                            guild.channels.create("" + message.member.displayName, { type: "GUILD_VOICE", parent: constants_1.Constants.LOBBY_CATEGORIES[constants_1.Constants.GUILDS.indexOf(guild.id)], permissionOverwrites: [{ id: guild.id, deny: ['VIEW_CHANNEL'] }, { id: message.author.id, allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'STREAM'] }] });
                                        }
                                        if (message.content.toLowerCase().startsWith("=invitevc") || message.content.toLowerCase().startsWith("=removevc")) {
                                            channel_1 = guild.channels.cache.find(function (ch) { var _a; return ch.name === "" + ((_a = message.member) === null || _a === void 0 ? void 0 : _a.displayName) && ch.type === 'GUILD_VOICE'; });
                                            if (!channel_1) {
                                                message.reply({ embeds: [createEmbed("You don't have an active Voice Channel. Please create one with `=VC`.", "RED")] });
                                                return [2 /*return*/];
                                            }
                                            opt_1 = message.content.toLowerCase().startsWith("=invitevc") ? "invite" : "remove";
                                            if (!((_b = message.mentions.members) === null || _b === void 0 ? void 0 : _b.first())) {
                                                message.reply({ embeds: [createEmbed("You must mention someone to " + opt_1 + " them.", "RED")] });
                                                return [2 /*return*/];
                                            }
                                            (_c = message.mentions.members) === null || _c === void 0 ? void 0 : _c.forEach(function (mem) {
                                                if (opt_1 === "invite") {
                                                    channel_1.permissionOverwrites.edit(mem.id, { 'CONNECT': true, 'VIEW_CHANNEL': true, 'SPEAK': true, 'STREAM': true });
                                                    message.reply({ embeds: [createEmbed("User is now allowed to join your Voice Channel!")] });
                                                }
                                                else {
                                                    channel_1.permissionOverwrites["delete"](mem.id);
                                                    message.reply({ embeds: [createEmbed("User is now removed from your Voice Channel!", "RED")] });
                                                }
                                            });
                                        }
                                        else if (message.content.toLowerCase().startsWith("=invitetc") || message.content.toLowerCase().startsWith("=removetc")) {
                                            channel_2 = guild.channels.cache.find(function (ch) { var _a; return ch.name === ("" + ((_a = message.member) === null || _a === void 0 ? void 0 : _a.displayName)).toLowerCase() && ch.type === 'GUILD_TEXT'; });
                                            if (!channel_2) {
                                                message.reply({ embeds: [createEmbed("You don't have an active Text Channel. Please create one with `=TC`.", "RED")] });
                                                return [2 /*return*/];
                                            }
                                            opt_2 = message.content.toLowerCase().startsWith("=invitetc") ? "invite" : "remove";
                                            console.log(opt_2);
                                            if (!((_d = message.mentions.members) === null || _d === void 0 ? void 0 : _d.first())) {
                                                message.reply({ embeds: [createEmbed("You must mention someone to invite them.", "RED")] });
                                                return [2 /*return*/];
                                            }
                                            (_e = message.mentions.members) === null || _e === void 0 ? void 0 : _e.forEach(function (mem) {
                                                if (opt_2 === "invite") {
                                                    channel_2.permissionOverwrites.edit(mem.id, { 'SEND_MESSAGES': true, 'VIEW_CHANNEL': true, 'ATTACH_FILES': true, 'ADD_REACTIONS': true });
                                                    message.reply({ embeds: [createEmbed("User is now allowed to join your Text Channel!")] });
                                                }
                                                else {
                                                    channel_2.permissionOverwrites["delete"](mem.id);
                                                    message.reply({ embeds: [createEmbed("User is now removed from your Text Channel!", "RED")] });
                                                }
                                            });
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        });
                    });
                    logger.info("App is now online!");
                    return [2 /*return*/];
            }
        });
    });
}();
var VotesOptions;
(function (VotesOptions) {
    VotesOptions["Yes"] = "yes";
    VotesOptions["No"] = "no";
})(VotesOptions || (VotesOptions = {}));
var votesCollection = new Map();
function canVote(delegateRole, member, voteMessage) {
    var votesData = votesCollection.get(voteMessage.id);
    return !((votesData === null || votesData === void 0 ? void 0 : votesData.votes.yes.members.concat(votesData === null || votesData === void 0 ? void 0 : votesData.votes.no.members).includes(member)) || !member.roles.cache.has(delegateRole.id));
}
function votersResult(votesData, delRole) {
    var _a;
    var votedMembers = votesData.votes.yes.members.concat(votesData.votes.no.members);
    var noVote = (_a = delRole.members) === null || _a === void 0 ? void 0 : _a.filter(function (m) { return m.roles.cache.size <= 2 && !votedMembers.includes(m); });
    var votedYes = votesData.votes.yes.members.map(function (m) { return "`" + m.displayName + "`"; }).join('\n');
    var votedNo = votesData.votes.no.members.map(function (m) { return "`" + m.displayName + "`"; }).join('\n');
    var noVoteMembers = noVote.map(function (m) { return "`" + m.displayName + "`"; }).join('\n');
    return new discord_js_1.MessageEmbed()
        .setColor('BLUE')
        .setTitle("Voting result for " + votesData.motion)
        .addField('Voted Yes', votedYes ? votedYes : "`None`", true)
        .addField('Voted No', votedNo ? votedNo : "`None`", true)
        .addField('Didn\'t vote', noVoteMembers ? noVoteMembers : "`None`", true);
}
/*async function deleteCode(code: string) {
    let data = fs.readFileSync('codes.json');
    let json = JSON.parse(data.toString());
    console.log(json);
}*/
