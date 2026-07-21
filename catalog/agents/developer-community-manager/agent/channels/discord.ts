import { discordChannel } from "eve/channels/discord";

export default discordChannel({
  botToken: () => process.env.DISCORD_BOT_TOKEN!,
  publicKey: () => process.env.DISCORD_PUBLIC_KEY!,
});
