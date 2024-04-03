import { joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } from '@discordjs/voice';
import { client } from './config';
import { getYoutubeResource } from './lib/getYoutubeResource';
import { Channel } from './Data';

const player = createAudioPlayer();
const myChannel = new Channel('testId');

/**
 * TODO: Добавить возможность воспроизводить плейлисты.
 * TODO: Добавить поддержку нескольких каналов.
*/

player.on('error', error => {
  console.error('Error:', error.message, 'with track', error.resource.metadata);
});

player.on('stateChange', (oldState, newState) => {
  if (newState.status === AudioPlayerStatus.Idle) {
    console.log('Проигрывание ресурса закончено');
    myChannel.nextPlay();
    
    if (myChannel.currentSong) {
      const resource = getYoutubeResource(myChannel.currentSong.url);
      console.log('Началось проигрывание: ', myChannel.currentSong);
      player.play(resource);
    }
  }
});

client.on('messageCreate', function(message) {
  if (message.content.startsWith('!play')) {
    const url = message.content.split(' ')[1];
    const id = String(new Date().getTime() || url);

    if (!getYoutubeResource(url)) {
      message.reply('Указана невалидная ссылка.');
      return;
    }

    const channel = message.member.voice.channel;
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
    
    myChannel.addToQueue({id, url});
    if (myChannel.queue.length === 1 && !myChannel.currentSong) {
      myChannel.nextPlay();
      const resource = getYoutubeResource(myChannel.currentSong.url);
      player.play(resource);
    }
    
    connection.subscribe(player);
  }
  if (message.content.startsWith('!stop')) {
    player.stop();
    myChannel.stop();
  }
  if (message.content.startsWith('!skip')) {
    player.stop();
    myChannel.nextPlay();
    const resource = getYoutubeResource(myChannel.queue[0]?.url);
    if (resource) {
      player.play(resource);
    }
  }
  if (message.content.startsWith('!pause')) {
    player.pause();
  }
  if (message.content.startsWith('!unpause')) {
    player.unpause();
  }

  if (message.content.startsWith('!repeat')) {
    if (myChannel.repeatEnabled) {
      myChannel.repeatEnabled = false;
      console.log('Повтор отключен!')
    } else {
      myChannel.repeatEnabled = true;
      console.log('На повторе!')
    }

  }
});

client.on('ready', () => {
  console.log(`Бот ${client.user.tag} запущен!`);
});