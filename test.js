var fbbot = require('./fbbot.js').fbbot;
var bot = new fbbot();


bot.sendMsg('1529682313724284', {
  attachment: {
    type: "template",
    payload: {
      template_type: "button",
      text: "What do you want to do next?",
      buttons: [{
        type: "web_url",
        url: "http://kipalog.com/",
        title: "Kipalog site"
      }, {
        type: "postback",
        title: "Start Chatting",
        payload: "USER_DEFINED_PAYLOAD"
      }]
    }
  }
});


/*
  "text": "Đây là quick reply nè. Câu hỏi là. Màu bạn thích là gì? Chọn câu trả lời phía dưới.",
  "quick_replies": [{
    "content_type": "text",
    "title": "ĐỎ",
    "payload": "KIPALOG_1"
  }, {
    "content_type": "text",
    "title": "VÀNG",
    "payload": "KIPALOG_2"
  }, {
    "content_type": "text",
    "title": "XANH DƯƠNG",
    "payload": "KIPALOG_3"
  }, {
    "content_type": "text",
    "title": "XANH LÁ",
    "payload": "KIPALOG_4"
  }]
});
*/
