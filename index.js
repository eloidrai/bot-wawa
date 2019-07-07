const Discord = require('discord.js');
const bot = new Discord.Client();

const config = require('./config.json');

/*Fonctions radians et degrés*/
const deg = (n)=> n*180/Math.PI;
const rad = (n)=> n*Math.PI/180;

bot.on('ready',
    ()=>{bot.user.setActivity("Mange des cookies sur le PC d'Éloi");}
)

bot.on('message', (message)=>{
    /*Salutations et le site*/
    if (message.content === "!salut"){
        message.reply("Bonjour, je suis le robot d'Éloi Draï. Vous pouvez me faire accomplir quelques tâches...");
    } else if (message.content === "!site"){
        message.channel.send("**Ceci est le site d'eloidrai.**\n\thttps://eloidrai.github.io/\n*On y trouve différentes réalisations informatiques...*");
    }
    /*Abonnement aux nez*/
    if (message.content === "!nez activé"){
        nez.push(message.channel);
        message.channel.send("Ce serveur est désormais abonné aux **rappels de nez**...");
    } else if (message.content === "!nez désactivé"){
        nez = nez.filter((i)=> (i!==message.channel));
        message.channel.send("Ce serveur est désabonné des **rappels de nez**...");
    }
    /*Radians et degrés (interaction)*/
    if (message.content.substring(0,4) === "!rad"){
        let n = parseInt(message.content.substring(5));
        message.reply(`${n} degrés = **${rad(n)}** radians`);
    } else if (message.content.substring(0,4) === "!deg"){
        let n = parseInt(message.content.substring(5));
        message.reply(`${n} radians = **${deg(n)}** degrés`);
    }
})

/*Nez*/
var nez = [];
bot.setInterval(
    ()=> {
            let temps = new Date();
            if (temps.getHours() === temps.getMinutes()){
                let n = temps.getHours();
                for (let i in nez){
                    nez[i].send(`Il faut se toucher **${n}** fois le nez, il est \`${n}:${n}\``)
                }
            }},
        60000
)

bot.login(config.token)
