require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandDelimiter = "!";

// Setup commands from /commands
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {
  if (!message.content.startsWith(commandDelimiter)) return;

  const args = message.content.slice(commandDelimiter.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  const connection = await message.member.voice.channel.join();
  const dispatcher = connection.play(
    require("path").join(__dirname, "./test.mp3")
  );
  console.log(require("path").join(__dirname, "./test.mp3"));
  dispatcher.on("start", () => {
    console.log("test.mp3 is now playing!");
  });
  dispatcher.on("finish", () => {
    console.log("test.mp3 has finished playing!");
  });
  connection.disconnect();

  try {
    console.log("Running " + command + ".");
    //client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("Error occurred while executing command: " + error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
});

client.login(process.env.BOT_TOKEN);
