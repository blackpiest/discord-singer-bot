import { REST } from 'discord.js';
import { Routes } from 'discord-api-types/v9';
import { playCommand } from './commands/utility/play';
import { CLIENT_ID, TOKEN } from './config';


export function deployCommands() {
  const commands = [];
  commands.push(playCommand.data);
  const rest = new REST().setToken(TOKEN);

  (async () => {
    try {
      console.log(`Started refreshing ${commands.length} application (/) commands.`);
  
      await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands }
      );
    } catch (error) {
      console.error(JSON.stringify(error.rawError));
    }
  })();
}

