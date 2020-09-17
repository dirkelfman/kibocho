"use strict";

const Alexa = require("alexa-sdk");
const Notifier = require("./notifications");

const SKILL_NAME = "kiboko";
const NOTIFICATION_MESSAGE = "Here's your summary";
const STOP_MESSAGE = "Goodbye!";
const HELP_MESSAGE = "You can ask Kiboko for Order Summary, Inventory status, and Popular product information of your tenant. For example: You can say, Alexa! Ask Kiboko, how many orders are placed so far today?";
const HELP_REPROMPT = "What can I help you with?";
const APP_ID = undefined;
//const conString = "postgres://dev:Volusion1!@kiboko2.chqdf0xymded.us-east-1.rds.amazonaws.com/kiboko";



const handlers = {
    "LaunchRequest": function () {
        this.emit(":ask", "Hi! I am Kiboko.", HELP_REPROMPT);
    },
    "TellAJokeIntent": function(){
        this.emit(":tell", "Ani is the most handsome of them all. Wink. Wink");
    },
    "GetOrdersTodayIntent": function () {
        this.emit("GetOrdersForToday");
    },
    "GetTodaysReportIntent": function () {
        const self = this;
        var message = "";
        Notifier.GetOrdersToday().then(function (ordmsg) {
            message += ordmsg + ' <break time="1.5s"/> ';
            return Notifier.GetPopularProductToday();
        }).then(function (prodmsg) {
            message += prodmsg + ' <break time="1.5s"/> ';
            return Notifier.GetInventoryStatus();
        }).then(function (inventmsg) {
            console.log("inveotyr update");
            message += inventmsg + ' <break time="1.5s"/> ';
            const speechOutput = NOTIFICATION_MESSAGE + message;
            self.emit(":tellWithCard", speechOutput, SKILL_NAME, message);
        }).catch(function (err) {
            console.log("Error fetching summary :" + err);
            self.emit(":tell", "Error fetching summary");
        });
    },
    "GetOrdersForToday": function () {
        const self = this;
        Notifier.GetOrdersToday().then(function (orderMessage) {
            const speechOutput = NOTIFICATION_MESSAGE + orderMessage;
            self.emit(":tellWithCard", speechOutput, SKILL_NAME, orderMessage);
        }).catch(function (err) {
            console.log("Error fetching orders for today :" + err);
            self.emit(":tell", "Error fetching orders for today");
        });
    },
    "GetOrdersThisWeekIntent": function () {
        const self = this;
        Notifier.GetOrdersThisWeek().then(function (orderMessage) {
            const speechOutput = NOTIFICATION_MESSAGE + orderMessage;
            self.emit(":tellWithCard", speechOutput, SKILL_NAME, orderMessage);
        }).catch(function (err) {
            console.log("Error fetching orders for this week :" + err);
            self.emit(":tell", "Error fetching orders for this week");
        });
    },
    "GetOrdersThisMonthIntent": function () {
        const self = this;
        Notifier.GetOrdersThisMonth().then(function (orderMessage) {
            const speechOutput = NOTIFICATION_MESSAGE + orderMessage;
            self.emit(":tellWithCard", speechOutput, SKILL_NAME, orderMessage);
        }).catch(function (err) {
            console.log("Error fetching orders for this month :" + err);
            self.emit(":tell", "Error fetching orders for this month");
        });
    },
    "GetInventoryUpdatesIntent": function () {
        const self = this;
        Notifier.GetInventoryStatus().then(function (inventoryMessage) {
            const speechOutput = NOTIFICATION_MESSAGE + inventoryMessage;
            self.emit(":tellWithCard", speechOutput, SKILL_NAME, inventoryMessage);
        }).catch(function (err) {
            console.log("Error fetching inventory status :" + err);
            self.emit(":tell", "Error fetching inventory status");
        });
    },
    "GetPopularProductThisMonthIntent": function () {
        const self = this;
        Notifier.GetPopularProductThisMonth().then(function (productMessage) {
            const speechOutput = NOTIFICATION_MESSAGE + productMessage;
            self.emit(":tellWithCard", speechOutput, SKILL_NAME, productMessage);
        }).catch(function (err) {
            console.log("Error fetching popular product for this month :" + err);
            self.emit(":tell", "Error fetching popular product for month");
        });
    },
    "GetPopularProductThisWeekIntent": function () {
        const self = this;
        Notifier.GetPopularProductThisWeek().then(function (productMessage) {
            const speechOutput = NOTIFICATION_MESSAGE + productMessage;
            self.emit(":tellWithCard", speechOutput, SKILL_NAME, productMessage);
        }).catch(function (err) {
            console.log("Error fetching popular product for this week :" + err);
            self.emit(":tell", "Error fetching popular product for this week");
        });
    },
    "GetPopularProductTodayIntent": function () {
        const self = this;
        Notifier.GetPopularProductToday().then(function (productMessage) {
            const speechOutput = NOTIFICATION_MESSAGE + productMessage;
            self.emit(":tellWithCard", speechOutput, SKILL_NAME, productMessage);
        }).catch(function (err) {
            console.log("Error fetching popular product for today :" + err);
            self.emit(":tell", "Error fetching popular product for today");
        });
    },
    "AMAZON.HelpIntent": function () {
        this.emit(":ask", HELP_MESSAGE, HELP_REPROMPT);
    },
    "AMAZON.StopIntent": function () {
        this.emit(":tell", STOP_MESSAGE);
    },
    "AMAZON.CancelIntent": function () {
        this.emit(":tell", STOP_MESSAGE);
    }
};


//Setup
exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};