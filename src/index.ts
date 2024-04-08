import { createAudioPlayer, AudioPlayerStatus } from '@discordjs/voice';
import { client } from './config';
import { getYoutubeResource } from './lib/getYoutubeResource';
import { Channel } from './Data';
import { Collection, Events } from 'discord.js';
import { playCommand } from './commands/utility/play';
import { deployCommands } from './deployCommands';

const player = createAudioPlayer();
const myChannel = new Channel('testId');

deployCommands();

/**
 * TODO: Добавить возможность воспроизводить плейлисты.
 * TODO: Добавить поддержку нескольких каналов.
*/

client.commands = new Collection();
client.commands.set(playCommand.data.name, playCommand);

player.on('error', error => {
  console.error('Error:', error.message, 'with track', error.resource.metadata);
});

player.on('stateChange', (oldState, newState) => {
  if (newState.status === AudioPlayerStatus.Idle) {
    console.log('Проигрывание ресурса закончено');
    myChannel.nextPlay();
    
    if (myChannel.currentSong) {
      const resource = getYoutubeResource(myChannel.currentSong.url);
      console.log('Началось проигрывание: ', myChannel.currentSong);
      player.play(resource);
    }
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

client.on('ready', () => {
  console.log(`Бот ${client.user.tag} запущен!`);
});