import 'dotenv/config';
import { Client, GatewayIntentBits  } from 'discord.js';
const TOKEN = process.env.BOT_TOKEN || 'WHERE_MY_TOKEN_?';

export const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildVoiceStates, ] });
client.login(TOKEN);