import { AudioResource, createAudioResource } from '@discordjs/voice';
import ytdl from 'ytdl-core';

export function getYoutubeResource(url: string):AudioResource<MediaMetadata extends null | undefined ? null : null> {
  if (ytdl.validateURL(url)) {
    console.log('Загрузка ссылки: ', url);
    const stream = ytdl(url, { filter: 'audioonly' });
    const resource =  createAudioResource(stream);
    return resource;
  } else {
    console.log(`Ссылка ${url} некорректна`);
    return null;
  }
}
