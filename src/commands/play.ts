import { Channel } from '@/types/channel';
import { getVideoDuration } from '@/lib/getVideoDuration';
import { getVideoInfo } from '@/lib/getVideoInfo';
import { getYoutubeResource } from '@/lib/getYoutubeResource';
import { player } from '@/player';
import { joinVoiceChannel } from '@discordjs/voice';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getVoiceChat } from '@/lib/getVoiceChat';
import { client } from '@/client';
import ytdl from 'ytdl-core';

export const playCommand = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Воспроизвести музыку с ютуб.')
    .addStringOption(option =>
      option.setName('link')
        .setDescription('Ссылка на ютуб видео.')
        .setRequired(true)),
  execute: async function(interaction: CommandInteraction, channelUsed?: Channel): Promise<void> {
    const link = String(interaction.options?.get('link')?.value || '');
    const id = String(new Date().getTime() || link);

    if (!link) {
      await interaction.reply({ content: 'Ссылка на видео не указана.', ephemeral: true });
      console.log('[WARNING]: Ссылка на видео не указана.');
      return;  
    }

    if (!getYoutubeResource(link)) {
      interaction.reply({ content: 'Указана невалидная ссылка.', ephemeral: true });
      console.log('[WARNING]: Указана невалидная ссылка: ' + link);
      return;
    }

    const voiceChannel = getVoiceChat(client, interaction);
    if(!voiceChannel) {
      await interaction.reply({ content: 'Необходимо находиться в голосовом канале.', ephemeral: true });
      console.log('[WARNING]: Попытка вызова бота (/play) вне голосового канала.');
      return;
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    const videoInfo = await getVideoInfo(link);
    const authorInfo = videoInfo.author as ytdl.Author;
    
    channelUsed.addToQueue({ id, url: link, name: videoInfo.title, author: { name: authorInfo.name, url: authorInfo.channel_url, user: authorInfo.user || 'USER' } });
    await interaction.reply(`:musical_note: Добавлено в очередь: ${videoInfo.title} [${getVideoDuration(Number(videoInfo.lengthSeconds))}]`);

    if (channelUsed.queue.length === 1 && !channelUsed.currentSong) {
      channelUsed.nextPlay();

      const resource = getYoutubeResource(channelUsed.currentSong.url);
      player.play(resource);
    }
    
    connection.subscribe(player);

  }
};