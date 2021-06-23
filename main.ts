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
    const text = message.reply_to_message?.text || message.text.substring(6) ||
      "I can't hear you";
    bot.sendMessage({
      chat_id: message.chat.id,
      text: uwuifier.uwuifySentence(text),
    });
  }
});

bot.on(UpdateType.InlineQuery, async (query) => {
  const send = uwuifier.uwuifySentence(query.inline_query.query);
  if (send && send.length > 0) {
    await bot.answerInlineQuery({
      inline_query_id: query.inline_query.id,
      results: [{
        type: "article",
        id: "1",
        title: send,
        input_message_content: { message_text: send },
      }],
    });
  }
});

bot.run({
  polling: true,
});
