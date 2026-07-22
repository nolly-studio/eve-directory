import { telegramChannel } from "eve/channels/telegram";

// Credentials: TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET_TOKEN.
// uploadPolicy lets inbound photos (and PDFs) reach the model.
export default telegramChannel({
  uploadPolicy: {
    allowedMediaTypes: ["image/*", "application/pdf"],
    maxBytes: 10 * 1024 * 1024,
  },
});
