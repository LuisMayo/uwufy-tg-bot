import {
  TelegramBot,
  UpdateType,
} from "https://deno.land/x/telegram_bot_api@0.4.0/mod.ts";
import Uwuifier from "https://deno.land/x/uwuifier@v4.0.1/src/index.ts";
import { TgUtils } from "https://deno.land/x/telegram_bot_api_utils@v0.1.1/tg-bot-utils.ts";

// Create a "Uwuifier" instance
const uwuifier = new Uwuifier();

const TOKEN = Deno.env.get("TOKEN");
if (!TOKEN) throw new Error("Bot token is not provided");
const bot = new TelegramBot(TOKEN);
const utils = new TgUtils(bot);

utils.onCommand("uwufy", async (command) => {
  const message = command.original.message;
  const text = message.reply_to_message?.text || command.parsed_text ||
    "I can't hear you";
  try {
    await command.reply(uwuifier.uwuifySentence(text));
  } catch (e) {
    console.error(e);
  }
});

utils.onCommand("start", async (command) => {
  try {
    await command.reply(
      "I can convert messages into uwu messages. Just reply to a message using /uwufy or use me in inline mode typing @uwufyer_bot",
    );
  } catch (e) {
    console.error(e);
  }
});

utils.onCommand("about", async (command) => {
  try {
    await command.reply({
      text:
        "Made with ❤️ by @TLuigi003.\nSource code in https://github.com/LuisMayo/ace-attorney-telegram-bot\n\nDo you like my work? You could thank me by buying me a [ko-fi](https://ko-fi.com/luismayo)",
      parse_mode: "Markdown",
    });
  } catch (e) {
    console.error(e);
  }
});

bot.on(UpdateType.Message, async ({ message }) => {
  const text = message.text?.trimStart();
  if (
    text != null && text.length > 0 && !text?.startsWith("/") &&
    (message.chat.type === "private" || Math.random() > 0.95)
  ) {
    try {
      await bot.sendMessage({
        chat_id: message.chat.id,
        text: uwuifier.uwuifySentence(message.text!),
      });
    } catch (e) {
      console.error(e);
    }
  }
});

bot.on(UpdateType.InlineQuery, async (query) => {
  const send = uwuifier.uwuifySentence(query.inline_query.query);
  if (send && send.length > 0) {
    try {
      await bot.answerInlineQuery({
        inline_query_id: query.inline_query.id,
        results: [{
          type: "article",
          id: "1",
          title: send,
          input_message_content: { message_text: send },
        }],
      });
    } catch (e) {
      console.error(e);
    }
  }
});

bot.run({
  polling: true,
});
