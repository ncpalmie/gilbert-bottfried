const axios = require("axios");
const { Readable } = require("stream");
const fs = require("fs");

const ttsURL = "https://mumble.stream/speak_spectrogram";
const headers = {
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  Accept: "application/json",
  "Content-Type": "application/json",
};

const convertGilfredAudio = async (text) => {
  const response = await axios.post(
    ttsURL,
    {
      text: text,
      speaker: "gilbert-gottfried",
    },
    { headers: headers }
  );
  return Readable.from(Buffer.from(response.data.audio_base64, "base64"));
};

module.exports = {
  name: "gilbert",
  description:
    "Plays text written in message using Vo.codes Gilfred Gottfried TTS",
  async execute(message, args) {
    const audioStream = convertGilfredAudio(args.join(" "));

    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const dispatcher = connection.play("./test.mp3");
      dispatcher.on("start", () => {
        console.log("test.mp3 is now playing!");
      });
      dispatcher.on("finish", () => {
        console.log("test.mp3 has finished playing!");
      });
      console.log(dispatcher);
      connection.disconnect();
    } else {
      message.reply("I cannot speak to you if you are not in a channel.");
    }
  },
};
