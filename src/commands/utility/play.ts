import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Channel } from '../../Data';

export const playCommand = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Воспроизвести музыку с ютуб')
    .addStringOption(option =>
      option.setName('link')
        .setDescription('Ссылка на ютуб видео')
        .setRequired(true)),
  execute: async function(interaction: CommandInteraction, channelUsed?: Channel): Promise<void> {
    const link = String(interaction.options?.get('link')?.value || '');
    const id = new Date().getTime();

    if (!link) {
      console.log('Ошибка: Ссылка на видео не указана.');
      await interaction.reply('Ссылка на видео не указана.');
      return;  
    }
    channelUsed.addToQueue({ id: `${id}`, url: link });
    await interaction.reply('Добавлено в очередь: ' + link);
  }
};