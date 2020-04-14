const Discord = require('discord.js');
const fetch = require('node-fetch');
const cron = require('node-cron');
const dictcc = require('dictcc-js');

const bot = new Discord.Client();

const config = require('./config.json');

bot.once('ready',
    ()=>{
        bot.user.setActivity("Mange des framboises");
        console.log("Bot connecté.")
    }
)

bot.on('message', (message)=>{
    /*Obligation légale (ribt)*/
    let guildId;
    try {guildId = message.channel.guild.id} catch (e) {guildId = NaN}
    const prefix = (guildId == 401667451189985280)? `~`: config.prefix;

 
    /*Préfixe, commande et paramètre*/
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(/ +/), cmd = args.shift().toLowerCase();
    
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
${"https://www.google.fr/search?q="+encodeURIComponent(args.join(" "))}`);
        return;
    }
    
    /*Wolfram|Alpha*/
    if (cmd === 'wa'){
        message.reply(`Voilà ce qu'en dit **Wolfram|Alpha : **
${"https://www.wolframalpha.com/input/?i="+encodeURIComponent(args.join(""))}`);
        return;
    }
    
    /*Météo*/
    if (cmd === 'meteo'){
        const ville = args[0] || "Caen";
        const embed = new Discord.MessageEmbed();
        fetch("https://www.prevision-meteo.ch/services/json/"+ville)
            .then(rep=>rep.json())
            .then(rep=> {
                if ('errors' in rep) {
                    throw new rep['errors'];
                } else {
                    embed.setTitle(`Infos météo pour ${rep.city_info.name}`)
                        .setColor('#00DD88')
                        .setThumbnail(rep.current_condition.icon_big)
                        .addFields([
                            {
                                name: `Température actuelle`,
                                value: `${rep.current_condition.tmp}°C`
                            },
                            {
                                name: `Pression`,
                                value: `${rep.current_condition.pressure} hPa`
                            },
                            {
                                name: `Humidité`,
                                value: `${rep.current_condition.humidity} %`
                            },
                            {
                                name: `Vitesse du vent`,
                                value: `${rep.current_condition.wnd_spd} km/h`
                            },
                            {
                                name: `Direction du vent`,
                                value: `${rep.current_condition.wnd_dir}`
                            },
                            {
                                name: `En bref`,
                                value: `${rep.current_condition.condition}`
                            }
                        ])
                }
            })
            .catch((err)=>{
                embed.setTitle(`Je n'ai pas trouvé cette ville. :(`)
                    .setColor('#00DD88');
            })
            .then((p)=>{
                message.channel.send(embed);
            });
        return;
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
        return;
    }
    
    /*Abonnement aux nez*/
    if (cmd === 'nez'){
        if (args[0] === 'on'){
            nez.push(message.channel);
            message.channel.send("Ce salon est désormais abonné aux **rappels de nez**...");
        } else if (args[0] === 'off'){
            nez = nez.filter((i)=> (i!==message.channel));
            message.channel.send("Ce salon est désabonné des **rappels de nez**...");
        }
        return;
    }

    /*Covid-19*/
    if (cmd === 'covid-19'){
        const pays = args.join(" ").toUpperCase() || "ww";
        const embed = new Discord.MessageEmbed();
        if (pays in Covid19.pays){
            const data = Covid19.pays[pays];
            embed.setTitle(`La pandémie de COVID-19 au ${(new Intl.DateTimeFormat('en-GB')).format(Covid19.date)} :earth_americas: ${data.nom}`)
                .setColor('#AA0000')
                .addFields([
                    {
                        name: ":sick: Malades",
                        value: `**Nombre total :** ${data.malades[1]}
**Malades supplémentaires :** ${data.malades[1]-data.malades[0]}`
                    },
                    {
                        name: ":skull: Morts",
                        value: `**Nombre total :** ${data.morts[1]}
**Nouveaux décès :** ${data.morts[1]-data.morts[0]}`
                    },
                    {
                        name: ":slight_smile: Personnes rétablies",
                        value: `**Nombre total :** ${data.gueris[1]}
**Nouveaux rétablissements :** ${data.gueris[1]-data.gueris[0]}`
                    }
                ])
                .setFooter(`Ces chiffres sous-estiment la réalité.
Source : Johns Hopkins (CSSE)`);
        } else {
            const l = [];
            for (const i in Covid19.pays){
                l.push(Covid19.pays[i].nom)
            }
            l.shift()
            embed.setTitle(`Pays inconnu`)
                .setColor('#AA0000')
                .setDescription("Je n'ai pas d'informations sur ce pays. Voici la liste des pays disponibles ```"+l.join(", ")+"```");
        }
        message.channel.send(embed);
        return;
    }


    /*Dictionnaire Dict.cc*/
    if (cmd === 'trad') {
        const embed = new Discord.MessageEmbed();
        embed.setColor('#FF8C00');
        let [l, ...mots] = args;
        if (!mots || !l) return;
        const terme = mots.join(" ");
        l = l.split(/->?/);
        if (l[0] && l[1] && terme) {
            dictcc.translate(l[0], l[1], encodeURIComponent(terme), (res, err)=> {
                if (err) {
                    embed.setTitle("Erreur")
                        .setDescription("Ces dictionnaires ne sont pas disponibles");
                } else {
                    embed.setTitle(`${terme.slice(0,1).toUpperCase()+terme.slice(1)} (${l[0].toUpperCase()}-${l[1].toUpperCase()})`)
                    if (res.length) {

                        const champs = [];
                        let c = 0;
                        for (const i in res) {
                            if (i > 9) break;
                            champs.push({name: `**${(+i+1)}.** ${res[i]['from']}`, value: res[i]['to'], inline: true});
                        }
                        embed.addFields(champs);
                    } else {
                        embed.setDescription("Aucun résultat")
                    }
                }
                embed.setFooter("Source : dict.cc")
                message.channel.send(embed);

                
            });
        } else {
            embed.setTitle("Erreur")
                .setDescription("Nombre d'arguments incorrect");
            message.channel.send(embed);
        }
        return;
    }
});


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


