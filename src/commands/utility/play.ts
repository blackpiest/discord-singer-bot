import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const playCommand = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Воспроизвести музыку'),
  execute: async function(interaction: CommandInteraction): Promise<void> {
    await interaction.reply('Pong!');
  }
};