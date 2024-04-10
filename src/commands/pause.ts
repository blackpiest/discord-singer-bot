import { Channel } from '@/types/channel';
import { player } from '@/player';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getVoiceChat } from '@/lib/getVoiceChat';
import { client } from '@/client';

export const pauseCommand = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Поставить/снять паузу.'),
  execute: async function(interaction: CommandInteraction, channelUsed?: Channel): Promise<void> {
    const voiceChannel = getVoiceChat(client, interaction);
    if(!voiceChannel) {
      await interaction.reply('Необходимо находиться в голосовом канале.');
      console.log('[WARNING]: Попытка вызова бота (/pause) вне голосового канала.');
      return;
    }

    if (!channelUsed.currentSong) {
      await interaction.reply('Треков в очереди нет.');
      return;
    }

    if (channelUsed.pauseEnabled) {
      player.unpause();
      channelUsed.pause(false);
    } else {
      player.pause();
      channelUsed.pause(true);
    }
    await interaction.reply(channelUsed.pauseEnabled ? ':pause_button: Проигрывание остановлено.' : ':arrow_forward: Проигрывание возобновлено.');
    console.log(channelUsed.pauseEnabled ? 'Проигрывание остановлено.' : 'Проигрывание возобновлено.');
  }
};