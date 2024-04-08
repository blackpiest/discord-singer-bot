import { client } from './config';
import { Channel } from './Data';
import { Collection, Events } from 'discord.js';
import { initPlayer } from './player';
import { commands } from './commands/utility';

const myChannel = new Channel('testId');
initPlayer(myChannel);

client.commands = new Collection();

for (let i=0; i< commands.length; i++) {
  client.commands.set(commands[i].data.name, commands[i]);
}

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