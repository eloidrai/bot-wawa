const Discord = require('discord.js');
const fetch = require('node-fetch');

const bot = new Discord.Client();

const config = require('./config.json');

bot.once('ready',
    ()=>{
        bot.user.setActivity("Mange des cookies sur le PC d'Éloi");
        console.log("Bot connecté.")
    }
)

bot.on('message', (message)=>{
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).split(/ +/), cmd = args.shift().toLowerCase();
    
    /*À propos*/
    if (cmd === 'salut'){
        message.reply(`Bonjour, je suis le robot d'Éloi Draï. Vous pouvez me faire accomplir quelques tâches...`);
    } else if (cmd === 'source'){
        message.channel.send(`Mon code source est disponible sur **GitHub**. Pour en savoir plus sur mon fonctionnement, consulter \`README.md\`.
https://github.com/eloidrai/bot-wawa`);
    } else if (cmd === 'site'){
        message.channel.send(`**Ceci est le site d'eloidrai.**
    https://eloidrai.github.io/
*On y trouve différentes réalisations informatiques...*`);
    }
    
    /*Google*/
    if (cmd === 'google'){
        message.reply(`Voilà la recherche **Google :**
${"https://www.google.fr/search?q="+encodeURIComponent(args.join(" "))}`)
    }
    
    /*Wolfram|Alpha*/
    if (cmd === 'wa'){
        message.reply(`Voilà ce qu'en dit **Wolfram|Alpha : **
${"https://www.wolframalpha.com/input/?i="+encodeURIComponent(args.join(""))}`)
    }
    
    /*Météo*/
    if (cmd === 'meteo'){
        const ville = args[0] || "Caen";
        fetch("https://www.prevision-meteo.ch/services/json/"+ville)
            .then(rep=>rep.json())
            .then(rep=> {
                if ('errors' in rep) {
                    message.channel.send(`Je n'ai pas trouvé cette ville.`);
                } else {
                    message.channel.send(`**Infos météo pour ${rep.city_info.name}**
> Température actuelle : ${rep.current_condition.tmp}°C
> Pression : ${rep.current_condition.pressure} hPa
> Humidité : ${rep.current_condition.humidity}%

> Vitesse du vent : ${rep.current_condition.wnd_spd} km/h
> Direction du vent : ${rep.current_condition.wnd_dir}

> En bref : ${rep.current_condition.condition}`, {files: [rep.current_condition.icon_big]});
                }
            });

    }
    
    /*Calculs*/
    const foncAutorisees = ["Math", "E", "LN10", "LN2", "LOG10E", "LOG2E", "PI", "SQRT1_2", "SQRT2", "abs", "acos", "acosh", "asin", "asinh", "atan", "atan2", "atanh", "cbrt", "ceil", "clz32", "cos", "cosh", "exp", "expm1", "floor", "fround", "hypot", "imul", "log", "log10", "log1p", "log2", "max", "min", "pow", "random", "round", "sign", "sin", "sinh", "sqrt", "tan", "tanh", "trunc", "BigInt", "n"];

    if (cmd === 'calc') {
        const exp = args.join("");
        try {
            const lettres = /[a-z]+/gi
            if ((exp.match(lettres) || []).some((e)=>(foncAutorisees.indexOf(e)===-1))) {
                throw new Error(`Danger`);
            } else {
                message.reply(eval(exp));
            }
        } catch (err) {
            if (err.message === `Danger`){
                message.reply(`Cette expression a été bloquée pour des raisons de sécurité`)
            } else {
                message.reply(`Une erreur est survenue`);
            }
        }
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
