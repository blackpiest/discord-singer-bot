import { Channel } from '@/Data';
import { client } from '@/config';
import { getYoutubeResource } from '@/lib/getYoutubeResource';
import { player } from '@/player';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getVoiceChat } from '@/lib/getVoiceChat';

export const skipCommand = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Включить следующий трек из очереди.'),
  execute: async function(interaction: CommandInteraction, channelUsed?: Channel): Promise<void> {
    const voiceChannel = getVoiceChat(client, interaction);
    if(!voiceChannel) {
      await interaction.reply('Необходимо находиться в голосовом канале.');
      console.log('[WARNING]: Попытка вызова бота (/skip) вне голосового канала.');
      return;
    }

    if (!channelUsed.currentSong && !channelUsed.queue.length) {
      await interaction.reply('Треков в очереди нет.');
      return;
    }

    player.stop();
    channelUsed.nextPlay();
    const resource = getYoutubeResource(channelUsed.queue[0]?.url);
    if (resource) {
      player.play(resource);
      await interaction.reply(':track_next: Останавливаю текущий трек и включаю следующий.');
      console.log('Включается следующий трек.');
    }
  }
};