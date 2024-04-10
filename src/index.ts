import { Channel } from './types/channel';
import { initPlayer } from './player';
import { initClient } from './client';

const myChannel = new Channel('testId');
initPlayer(myChannel);
initClient(myChannel);