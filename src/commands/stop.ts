import { Channel } from '@/types/channel';
import { getVoiceChat } from '@/lib/getVoiceChat';
import { player } from '@/player';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { client } from '@/client';

export const stopCommand = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Остановить воспроизведение треков и очистить очередь.'),
  execute: async function(interaction: CommandInteraction, channelUsed?: Channel): Promise<void> {
    const voiceChannel = getVoiceChat(client, interaction);
    if(!voiceChannel) {
      await interaction.reply('Необходимо находиться в голосовом канале.');
      console.log('[WARNING]: Попытка вызова бота (/stop) вне голосового канала.');
      return;
    }

    player.stop();
    channelUsed.stop();
    await interaction.reply(':stop_button: Музыка отключена.');
    console.log('Музыка отключена.');
  }
};