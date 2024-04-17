import { getVoiceChat } from '@/core/lib';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { client } from '@/client';
import { Bot } from '@/core/entities/Bot';

export const stopCommand = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Остановить воспроизведение треков и очистить очередь.'),
  execute: async function(interaction: CommandInteraction, currentBot?: Bot): Promise<void> {
    const voiceChannel = getVoiceChat(client, interaction);
    if(!voiceChannel) {
      await interaction.reply({ content: 'Необходимо находиться в голосовом канале.', ephemeral: true });
      console.log('[WARNING]: Попытка вызова бота (/stop) вне голосового канала.');
      return;
    }

    if (!currentBot.currentSong && !currentBot.hasMore) {
      await interaction.reply({ content: 'Треков в очереди нет.', ephemeral: true });
      return;
    }

    currentBot.player.stop();
    currentBot.stop();
    await interaction.reply(':stop_button: Музыка отключена.');
    console.log('Музыка отключена.');
  }
};