/*Récupération des données du Covid-19*/
const Covid19 = {
    links: {
        "malades":"https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
        "morts":"https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv",
        "gueris":"https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv"
    },
    async getData(donnee) {
        this.pays = {}
        this.pays['ww'] = {}
        for (const d in this.links){                                            // d = l'infos (malades, morts...)
            const raw = await fetch(this.links[d]).then(res=>res.text());
            const tab = raw.split("\n").map(e=> e.split(","));
            this.date = new Date(tab[0][tab[0].length-1]);
            this.pays['ww'].nom = "Échelle mondiale";
            this.pays['ww'][d] = [0, 0];
            for (const ligne of tab){
                if (ligne[1] === 'Country/Region' || ligne[1] === undefined) continue;
                const clee = ligne[1].toUpperCase();
                this.pays[clee] = this.pays[clee] || {};
                this.pays[clee][d] = this.pays[clee][d] || [0, 0];
                this.pays[clee][d][0] += parseInt(ligne[ligne.length-2]);
                this.pays[clee][d][1] += parseInt(ligne[ligne.length-1]);
                this.pays[clee].nom = ligne[1];
                this.pays['ww'][d][0] += parseInt(ligne[ligne.length-2]);
                this.pays['ww'][d][1] += parseInt(ligne[ligne.length-1]);
            }
        }
    }
}

Covid19.getData();

cron.schedule("* 5 * * *", ()=>{ 
    Covid19.getData()
        .then(res=>console.log("Récupéré.", Covid19.date))
        .catch(err=>console.error(err));
            
});

/*Connexion à bot-wawa*/
bot.login(config.token)
