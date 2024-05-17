# Discord-singer-bot
Discord bot for playing music from YouTube in voice channels.

## Setup
 1. First, you need to create a Discord app following the [official documentation](https://discord.com/developers/docs/quick-start/getting-started);
 2. Copy the repository and install all dependencies;
 3. Enter data about the created bot into the **environment variables** `BOT_TOKEN` and `CLIENT_ID`;
 4. Invite a bot to your Discord server.

## NPM commands
* `npm install` — install all dependencies;
* `npm run build` — build an application to run;
* `npm run start` — run the application;
* `npm run deploy:commands` — deployment of commands for the bot;
* `npm run dev` — build and run the application.

## Usage
This bot has the following features:
* `/play [link to youtube video]` — command adds the video to the playback queue;
* `/pause` — command that temporarily pauses playback;
* `/repeat` — command that controls looping playback;
* `/skip` — command that plays the next track;
* `/stop` — command that stops and empties the playback queue;
* `/playlist [link to youtube playlist]` — command adds a video from a YouTube playlist to the playback queue.
