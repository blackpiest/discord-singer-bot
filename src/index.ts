import { joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } from '@discordjs/voice';
import { client } from './config';
import { getYoutubeResource } from './lib/getYoutubeResource';
import { Channel } from './Data';

const player = createAudioPlayer();
const myChannel = new Channel('testId');
let isStart = false;

client.on('messageCreate', function(message) {
  if (message.content.startsWith('!play')) {
    const channel = message.member.voice.channel;
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
    const url = message.content.split(' ')[1];


    const resource = getYoutubeResource(url);
    if (!resource) {
      message.reply('Ошибка воспроизведения!');
      return;
    }

    // TODO: Надо хранить в очереди не ресурс, а url, и каждый раз перед воспроизведением создавать новый ресурс.
    
    myChannel.addToQueue({id: url, resource});
    if (!isStart) {
      player.play(myChannel.currentSong.resource);
      isStart = true;
    }
    
    player.on('error', error => {
      console.error('Error:', error.message, 'with track', error.resource.metadata);
    });
    player.on('stateChange', (oldState, newState) => {
      if (newState.status === AudioPlayerStatus.Idle) {
        // Проигрывание ресурса закончено
        console.log('Проигрывание ресурса закончено');
        myChannel.nextSong();
        
        if (myChannel.currentSong) {
          player.play(myChannel.currentSong.resource);
        }
      }
    });
    connection.subscribe(player);
  }
  if (message.content.startsWith('!stop')) {
    player.stop();
  }
  if (message.content.startsWith('!skip')) {
    player.stop();
    myChannel.nextSong();
    player.play(myChannel.queue[0].resource);
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