import { initPlayer } from './player';
import { initClient } from './client';
import { Channel } from './core/entities/Channel';

const myChannel = new Channel('testId');
initPlayer(myChannel);
initClient(myChannel);