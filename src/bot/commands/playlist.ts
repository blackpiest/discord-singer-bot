import { getYoutubeResource, getVoiceChat, getPlaylistInfo } from '@/core/lib';
import { joinVoiceChannel } from '@discordjs/voice';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { client } from '@/client';
import { Bot } from '@/core/entities/Bot';

export const playlistCommand = {
  data: new SlashCommandBuilder()
    .setName('playlist')
    .setDescription('Воспроизвести плейлист с ютуб.')
    .addStringOption(option =>
      option.setName('link')
        .setDescription('Ссылка на ютуб-плейлист.')
        .setRequired(true)),
  execute: async function(interaction: CommandInteraction, currentBot?: Bot): Promise<void> {
    const link = String(interaction.options?.get('link')?.value || '');

    if (!link) {
      await interaction.reply({ content: 'Ссылка на плейлист не указана.', ephemeral: true });
      console.log('[WARNING]: Ссылка на плейлист не указана.');
      return;  
    }

    const voiceChannel = getVoiceChat(client, interaction);
    if(!voiceChannel) {
      await interaction.reply({ content: 'Необходимо находиться в голосовом канале.', ephemeral: true });
      console.log('[WARNING]: Попытка вызова бота (/playlist) вне голосового канала.');
      return;
    }

    const playlistInfo = await getPlaylistInfo(link);

    if (!playlistInfo) {
      await interaction.reply({ content: 'Указана невалидная ссылка.', ephemeral: true });
      console.log('[WARNING]: Указана невалидная ссылка: ' + link);
      return;
    }

    playlistInfo.forEach(item => {
      currentBot.addToQueue({ id: item.id, url: item.url, author: { name: item.author.name, url: item.author.url, user: item.author.channelID }, name: item.title });
    });
    currentBot.nextPlay();

    const resource = getYoutubeResource(currentBot.currentSong.url);
    currentBot.player.play(resource);
    await interaction.reply(':musical_note: Плейлист добавлен в очередь');

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    
    connection.subscribe(currentBot.player);
  }
};