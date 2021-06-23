import {
  TelegramBot,
  UpdateType,
} from "https://deno.land/x/telegram_bot_api@0.4.0/mod.ts";
import Uwuifier from "https://deno.land/x/uwuifier@v4.0.1/src/index.ts";

// Create a "Uwuifier" instance
const uwuifier = new Uwuifier();

const TOKEN = Deno.env.get("TOKEN");
if (!TOKEN) throw new Error("Bot token is not provided");
const bot = new TelegramBot(TOKEN);

bot.on(UpdateType.Message, async ({ message }) => {
  if (message.text && message.text.startsWith("/uwufy")) {
    const text = message.reply_to_message?.text || message.text.substring(6) || "I can't hear you";
    await bot.sendMessage({
      chat_id: message.chat.id,
      text: uwuifier.uwuifySentence(text),
    });
  }
});

bot.run({
  polling: true,
});
