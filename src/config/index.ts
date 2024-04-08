import 'dotenv/config';
import { Client, GatewayIntentBits  } from 'discord.js';
export const TOKEN = process.env.BOT_TOKEN || 'WHERE_MY_TOKEN_?';
export const CLIENT_ID = process.env.CLIENT_ID || 'WHERE_MY_CLIENT_ID_?';

export const client = new Client({ intents: [ 
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.MessageContent, 
  GatewayIntentBits.DirectMessages, 
  GatewayIntentBits.GuildVoiceStates,
] });
client.login(TOKEN);