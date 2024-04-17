import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getVoiceChat } from '@/core/lib';
import { client } from '@/client';
import { Bot } from '@/core/entities/Bot';

export const pauseCommand = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Поставить/снять паузу.'),
  execute: async function(interaction: CommandInteraction, currentBot?: Bot): Promise<void> {
    const voiceChannel = getVoiceChat(client, interaction);
    if(!voiceChannel) {
      await interaction.reply({ content: 'Необходимо находиться в голосовом канале.', ephemeral: true });
      console.log('[WARNING]: Попытка вызова бота (/pause) вне голосового канала.');
      return;
    }

    if (!currentBot.currentSong) {
      await interaction.reply('Треков в очереди нет.');
      return;
    }

    if (currentBot.pauseEnabled) {
      currentBot.player.unpause();
      currentBot.pause(false);
    } else {
      currentBot.player.pause();
      currentBot.pause(true);
    }
    await interaction.reply(currentBot.pauseEnabled ? ':pause_button: Проигрывание остановлено.' : ':arrow_forward: Проигрывание возобновлено.');
    console.log(currentBot.pauseEnabled ? 'Проигрывание остановлено.' : 'Проигрывание возобновлено.');
  }
};