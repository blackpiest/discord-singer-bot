import { Bot } from '../entities/Bot';

export type Database = {
  [key: string]: Bot;
};