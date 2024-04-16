import { getYoutubeResource, getVoiceChat } from '@/core/lib';
import { player } from '@/player';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { client } from '@/client';
import { Channel } from '@/core/entities/Channel';

export const skipCommand = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Включить следующий трек из очереди.'),
  execute: async function(interaction: CommandInteraction, channelUsed?: Channel): Promise<void> {
    const voiceChannel = getVoiceChat(client, interaction);
    if(!voiceChannel) {
      await interaction.reply({ content: 'Необходимо находиться в голосовом канале.', ephemeral: true });
      console.log('[WARNING]: Попытка вызова бота (/skip) вне голосового канала.');
      return;
    }

    if (!channelUsed.currentSong && !channelUsed.queue.length) {
      await interaction.reply({ content: 'Треков в очереди нет.', ephemeral: true });
      return;
    }

    player.stop();
    channelUsed.nextPlay();
    console.log('[DISCORD-SINGER-BOT]: Пропуск трека.');
    const resource = getYoutubeResource(channelUsed.currentSong?.url);
    if (resource) {
      player.play(resource);
      await interaction.reply(`:track_next: Останавливаю текущий трек. Включаю ${channelUsed.currentSong.name}`);
      console.log('Включается следующий трек.');
    } else {
      await interaction.reply(':track_next: Останавливаю текущий трек. В очереди больше нет треков.');
    }
  }
};