const Discord = require('discord.js');
const fetch = require('node-fetch');

const bot = new Discord.Client();

const config = require('./config.json');

/*Fonctions pour les conversions*/
const deg = n=> n*180/PI;
const rad = n=> n*PI/180;
const df = c=> (9/5)*c+32;
const dc = f=> (f-32)/(9/5);


bot.on('ready',
    ()=>{bot.user.setActivity("Mange des cookies sur le PC d'Éloi");}
)

bot.on('message', (message)=>{
    /*Salutations, source et le site*/
    if (message.content === "!salut"){
        message.reply("Bonjour, je suis le robot d'Éloi Draï. Vous pouvez me faire accomplir quelques tâches...");
    } else if (message.content === "!source"){
        message.channel.send("Mon code source est disponible sur **GitHub**. Pour en savoir plus sur mon fonctionnement, consulter `README.md`.\n https://github.com/eloidrai/bot-wawa");
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
    /*Conversions*/
    if (message.content.substring(0,4) === "!rad"){
        let n = parseInt(message.content.substring(5));
        message.reply(`${n} degrés = **${rad(n)}** radians`);
    } else if (message.content.substring(0,4) === "!deg"){
        let n = parseInt(message.content.substring(5));
        message.reply(`${n} radians = **${deg(n)}** degrés`);
    } else if (message.content.substring(0,3) === "!df"){
        let n = parseInt(message.content.substring(4));
        message.reply(`${n}°C = **${df(n)}** °F`);
    } else if (message.content.substring(0,3) === "!dc"){
        let n = parseInt(message.content.substring(4));
        message.reply(`${n}°F = **${dc(n)}** °C`);
    }

    

/*Meteo*/
    if (message.content.toLowerCase().startsWith("!meteo")){
        const req = message.content.split(" ");
        const ville = req[1] || "Caen";
        fetch("https://www.prevision-meteo.ch/services/json/"+ville)
            .then(rep=>rep.json())
            .then(rep=> {
                if ("errors" in rep) {
                    message.channel.send("Je n'ai pas trouvé cette ville.");
                } else {
                    message.channel.send(`**Infos météo pour ${rep.city_info.name}**
> Température actuelle : ${rep.current_condition.tmp}°C
> Pression : ${rep.current_condition.pressure} hPa
> Humidité : ${rep.current_condition.humidity}

> Vitesse du vent : ${rep.current_condition.wnd_spd} km/h
> Direction du vent : ${rep.current_condition.wnd_dir}

> En bref : ${rep.current_condition.condition}`);
                }
            })

    }

    /*Calculs*/
    const foncAutorisees = ["Math", "E", "LN10", "LN2", "LOG10E", "LOG2E", "PI", "SQRT1_2", "SQRT2", "abs", "acos", "acosh", "asin", "asinh", "atan", "atan2", "atanh", "cbrt", "ceil", "clz32", "cos", "cosh", "exp", "expm1", "floor", "fround", "hypot", "imul", "log", "log10", "log1p", "log2", "max", "min", "pow", "random", "round", "sign", "sin", "sinh", "sqrt", "tan", "tanh", "trunc", "BigInt", "n"];

   if (message.content.toLowerCase().startsWith("!calc")) {
        const exp = message.content.substr(6);
        try {
            const lettres = /[a-z]+/gi
            if ((exp.match(lettres) || []).some((e)=>(foncAutorisees.indexOf(e)===-1))) {
                throw new Error("Danger");
            } else {
                message.reply(eval(exp))
            }
        } catch (err) {
            if (err.message === "Danger"){
                message.reply("Cette expression a été bloquée pour des raisons de sécurité")
            } else {
                message.reply("Une erreur est survenue");
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
