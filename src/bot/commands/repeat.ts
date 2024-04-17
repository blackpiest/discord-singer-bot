import { getVoiceChat } from '@/core/lib';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { client } from '@/client';
import { Bot } from '@/core/entities/Bot';

export const repeatCommand = {
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Включить повторное проигрывание треков.'),
  execute: async function(interaction: CommandInteraction, currentBot?: Bot): Promise<void> {
    const voiceChannel = getVoiceChat(client, interaction);
    if(!voiceChannel) {
      await interaction.reply({ content: 'Необходимо находиться в голосовом канале.', ephemeral: true });
      console.log('[WARNING]: Попытка вызова бота (/stop) вне голосового канала.');
      return;
    }

    if (currentBot.repeatEnabled) {
      currentBot.repeatEnabled = false;
      interaction.reply(':x::repeat: Повтор треков отключён.');
      console.log('Повтор отключён!');
    } else {
      currentBot.repeatEnabled = true;
      interaction.reply(':white_check_mark::repeat: Повтор треков включён.');
      console.log('Повтор включён!');
    }

  }
};