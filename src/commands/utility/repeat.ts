import { Channel } from '@/Data';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const repeatCommand = {
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Включить повторное проигрывание треков'),
  execute: async function(interaction: CommandInteraction, channelUsed?: Channel): Promise<void> {
    if (channelUsed.repeatEnabled) {
      channelUsed.repeatEnabled = false;
      interaction.reply(':x::repeat: Повтор треков отключен.');
      console.log('Повтор отключен!');
    } else {
      channelUsed.repeatEnabled = true;
      interaction.reply(':white_check_mark::repeat: Повтор треков включен.');
      console.log('На повторе!');
    }

  }
};