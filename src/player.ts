import { AudioPlayerStatus, createAudioPlayer } from '@discordjs/voice';
import { getYoutubeResource } from '@/core/lib';
import { Channel } from './core/entities/Channel';

export const player = createAudioPlayer();

export function initPlayer(channel: Channel) {
  player.on('error', error => {
    console.error('[DISCORD-PLAYER]: ', error.message, 'with track', error.resource.metadata);
  });
  
  player.on('stateChange', (_oldState, newState) => {
    if (newState.status === AudioPlayerStatus.Idle) {
      console.log('[DISCORD-PLAYER]: Проигрывание ресурса закончено');
      channel.nextPlay();
      
      if (channel.currentSong) {
        const resource = getYoutubeResource(channel.currentSong.url);
        console.log('[DISCORD-PLAYER]: Началось проигрывание: ', channel.currentSong);
        player.play(resource);
      }
    }
  });
}

