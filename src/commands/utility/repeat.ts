import { Channel } from '@/Data';
import { client } from '@/config';
import { getVoiceChat } from '@/lib/getVoiceChat';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const repeatCommand = {
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Включить повторное проигрывание треков.'),
  execute: async function(interaction: CommandInteraction, channelUsed?: Channel): Promise<void> {
    const voiceChannel = getVoiceChat(client, interaction);
    if(!voiceChannel) {
      await interaction.reply('Необходимо находиться в голосовом канале.');
      console.log('[WARNING]: Попытка вызова бота (/stop) вне голосового канала.');
      return;
    }

    if (channelUsed.repeatEnabled) {
      channelUsed.repeatEnabled = false;
      interaction.reply(':x::repeat: Повтор треков отключён.');
      console.log('Повтор отключён!');
    } else {
      channelUsed.repeatEnabled = true;
      interaction.reply(':white_check_mark::repeat: Повтор треков включён.');
      console.log('Повтор включён!');
    }

  }
};