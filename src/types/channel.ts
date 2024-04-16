interface QueueItem {
  id: string;
  url: string;
  name?: string;
  author?: {
    name: string;
    user: string;
    url: string;
  };
}

export class Channel {
  channelId: string;
  private _queue: QueueItem[];
  private _currentSong: QueueItem | null;
  private _repeatEnabled: boolean;
  private _pauseEnabled: boolean;

  constructor(channelId: string) {
    this.channelId = channelId;
    this._queue = [];
    this._currentSong = null;
    this._repeatEnabled = false;
    this._pauseEnabled = false;
  }

  public get queue(): QueueItem[] {
    return this._queue;
  }

  private set queue(items: QueueItem[]) {
    this._queue = items;
  }

  public get currentSong(): (QueueItem | null) {
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

  public get pauseEnabled() : boolean {
    return this._pauseEnabled;
  }

  public pause(value: boolean) {
    this._pauseEnabled = value;
  }

  public get hasMore(): boolean {
    return this.queue.length >= 1;
  }

  public addToQueue(item: QueueItem) {
    this.queue = this.queue.filter(Boolean);
    this.queue.push(item);
    console.log('addToQueue: ', this.queue);
  }

  public stop() {
    this.currentSong = null;
    this.queue = [];
    console.log('Stop: ', this.currentSong, this.queue);
  }
  
  public nextPlay() {
    if (this.repeatEnabled) {
      console.log('is Repeat.');
      this.addToQueue(this.currentSong);
    }
    this.currentSong = this.queue.shift() || null;

    console.log('nextPlay (currentSong): ', this.currentSong);
  }
}