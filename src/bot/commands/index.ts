import { skipCommand } from './skip';
import { pauseCommand } from './pause';
import { playCommand } from './play';
import { repeatCommand } from './repeat';
import { stopCommand } from './stop';
import { playlistCommand } from './playlist';

export const commands = [
  playCommand,
  repeatCommand,
  stopCommand,
  pauseCommand,
  skipCommand, 
  playlistCommand
];