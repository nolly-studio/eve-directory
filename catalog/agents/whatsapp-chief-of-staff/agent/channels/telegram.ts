import { telegramChannel } from "eve/channels/telegram";

export default telegramChannel({
  botToken: () => process.env.TELEGRAM_BOT_TOKEN!,
});
