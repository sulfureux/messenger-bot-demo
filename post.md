Meow~
.__.
Chào các bạn.
Bài này mình sẽ hướng dẫn tạo 1 Msg(Messenger) Bot bằng Nodejs nhé.
Trong bài sẽ sử dụng:
* [ngrok](https://ngrok.com/) ([...] ”I want to expose a local server behind a NAT or firewall to the internet.”)
* [npm](https://www.npmjs.com/) (npm is the package manager for JavaScript)
* [request (npm)](https://www.npmjs.com/package/request) (Simplified HTTP request client.)
* [config (npm)](https://www.npmjs.com/package/config) (Configuration control for production node deployments)
* [nodemon (npm)](https://www.npmjs.com/package/nodemon) ([...] if any files change, nodemon will automatically restart your node application [...])

Bài này sẽ mặc định các bạn đã biết xài những thứ trên nhé. Meow~
Mọi thông tin chi tiết đều nằm trong
https://developers.facebook.com/docs/messenger-platform/

#Bắt đầu nha.
##Tạo 1 project.
Tạo thư mục: (tên thư mục tùy ý bạn. mình đặc là hal-msg nha)
```
$ mkdir hal-msg
$ cd hal-msg
$ npm init -y
```
Thêm các package sau:
```
$ npm install request --save
$ npm install -g nodemon
$ npm install config --save
```
###Thư mục
Cây thư mục cho project:
`
|-- config
|-- |-- default.json
|-- app.js
|-- fbbot.js
|-- first-start.js
|--  package.json
`
###Những dòng đầu tiên
Mở editor của bạn và tạo file `app.js`
Nội dung như sau:
```
"use strict";

const http = require('http');
const url = require('url');
const config = require('config');
const request = require('request');

http.createServer(
  (req, res) => {

	res.end();

  }
).listen('1335');
console.log('Here: http://localhost:1335');
```

Chỉnh sửa file `config/default.json` :
```
{
  "appId": "ID app của bạn",
  "appSecret": "App secret của bạn",
  "pageAccessToken": "để đó tí thêm",
  "validationToken": "để đây luôn"
}
```

###Hm... lắng nghe Facebook nào :">
```
$ nodemon app.js
```
Mở 1 cửa sổ `bash` hoặc `cmd` mới và:
```
$ ngrok http 1335
```
###Xem địa chỉ web
Vô... http://localhost:4040/inspect/http

![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/Capture4PNG.PNG_3tjp2jdozy)

Copy `https` url. Lưu ý là `https` nha. Mà copy hay để đó cũng được. tý mở lại rồi copy. Tí mình sẽ nói chỗ paste cái link này. hí hí.

## Tạo ứng dụng trên facebook dev.
Mở trang https://developers.facebook.com/apps/ của fb. .__.
Tạo 1 ứng dụng mới:
![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/Capture.PNG_3ccfa97k2y)

Tiếp theo, tên hiển thị: tùy ý bạn nhưng phải thêm, email liên hệ. tùy ý. Danh mục. tùy ý bạn luôn

![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/Capture1.PNG_gd4av2b5nb)

## Thêm Product
Khi vùa tạo xong ứng dụng (app).
Bạn sẽ phải thêm 2 mục sau vào app của mình để có thể tạo 1 bot app nha.

* **Messenger**
* **Webhooks**

![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/Capture2.PNG_gbmlul2hdz)

###Messenger
Messenger thì cứ next next thôi nha. Rồi nhấn thêm product thêm thêm cái Webhooks. Menu đổ xuống chọn page.
###Webhooks
![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/Untitled.png_98l3bdmuqn)

Sau đó điền cái link hồi nãy mình kêu bạn copy ở trên đó đó
Của mình là `https://5b179185.ngrok.io/` còn của bạn?

Phần mã xác minh, bạn phải điều **1 mã ngẫu nhiên của bạn**, bạn **ghi gì cũng được** nhé. Phần này app của bạn sẽ xác minh với facebook là chạy đúng app của bạn. Phần này sẽ được config trong app của bạn.

Còn phần trường (field). Bạn stick như mình stick nhé. **Khoan nhấn xác minh và lưu**.
Mở lại Editor và đọc tiếp phần dưới.

![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/Capture6.PNG_5p3o2ms3z0)

####Khoan nhấn xác minh và lưu

Mở lại file và chỉnh sửa file `config/default.json` :
```
{
  "appId": "đã thêm hồi nãy ở trên rồi nhá, chưa thêm thì kéo lên coi lại .__.",
  "appSecret": "meow~",
  "pageAccessToken": "để đó tí thêm",
  "validationToken": "Paste cái mã xác minh vô đây nè."
}
```
Okie `save` file này lại, vẫn **chưa được mở tab nhấn xác minh và lưu** nhé. Làm tiếp bước sau:

#Code thật sự
## Xác minh ứng dụng

Mình sẽ chỉ sử dụng nodejs và các package của nó cũng như các package mình đã thêm ở trên nhé. **Không sử dụng express**. Lí do: thích :"> (hihi.  vì thích sử dụng module có sẳn của `nodejs`)

Mở file `app.js`, thêm vào như sau:
```
//[...]

http.createServer(
  (req, res) => {
    let urlObj = url.parse(req.url, true);

    if (urlObj.pathname === '/webhook/') {
      //GET
      if (req.method === 'GET') {
        //Verfy
        if (urlObj.query['hub.verify_token'] == config.validationToken) {
          res.end(urlObj.query['hub.challenge']);
        } else {
          res.statusCode = 403;
        }
      }
      //END-GET
    } else {
      res.statusCode = 404;
    }

    res.end();
  }
).listen('1335');

//[...]
```

Bật lại tab hồi nãy rồi nhấn **xác minh và lưu**
**Okie, lưu được hết mà không bị lỗi gì mới là okie nha**
Xong, ... tèn ten. Giờ là coi như tạm ổn. Facebook và app đã kết nối được với nhau.

## Lấy access token của page
Mở lại tab developer facebook nào, sau đó nhấn vô Messenger bên sidebar bên trái nhé.
Rồi, chọn 1 trang và lấy mã truy cập, `copy` mã đó sau đó nhấn và chọn trang phía dưới và nhấn nút subcribe kế bên:
![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/Capture7.PNG_8qpnl6f38f)

Mã truy cập này mở file `config/default.json` và save lại trong phần **"pageAccessToken"** Vậy lúc này file `default.json` đã đầy đủ 4 field rồi nha.

Rồi rồi. giờ qua `lý thuyết` thôi. meow~
#Lý thuyết
Thực hành xong rồi, giờ mình bắt đầu phần lý thuyết nhé!
##Request và response

Mình tạm gọi **tin nhắn** được gửi **từ khách hàng vô page** hoặc chính chúng ta, các developer gửi tin vô page của mình là `request` nhé!

Còn tin nhắn mà app gửi lại khách hàng là `respone`

###Request

Cấu trúc **đầy đủ** của một **request object** là như sau (đương nhiên là sẽ chẳng bao giờ đầy đủ, các bạn đừng thắc mắc tại sao request lại không đầy đủ như vầy. Đơn giản là có từng loại tin nhắn riêng, hị hị! Còn như thế nào thì sau cái đầy đủ này đã. Hình dung sơ bộ nhé):

```
{
  object: 'page',
  entry: [{
    id: 'PAGE_ID',
    time: 1469004381054,
    messaging: [{
      sender: { id: '1143639809025650'  },
      recipient: { id: 'PAGE_ID' },
      timestamp: 1469004604162,
      message: {
        is_echo: true,
        mid: 'mid.1469004604155:6821a858136cb6cf33',
        seq: 651,
        text: 'Nội dung tin nhắn mà khách hàng gửi',
        sticker_id: 657500007666590,
        attachments: [{
          type: 'image',
          payload: {
            url: 'https://scontent.xx.fbcdn.net/t39.1997-6/p100x100/10956886_789355404486707_112462968_n.png?_nc_ad=z-m'
          }
        }]
      },
      delivery: {
        mids: 'mid.1469005689002:983d4494c45cdab225',
        watermark: 1469005039470,
        seq: 661
      },
      read: {
        watermark: 1469005039470,
        seq: 662
      },
      postback: {
        payload: 'HELP'
      },
      optin: {
        ref: 'FB_MAIN_WEB_BTN'
      }
    }]
  }]
}

```
Rồi nha, giờ mình giải thích đây.
Facebook luôn luôn gửi 1 `request` tới app của ta
với kiểu:
```
{
  object: 'page',
  entry: [{
    id: 'PAGE_ID',
    time: 1469004381054,
    messaging: [{
      sender: { id: '1143639809025650'  },
      recipient: { id: 'PAGE_ID'  },
      timestamp: 1469004604162,

      //hello

  	}]
  }]
}
```
Ê nè? Thấy chữ **hello** hem? Okie rồi đó. Chỗ đó sẽ là 1 trong các object nhỏ, sau:
* **message**
* **delivery**
* **read**
* **postback**
* **optin**

####Từng trường hợp
Nhìn nó 1 nùi chứ thật ra chia làm các trường hợp như sau
#####message
Trường hợp này là khi người dùng gửi 1 **đoạn text, emoticon, 1 sticker, 1 trang thái của tin nhắn, hoặc 1 quick_reply**
Ở đây mình chỉ quan tâm tới 1 đoạn **text**  và **quick_reply** thôi nhé.

**Text**
Người dùng gửi 1 tin nhắn:
```
 {
  object: 'page',
  entry: [{
    id: 'PAGE_ID',
    time: 1469004381054,
    messaging: [{
      sender: { id: '1143639809025650' },
      recipient: { id: 'PAGE_ID' },
      timestamp: 1469004604162,
      message: {
        is_echo: true,
        mid: 'mid.1469004604155:6821a858136cb6cf33',
        seq: 651,

        text: 'Nội dung tin nhắn mà khách hàng gửi',

     }]
  }]
}
```

**Quick_reply**
Quick reply là sao? Là khi mình gửi cho người dùng 1 dòng và có 1 số câu trả lời nhanh kèm theo, ngta nhấn vô mấy cái cục đó thì fb sẽ gửi 1 req có quick_reply cho mình. Không nói dông dài gì chứ demo nè:

![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/13709480_1621927208097371_1706756087_o.png_j2eybtm3n4)

Khi người dùng nhấn vô mấy cái chọn chọn đỏ vàng xanh đó thì mình sẽ nhận được 1 req như sau:
```
{
  object: 'page',
  entry: [{
    id: 'PAGE_ID',
    time: 1469004381054,
    messaging: [{
      sender: { id: '1143639809025650' },
      recipient: { id: 'PAGE_ID' },
      timestamp: 1469004604162,

      message: {
        is_echo: true,
        mid: 'mid.1469004604155:6821a858136cb6cf33',
        seq: 651,

        text: 'Nội dung tin nhắn mà khách hàng gửi',

        quick_reply: {
          payload: "PAYLOAD_DUOC_GOI"
        }

      }
    }]
  }]
}
```
Còn tạo cái `response` `quick_reply` làm sao thì mình nói ở dưới phần res nhé.

#####postback
Thay vì message, thì postback là cái mà mình sẽ nhận khi mình gửi 1 `genetic` cho `user` thì ngta nhấn vô mấy cái button sẽ gọi postback về app mình ớ >.< Mà nói gửi gửi res nãy giờ khó chịu quá đi. Xong cái `req` này mình demo luôn gửi res nhé.
```
{
  object: 'page',
  entry: [{
    id: 'PAGE_ID',
    time: 1469004381054,
    messaging: [{
      sender: {"id": "USER_ID"},
      recipient: {"id": "PAGE_ID"},
      timestamp: 1458692752478,

      postback: {
        "payload": "USER_DEFINED_PAYLOAD"
      }

    }]
  }]
}
```
#####optin
Phần này được `req` khi mà bạn có 1 msg button ở trang web và ngta nhấn vô thì gọi về app của bạn:

![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/Capture9.PNG_tpfenjoqit)

```
{
  object: 'page',
  entry: [{
    id: 'PAGE_ID',
    time: 1469004381054,
    messaging: [{
      sender: { id: '1143639809025650' },
      recipient: { id: 'PAGE_ID' },
      timestamp: 1469039706825,

      optin: {
        ref: 'FB_MAIN_WEB_BTN'
      }

    }]
  }]
}
```

#####Chốt
Cấu trúc luôn luôn à
```
object -> entry (array) -> messaging (array)
```
và messaging luôn có
```
sender: { id: '1143639809025650' },
recipient: { id: 'PAGE_ID' },
timestamp: 1469039706825,
```
Các bạn có thấy là, chỉ có phần nội dung bên trong `messaging` thay đổi cấu trúc thôi phải không. Vậy mình sẽ bắt `req` như sau:

Chỉnh sửa file `app.js`

```
http.createServer(
  (req, res) => {
    let urlObj = url.parse(req.url, true);

    if (urlObj.pathname === '/webhook/') {
      //GET
      if (req.method === 'GET') {
        //Verfy
        if (urlObj.query['hub.verify_token'] == config.validationToken) {
          res.end(urlObj.query['hub.challenge']);
        } else {
          res.statusCode = 403;
        }
      }
      //END-GET


      if (req.method === 'POST') {
        let body = [];

        req.on('data', (chunk) => {

          body.push(chunk);

        }).on('end', () => {

          body = Buffer.concat(body).toString();
          body = JSON.parse(body);

          // Xử lý req từ đây.
          if (body.object === 'page') {

            body.entry.forEach(pageEntry => {

              let pageId = pageEntry.id; //nếu bạn có nhiều page xài chung 1 app. Tự thêm xử lý bằng cách bắt pageId này nhé.
              let timeOfEvent = pageEntry.time;

              pageEntry.messaging.forEach(msg => {

                /*
                * msg chính là (chỉ chỉ xuống dưới 2 dòng), trong đây chúng ta sẽ phân loại và xử lý.
                *
                  messaging: [{
                    sender: { id: '1143639809025650' },
                    recipient: { id: 'PAGE_ID' },
                    timestamp: 1469039706825,

                    abc

                  }]
                * msg == messaging
                */

                // Ở đây mình dùng 1 function nhé

                kipalog(msg);

              });

            });
          }
        });

      }

    } else {
      res.statusCode = 404;
    }

    res.end();
  }
).listen('1335');
console.log('Ứng dụng đang chạy tại: http://localhost:1335');

function kipalog(msg) {

}
```

Và phân loại loại msg:

```
function kipalog(msg) {

  var reqId = msg.sender.id;

  if (msg.optin) {

  } else if (msg.message) {

  } else if (msg.delivery) {

  } else if (msg.postback) {

  } else if (msg.read) {

  } else {
    console.log("Webhook received unknown messagingEvent: ", msg);
  }

}
```

###Response

####Text
Gửi text cho user:
```
{
  text: "nội dung"
}
```
####Button
![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/13728390_1622071261416299_2021282390_o.jpg_6l9khr0yyy)
```
{
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
}
```
Các bạn lưu ý là button có 2 loại, là url và payload nhé. Payload sẽ gọi về cái msg.postback mà mình vừa bắt ở trên phần `req` đó.
* mảng **buttons** giới hạn 3 phần tử

####Geniric
![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/13717917_1622070311416394_128364427_o.jpg_mqm3z9pnx8)
```
{
  attachment: {
    type: "template",
    payload: {
      template_type: "generic",
      elements: [{
        title: "Kipalog",
        image_url: "http://railsgirls.com/images/kipalog.png",
        subtitle: "Hello mọi người",
        buttons: [{
          type: "web_url",
          url: "http://kipalog.com/",
          title: "Kipalog site"
        }, {
          type: "postback",
          title: "Start Chatting",
          payload: "USER_DEFINED_PAYLOAD"
        }]
      }]
    }
  }
}
```
* **elements** có thể chứa 10 phần tử.
* **buttons** thì 3

####quick_reply
![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/13709480_1621927208097371_1706756087_o.png_7suvks1zv6)
```
{
  text: "Pick a color:",
  quick_replies: [{
    content_type: "text",
    title: "Red",
    payload: "POSTBACK_PICK_RED"
  }, {
    content_type: "text",
    title: "Green",
    payload: "POSTBACK_PICK_GREEN"
  }]
}
```

####Kết hợp giữa generic và quick_reply
![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/13694230_1622072428082849_1009125037_o.jpg_vcv1xjmr2m)

##App thật sự

Bạn mở file `fbbot.js`
Và thêm vào nội dụng sau:
```
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

```
Sau đó mở file `app.js`

Và thêm
```
var fbbot = require('./fbbot.js').fbbot;
var bot = new fbbot();
```
là:
```
"use strict";

const http = require('http');
const url = require('url');
const config = require('config');
const request = require('request');
var fbbot = require('./fbbot.js').fbbot;
var bot = new fbbot();

http.createServer(

// [...]
```

Sau đó mở file `first-start.js`

Thêm vào đoạn sau đây:

```
const fbbot = require('./fbbot.js').fbbot;
var bot = new fbbot();
bot.createGetStartedBtn('GET_STARTED_BUTTON');
```

Việc tiếp theo là chạy `first-start.js` bằng cách mở 1 cửa sổ bash mới và:
```
$ node first-start.js
```
Việc này là để tạo nút Btn 'Bắt đầu' này nè:

![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/13728354_1622074701415955_2081399031_o.jpg_ctb8nkaod9)

### App.
Bây giờ là việc của việc phối làm giữa req và res cho hợp lý.
Ví dụ 1 app đơn giản:
Giờ mình nghe `msg` với `payload` và trả về một số loại `res` nha


Rồi giờ chỉ cần sửa lại `function kipalog` trong file `app.js`:
```
function kipalog(msg) {

  var reqId = msg.sender.id;
  var defaultRes = {
    text: 'Chào mừng bạn đã đến với Demo Bot của mềnh, nhắn tin cho mình một trong các nội dung sau (text, generic, button, quick_reply) để lấy mẫu demo nhé, hoặc là click vào nút bên dưới:',
    quick_replies: [{
      "content_type": "text",
      "title": "Text",
      "payload": "QR_PICK_TEXT"
    }, {
      "content_type": "text",
      "title": "Generic",
      "payload": "QR_PICK_GENERIC"
    }, {
      "content_type": "text",
      "title": "Button",
      "payload": "QR_PICK_BTN"
    }, {
      "content_type": "text",
      "title": "Quick reply",
      "payload": "QR_PICK_QUICKREPLY"
    }]
  }

  var defaultText = {
    text: "Đây là 1 đoạn tin nhắn"
  }
  var defaultGeneric = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [{
          title: "Kipalog",
          image_url: "http://railsgirls.com/images/kipalog.png",
          subtitle: "Hello mọi người",
          buttons: [{
            type: "web_url",
            url: "http://kipalog.com/",
            title: "Kipalog site"
          }, {
            type: "postback",
            title: "Bắt đầu lại",
            payload: "HELP"
          }]
        }]
      }
    }
  }
  var defaultBtn = {
    attachment: {
      type: "template",
      payload: {
        template_type: "button",
        text: "Đây chỉ là dòng chữ và button phía dưới",
        buttons: [{
          type: "web_url",
          url: "http://kipalog.com/",
          title: "Kipalog site"
        }, {
          type: "postback",
          title: "Bắt đầu lại",
          payload: "HELP"
        }]
      }
    }
  }
  var defaultQR = {
    text: "Pick a color:",
    quick_replies: [{
      content_type: "text",
      title: "Red",
      payload: "QR_PICK_RED"
    }, {
      content_type: "text",
      title: "Green",
      payload: "QR_PICK_GREEN"
    }]
  }


  if (msg.optin) {

    var ref = msg.optin.ref;
    if (ref) {
      switch (ref) {
        case 'FB_MAIN_WEB_BTN':
          bot.sendMsg(reqId, defaultRes);
          break;
        default:
          bot.sendMsg(reqId, defaultRes);
      }
    }

  } else if (msg.message) {
    var msgText = msg.message.text;
    if (typeof msgText === 'string') msgText = msgText.trim().toLowerCase();
    if (msg.message.hasOwnProperty('is_echo')) return;

    //Xử lý Quick Reply
    if (msg.message.quick_reply) {
      if (msg.message.quick_reply.hasOwnProperty('payload')) {
        var payload = msg.message.quick_reply.payload;
        var reg = /QR_PICK_(.*)/i;

        var regex = null;
        if (regex = reg.exec(payload)) {
          switch (regex[1]) {
            case 'RED':
              bot.sendMsg(reqId, {
                text: "Bạn đã chọn màu đỏ"
              });
              setTimeout(() => {
                bot.sendMsg(reqId, defaultRes)
              }, 700);
              break;
            case 'GREEN':
              bot.sendMsg(reqId, {
                text: "Bạn đã chọn màu xanh lá"
              });
              setTimeout(() => {
                bot.sendMsg(reqId, defaultRes)
              }, 700);
              break;
            case 'TEXT':
              bot.sendMsg(reqId, defaultText);
              break;
            case 'BTN':
              bot.sendMsg(reqId, defaultBtn);
              break;
            case 'GENERIC':
              bot.sendMsg(reqId, defaultGeneric);
              break;
            case 'QUICKREPLY':
              bot.sendMsg(reqId, defaultQR);
              break;
            default:
              setTimeout(() => {
                bot.sendMsg(reqId, defaultRes)
              }, 700);
          }
        }

      }
      return;
    }
    //Xử lý text
    switch (msgText) {
      case 'text':
        bot.sendMsg(reqId, defaultText);
        break;
      case 'generic':
        bot.sendMsg(reqId, defaultGeneric);
        break;
      case 'button':
        bot.sendMsg(reqId, defaultBtn);
        break;
      case 'quick_reply':
        bot.sendMsg(reqId, defaultQR);
        break;
      case 'quick reply':
        bot.sendMsg(reqId, defaultQR);
        break;
      default:
        bot.sendMsg(reqId, defaultRes);
    }

    return;

  } else if (msg.delivery) {

    console.log('deli');

  }
  // Xử lý payload
  else if (msg.postback) {
    var msgPayload = msg.postback.payload;

    switch (msgPayload) {
      case 'GET_STARTED_BUTTON':
        bot.sendMsg(reqId, defaultRes);
        break;
      case 'HELP':
        bot.sendMsg(reqId, defaultRes);
        break;
      default:
        bot.sendMsg(reqId, defaultRes);
    }


  } else if (msg.read) {

    console.log('read');

  } else {
    console.log("Webhook received unknown messagingEvent: ", msg);
  }

}
```
Vậy là xong 1 con bot đơn giản rồi đó.
Và thật ra là còn rất nhiều chức năng...Mới mấy bữa trước còn chưa thấy. Hôm nay vô lại để viết bài này thì thấy trên facebook có thê phần
>**Messenger Expression**
Let people on Messenger express themselves more creatively through your app.

Rồi, hứa hẹn sẽ có nhiều điều hấp dẫn lắm đây....
