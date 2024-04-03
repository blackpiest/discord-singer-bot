import { joinVoiceChannel, createAudioPlayer } from '@discordjs/voice';
import { client } from './config';
import { getYoutubeResource } from './lib/getYoutubeResource';

const player = createAudioPlayer();

client.on('messageCreate', function(message) {
  if (message.content.startsWith('!play')) {
    const url = message.content.split(' ')[1];
    const resource = getYoutubeResource(url);
    if (!resource) {
      message.reply('Ошибка воспроизведения!');
      return;
    }
    const channel = message.member.voice.channel;
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
    player.on('error', error => {
      console.error('Error:', error.message, 'with track', error.resource.metadata);
    });
    player.play(resource);
    connection.subscribe(player);
  }
  if (message.content.startsWith('!stop')) {
    player.stop();
  }
  if (message.content.startsWith('!pause')) {
    player.pause();
  }
  if (message.content.startsWith('!unpause')) {
    player.unpause();
  }
});

client.on('ready', () => {
  console.log(`Бот ${client.user.tag} запущен!`);
});