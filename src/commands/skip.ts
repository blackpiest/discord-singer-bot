import { Channel } from '@/types/channel';
import { getYoutubeResource } from '@/lib/getYoutubeResource';
import { player } from '@/player';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getVoiceChat } from '@/lib/getVoiceChat';
import { client } from '@/client';

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
    console.log('[DISCORD-SINGER-BOT]: Пропуск трека.');
    const resource = getYoutubeResource(channelUsed.currentSong?.url);
    if (resource) {
      player.play(resource);
      await interaction.reply(':track_next: Останавливаю текущий трек и включаю следующий.');
      console.log('Включается следующий трек.');
    } else {
      await interaction.reply(':track_next: Останавливаю текущий трек. В очереди больше нет треков.');
    }
  }
};