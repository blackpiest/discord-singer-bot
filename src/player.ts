import { AudioPlayerStatus, createAudioPlayer } from '@discordjs/voice';
import { getYoutubeResource } from './lib/getYoutubeResource';
import { Channel } from './Data';

export const player = createAudioPlayer();

export function initPlayer(channel: Channel) {
  player.on('error', error => {
    console.error('Error:', error.message, 'with track', error.resource.metadata);
  });
  
  player.on('stateChange', (_oldState, newState) => {
    if (newState.status === AudioPlayerStatus.Idle) {
      console.log('Проигрывание ресурса закончено');
      channel.nextPlay();
      
      if (channel.currentSong) {
        const resource = getYoutubeResource(channel.currentSong.url);
        console.log('Началось проигрывание: ', channel.currentSong);
        player.play(resource);
      }
    }
  });
}

