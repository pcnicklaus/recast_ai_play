// load environment variables
var dotenv = require('dotenv');
dotenv.config();

// recast and botkit dependencies
const RecastBot = require('recastbot');
const Botkit = require('./node_modules/botkit/lib/Botkit.js');

// create the recast bot
const ai = new RecastBot(process.env.RECAST_TOKEN);

// create the controller from botkit
var controller = Botkit.slackbot({
    debug: false
});

// create the bot
var bot = controller.spawn({
    token: process.env.SLACK_TOKEN
}).startRTM();

// Needs some work. This is how you respond, i.e. using the botkit reply method.
var respondFn = function(message, string) {
   bot.reply(message, string);
};

// need to get this dialed in. Due to asynchronousness, this won't be returned before the bot replies.
// const getUserInfo = (bot, message) => {
//    bot.api.users.info({user: message.user}, (error, response) => {
//         real_name = response.user.profile.first_name;
//         console.log('real name', real_name)
//    });
// }


// duh-dun-da-dahhhhh my whole one hears method. technically the catch all overides all the kinds of messages.
// need to see what botkit says about handing this
controller.hears('(.*)', 'direct_message,direct_mention,mention', function(bot, message) {

   // this won't be returned before the bot replies.
   // const user = getUserInfo(bot, message)
   // console.log(user, "< user")

   // not DRY and sloppy cause we're going to have do this for every action...
   bot.api.users.info({user: message.user}, (error, response) => {
        real_name = response.user.real_name;
    })

   // send it out to api to process
   aiBot = ai.process(message.text, respondFn);

   // if it hears the intent, basic greeting, this is what it will do.
   aiBot.hears('basic_greeting', (res, respondFn) => {
      console.log(res, "res")
      respondFn(message, 'Hello, ' + real_name + '!')
   })
   // this is the default method
   .otherwise((res, userData, respondFn) => {
      console.log("not otherwise")
   })
   // and complete, udder and total failure... moooooooo
   .fails((err) => {
      console.log("fail!!!!!", err.message)
      // respondFn('Sorry, there was an error. Try again later.')
   });

});
