// require('dotenv').config();
// const botsrc = process.env.BOTSRC;

window.botpressWebChat.init({
    "composerPlaceholder": "Chat with bot",
    "botConversationDescription": "This chatbot was built surprisingly fast with Botpress",
    "botId": "5c1d050b-d1cc-494b-9536-a8a5ff5e3ef2",
    "hostUrl": "https://cdn.botpress.cloud/webchat/v1",
    "messagingUrl": "https://messaging.botpress.cloud",
    "clientId": "5c1d050b-d1cc-494b-9536-a8a5ff5e3ef2",
    "webhookId": "83f6a3f1-6962-435e-9848-9b411c8f7e45",
    "lazySocket": true,
    "themeName": "prism",
    "frontendVersion": "v1",
    "showBotInfoPage": true,
    "enableConversationDeletion": true,
    "theme": "prism",
    "themeColor": "#2563eb"
});

// function myFunc() {
//     window.botpressWebChat.onEvent(
//         function (event) {
//             if (event.type === 'MESSAGE.SENT') {
//                 window.botpressWebChat.sendEvent({ type: 'show' })

//                 // window.location.reload();
//                 const dataToSend = { count: '+1' };

//                 fetch("/bot", { method: "POST" }).then((res) => { //
//                     window.location.href = "/toomany";
//                 }).catch(function (err) {
//                     console.info(err);
//                 });
//             }
//         },
//         ['MESSAGE.SENT']
//     )
//     console.log('function defined');
// }

// Object.freeze(myFunc);

// setInterval(myFunc, 5000);