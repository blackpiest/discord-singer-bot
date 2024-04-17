import { getYoutubeResource, getVoiceChat } from '@/core/lib';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { client } from '@/client';
import { Bot } from '@/core/entities/Bot';

export const skipCommand = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Включить следующий трек из очереди.'),
  execute: async function(interaction: CommandInteraction, currentBot?: Bot): Promise<void> {
    const voiceChannel = getVoiceChat(client, interaction);
    if(!voiceChannel) {
      await interaction.reply({ content: 'Необходимо находиться в голосовом канале.', ephemeral: true });
      console.log('[WARNING]: Попытка вызова бота (/skip) вне голосового канала.');
      return;
    }

    if (!currentBot.currentSong && !currentBot.queue.length) {
      await interaction.reply({ content: 'Треков в очереди нет.', ephemeral: true });
      return;
    }

    currentBot.player.stop();
    currentBot.nextPlay();
    console.log('[DISCORD-SINGER-BOT]: Пропуск трека.');
    const resource = getYoutubeResource(currentBot.currentSong?.url);
    if (resource) {
      currentBot.player.play(resource);
      await interaction.reply(`:track_next: Останавливаю текущий трек. Включаю ${currentBot.currentSong.name}`);
      console.log('Включается следующий трек.');
    } else {
      await interaction.reply(':track_next: Останавливаю текущий трек. В очереди больше нет треков.');
    }
  }
};