import { Channel } from '@/Data';
import { client } from '@/config';
import { getVideoDuration } from '@/lib/getVideoDuration';
import { getVideoInfo } from '@/lib/getVideoInfo';
import { getYoutubeResource } from '@/lib/getYoutubeResource';
import { player } from '@/player';
import { joinVoiceChannel } from '@discordjs/voice';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

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
    const id = String(new Date().getTime() || link);

    if (!link) {
      console.log('Ошибка: Ссылка на видео не указана.');
      await interaction.reply('Ссылка на видео не указана.');
      return;  
    }

    if (!getYoutubeResource(link)) {
      interaction.reply('Указана невалидная ссылка.');
      return;
    }
    console.log('before guild');

    const guild = client.guilds.cache.get(interaction.guildId);
    const member = guild.members.cache.get(interaction.member.user?.id);
    const voiceChannel = member.voice.channel;

    console.log('after voiceChannel');

    if(!voiceChannel) {
      await interaction.reply('Необходимо находиться в голосовом канале');
      console.log('[WARNING]: Попытка вызова бота (/play) вне голосового канала.');
      return;
    }


    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    console.log('after connection');

    
    channelUsed.addToQueue({ id, url: link });

    console.log('after addToQueue');

    if (channelUsed.queue.length === 1 && !channelUsed.currentSong) {
      channelUsed.nextPlay();
      console.log('after nextPlay');

      const resource = getYoutubeResource(channelUsed.currentSong.url);
      const videoInfo = await getVideoInfo(channelUsed.currentSong.url);
      console.log('after videoInfo');

      await interaction.reply(`:microphone: Добавлено в очередь: ${videoInfo?.title || 'VIDEO_TITLE'} [${getVideoDuration(Number(videoInfo?.lengthSeconds || 0))}]`);
      console.log('after reply');

      player.play(resource);
    }
    
    connection.subscribe(player);

  }
};