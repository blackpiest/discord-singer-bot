import { MoreVideoDetails, VideoDetails, getInfo } from 'ytdl-core';

export async function getVideoInfo(url: string): Promise<MoreVideoDetails | VideoDetails | null> {
  return getInfo(url).then(info => {
    return info.videoDetails;
  })
    .catch((error) => {
      console.log('Ошибка получения информации о видео:', error.message);
      return null;
    });
}