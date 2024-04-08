import { client } from './config';
import { Channel } from './Data';
import { Collection, Events } from 'discord.js';
import { playCommand } from './commands/utility/play';
import { initPlayer } from './player';

const myChannel = new Channel('testId');

// deployCommands();
initPlayer(myChannel);

client.commands = new Collection();
client.commands.set(playCommand.data.name, playCommand);

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction, myChannel);
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