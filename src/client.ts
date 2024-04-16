import { Client, Collection, Events, GatewayIntentBits  } from 'discord.js';
import { TOKEN } from '@/core/config';
import { commands } from './bot/commands';
import { Channel } from './core/entities/Channel';
import { player } from './player';

export const client = new Client({ intents: [ 
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.MessageContent, 
  GatewayIntentBits.DirectMessages, 
  GatewayIntentBits.GuildVoiceStates,
] });
client.login(TOKEN);

export function initClient(channel: Channel) {
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
  
    try {
      await command.execute(interaction, channel);
    } catch (error) {
      console.error('[DISCORD-SINGER-BOT]: Произошла ошибка. ' + error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'При выполнении этой команды произошла ошибка!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'При выполнении этой команды произошла ошибка!', ephemeral: true });
      }
    }
  });

  client.on(Events.VoiceStateUpdate, (oldState, newState) => {
    const voiceChannel = newState.channel;
    if (!voiceChannel) {
      channel.stop();
      player.stop();
    }
  });
  
  client.on(Events.ClientReady, () => {
    console.log(`[DISCORD-SINGER-BOT]: Бот ${client.user.tag} запущен!`);
  });
}
