import { REST } from 'discord.js';
import { Routes } from 'discord-api-types/v9';
import { CLIENT_ID, TOKEN } from '../config';
import { commands } from './utility';


export function deployCommands() {
  const rest = new REST().setToken(TOKEN);

  (async () => {
    try {
      console.log(`Перезаписываем команды (/) в количестве ${commands.length} шт.`);
  
      await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands.map(item => item.data) }
      );
    } catch (error) {
      console.error(JSON.stringify(error.rawError));
    }
  })();
}

