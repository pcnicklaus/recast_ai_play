if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./botkit/lib/Botkit.js');
var dotenv = require('dotenv').config();
// console.log(Botkit)
// var os = require('os');
// console.log(os)

var controller = Botkit.slackbot({
    debug: false
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();


controller.hears(['volunteer', 'I\'d like to volunteer'], 'direct_message,direct_mention,mention', function(bot, message) {


      var askMentalHealth = function(response, convo) {
         convo.ask('Awesome! Are you from the mental health world?', [
             {
                 pattern: bot.utterances.yes,
                 callback: function(response, convo) {
                    askSpecific(response, convo);
                    convo.next();
                 }
             },
            {
                pattern: bot.utterances.no,
                default: true,
                callback: function(response, convo) {
                    convo.say('*Phew!*');
                    convo.next();
                }
            }
         ]);
      }

      // can be reused for both the other ones (tech),
      var askSpecific = function(response, convo) {
         convo.ask('Do you want to do something specific?', [
            {
               pattern: bot.utterances.yes,
               callback: function(response, convo) {
                  convo.say('Excellent!')
                  askWhatIsIt(response,convo);
                  convo.next();
               }
            },
            {
               pattern: bot.utterances.no,
               default: true,
               callback: function(response, convo) {
                  getContactFirstName(response, convo);
                  convo.next();
               }
            }
         ]);
      }

      var askWhatIsIt = function(response, convo) {
         convo.ask('What is it?', function(response, convo) {
            convo.say('Neat.');
            getContactFirstName(response, convo);
            convo.next();
         })
      }

      var getContactFirstName = function(response, convo) {
         convo.ask("What's your first name?", function(response, convo){
            getContactLastName(response, convo);
            convo.next();
         })
      }

      var getContactLastName = function(response, convo) {
         convo.ask('And your last?', function(response, convo) {
            getContactType(response, convo);
            convo.next();
         })
      }

      var getContactType = function(message, convo) {
         convo.ask("What's the best way to get a hold of you, phone, text or email?", function(response, convo) {
            getContactDetail(response, convo);
            convo.next();
         })
      }

      var getContactDetail = function(message, convo) {
         convo.ask('And that is...',function(response, convo) {
            getContactForte(response, convo);
            convo.next();
         })
      }

      var getContactForte = function(message, convo) {
         convo.ask("What's your forte slash what do you do?", function(response, convo) {
            getContactCommitment(response, convo);
            convo.next();
         });
      }

      var getContactCommitment = function(response, convo) {
         convo.say("So this next question is pretty forward but really important because of what we're trying to accomplish.")
         convo.ask('What type of hourly commitment can we count on you for?', function(response, convo) {
            getContactAnythingElse(response, convo);
            convo.next();
         });
      }

      var getContactAnythingElse = function(response, convo) {
         convo.say('Okay, I think I got it.');
         convo.ask('Is there anything else you want us to know about you?', function(response, convo) {
            sayThanks(response, convo);
            convo.next();
         })
      }

      var sayThanks = function(response, convo) {
         convo.say('Hey, thanks so much for helping out. We really appreciate your help! If you want to get a hold of us, you can reach out at....');
         convo.say("Thanks again and we'll be in touch!!");
         // console.log(bot);
         // console.log(convo.text)

         convo.on('end',function(convo) {
           if (convo.status=='completed') {
             // do something useful with the users responses
             var res = convo.extractResponses();
             // reference a specific response by key
             var value  = convo.extractResponse('key');
             console.log(res, "<<<<<<<<<<<res");
             console.log(value, "<<<<<<<<<value");
           }
         //   else { something happened that caused the conversation to stop prematurely }

         });
      }


     bot.startConversation(message, askMentalHealth)
});
