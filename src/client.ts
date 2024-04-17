import { Client, Collection, Events, GatewayIntentBits  } from 'discord.js';
import { TOKEN } from './core/config';
import { commands } from './bot/commands';
import { Bot } from './core/entities/Bot';
import { db } from './core/services/db';
import { getVoiceChat } from './core/lib';

export const client = new Client({ intents: [ 
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.MessageContent, 
  GatewayIntentBits.DirectMessages, 
  GatewayIntentBits.GuildVoiceStates,
] });

export function initClient() {
  client.login(TOKEN);
  client.commands = new Collection();

  for (let i=0; i< commands.length; i++) {
    client.commands.set(commands[i].data.name, commands[i]);
  }

  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    const command = interaction.client.commands.get(interaction.commandName);
  
    if (!command) {
      console.error(`[DISCORD-SINGER-BOT]: Команда "${interaction.commandName}" не была найдена.`);
      return;
    }
    const currentVoiceChat = getVoiceChat(client, interaction);
    const channelId = currentVoiceChat.id;
    const hasChannel = Boolean(db[channelId]);
    if (!hasChannel) {
      db[channelId] = new Bot(channelId);
    }
    
    try {
      await command.execute(interaction, db[channelId]);
    } catch (error) {
      console.error('[DISCORD-SINGER-BOT]: Произошла ошибка. ' + error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'При выполнении этой команды произошла ошибка!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'При выполнении этой команды произошла ошибка!', ephemeral: true });
      }
    }
  });
  
  client.on(Events.ClientReady, () => {
    console.log(`[DISCORD-SINGER-BOT]: Бот ${client.user.tag} запущен!`);
  });
}

