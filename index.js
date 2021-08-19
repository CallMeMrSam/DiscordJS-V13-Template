require('dotenv').config();
const path = require('path');

const { Intents } = require('discord.js');

const Client = require('./src/structure/Client');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES] });

client.loadSlashCommands(path.resolve(__dirname, 'src', 'commands'), ['877500438595895326']);
client.loadEvents(path.resolve(__dirname, 'src', 'events'));

client.login(process.env.TOKEN);