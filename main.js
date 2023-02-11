const TelegramApi = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();

const token = process.env.TOKEN; // Your Telegram Bot TOKEN
const umidxonId = process.env.MY_CHAT_ID; // https://t.me/umidkhan_pulatkhanov's chat ID
const url = process.env.URL; // Used API
const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
  { command: "/start", description: "Botni ishga tushirish" },
]);

bot.on("message", async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  if (text === "/start") {
    await bot.sendMessage(
      chatId,
      `Assalomu alaykum <b>${msg.chat.first_name}</b> 👋\nBotga xush kelibsiz\nUshbu bot GitHub platformasidagi foydalanuvchilarni topib beradi\nShunchaki <b>GitHub</b> username <i>(foydalanuvchi nomi)</i>ni kiriting va sizga ma'lumotlarni yuboraman`,
      { parse_mode: "HTML" }
    );
  } else {
    axios
      .get(`${url}${text}`)
      .then((res) => {
        const data = res.data;
        bot.sendPhoto(
          chatId,
          `${data.avatar_url === null ? "Topilmadi 🤷" : data.avatar_url}`,
          {
            caption: `<b>Ism familiya</b>: ${
              data.name === null ? "Topilmadi 🤷" : data.name
            }
🆔 <b>ID</b>: <code>${data.id}</code>
🌐 <b>URL</b>: ${data.html_url}
👥 <b>Obunachilari soni</b>: ${data.followers}
🎦 <b>Blogi</b>: ${data.blog === "" ? "Topilmadi 🤷" : data.blog}
📝 <b>Biografiyasi</b>: ${data.bio === null ? "Topilmadi 🤷" : data.bio}
📍 <b>Joylashuv</b>: ${data.location === null ? "Topilmad 🤷" : data.location}
🕰 <b>Hisob yaratilgan vaqt</b>: ${data.created_at}`,
            parse_mode: "HTML",
          }
        );
      })
      .catch((err) => {
        bot.sendMessage(chatId, `${text} nomli foydalanuvchi topilmadi 🙁`);
      });
  }
});
