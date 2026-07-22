import { telegramChannel } from "eve/channels/telegram";

// Credentials come from env: TELEGRAM_BOT_TOKEN and
// TELEGRAM_WEBHOOK_SECRET_TOKEN. See SETUP.md.
export default telegramChannel();
