/*Abonnement aux nez*/
if (message.content === "!nez activé"){
    nez.push(message.channel);
    message.channel.send("Ce serveur est désormais abonné aux **rappels de nez**...");
} else if (message.content === "!nez désactivé"){
    nez = nez.filter((i)=> (i!==message.channel));
    message.channel.send("Ce serveur est désabonné des **rappels de nez**...");
}
  
