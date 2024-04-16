import ytpl from 'ytpl';

export async function getPlaylistInfo(url: string): Promise<(ytpl.Item[] | null)>  {
  const id = await ytpl.getPlaylistID(url);
  if (!ytpl.validateID(id)) {
    return null;
  }
  const playlist = await ytpl(id);
  return playlist.items;
}