import { CacheType, Client, CommandInteraction, VoiceBasedChannel } from 'discord.js';

export function getVoiceChat(client: Client, interaction: CommandInteraction<CacheType>): VoiceBasedChannel {
  const guild = client.guilds.cache.get(interaction.guildId);
  const member = guild.members.cache.get(interaction.member.user?.id);
  const voiceChannel = member.voice.channel;
  return voiceChannel;
}