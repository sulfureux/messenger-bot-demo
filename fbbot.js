const request = require('request');

class fbbot {
  constructor() {
    this.msgApi = 'https://graph.facebook.com/v2.6/me/messages';
    this.settingApi = 'https://graph.facebook.com/v2.6/me/thread_settings';
    this.config = require('config');
  }

  /*
  * return 'TEXT', 'POSTBACK', 'OPTIN', 'DELIVERY'
  */
  typeofMsg(msg) {

  }

  sendMsg(id, json, type = 'TEXT') {
    var msgData = {
      recipient: {
        id: id
      },
      message: json
    }

    this.callSendAPI(msgData, type);
  }

  /*SETTING*/

  createGetStartedBtn(defaultPayload) {
    if(!defaultPayload) {
      var defaultPayload  = 'GET_STARTED_BUTTON';
    }
    var setting = true;

    var json = {
      "setting_type": "call_to_actions",
      "thread_state": "new_thread",
      "call_to_actions": [{
        "payload": defaultPayload
      }]
    }

    this.callSendAPI(json, 'setting', true);
  }

  deleteGetStartedBtn() {
    var setting = true;

    var json = {
      "setting_type": "call_to_actions",
      "thread_state": "new_thread"
    }

    this.callSendAPI(json, 'setting', true, 'DELETE');
  }

  /* SEND */

  callSendAPI(messageData, type = 'generic', setting = false, method = 'POST') {

    var reqUrl = this.msgApi;
    if (setting) reqUrl = this.settingApi;

    request({
      uri: reqUrl,
      qs: {
        access_token: this.config.pageAccessToken
      },
      method: method,
      json: messageData
    }, (error, response, body) => {

      if (!error && response.statusCode == 200) {

        var reportStr = "Successfully sent %s message";
        if (setting) reportStr += " with id %s to recipient %s";
        else {
          var recipientId = body.recipient_id;
          var messageId = body.message_id;
        }

        console.log(reportStr, type, messageId, recipientId);

      } else {

        console.error("Unable to send message.");
        console.error(error);

      }
    });
  }
}

exports.fbbot = fbbot;
