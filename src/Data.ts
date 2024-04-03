import { AudioResource } from "@discordjs/voice";

interface QueueItem {
  id: string;
  resource: AudioResource<MediaMetadata>;
}

export class Channel {
  channelId: string;
  private _queue: QueueItem[];
  private _currentSong: QueueItem | null;
  private _repeatEnabled: boolean;

  constructor(channelId: string) {
    this.channelId = channelId;
    this._queue = [];
    this._currentSong = null;
    this._repeatEnabled = false;
  }

  public get queue(): QueueItem[] {
    return this._queue;
  }

  public get currentSong(): QueueItem | null {
    return this._currentSong;
  }

  public set currentSong(song: QueueItem | null) {
    this._currentSong = song;
  }
  
  public get repeatEnabled() : boolean {
    return this._repeatEnabled;
  }

  public set repeatEnabled(value : boolean) {
    this._repeatEnabled = value;
  }

  public get hasMore(): boolean {
    return this._queue.length >= 1;
  }

  public addToQueue(item: QueueItem) {
    this._queue.push(item);
    if (this.queue.length === 1) {
      this.currentSong = this._queue.shift();
    }
    console.log('addToQueue: ', this._queue, this.currentSong, this._queue);
  }

  public stop() {
    this.currentSong = null;
    console.log('Stop: ', this.currentSong);
  }
  
  public nextSong() {
    if (this.repeatEnabled) {
      this.addToQueue(this.currentSong);
    } else {
      this.currentSong = this._queue.shift() || null;
    }
    console.log('nextSong: ', this.currentSong, this.queue);
  }
}