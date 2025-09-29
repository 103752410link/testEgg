// app/schedule/updateCache.js
const Subscription = require('egg').Subscription;
const nodemailer = require('nodemailer');
const fs = require('fs');
const utility = require('utility');// 密码加密

class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      // 执行时间间隔
      interval: '59s',
      // 指定所有的worker（进程）都需要执行
      type: 'worker',
      // 是否禁用
      disable: true,
    };
  }
  // 定时执行的操作
  async subscribe() {
    const now = new Date();
    console.log('今天是周' + now.getDay() + '====>' + now);

    if (now.getDay() > 0 && now.getDay() < 6 && (now.getHours() == 8 || now.getHours() == 12 || now.getHours() == 17)) {
      console.log('当前时间是 ' + now.getHours() + ' 时 ' + now.getMinutes() + ' 分，当前随机打卡时间表：');

      // const time = await this.app.mysql.get('fixedTime', { uid: 0 });
      if (time) {
        console.table(time);
        let timeCurrent = now.getHours() + ':' + now.getMinutes();
        if (now.getMinutes() < 10) {
          timeCurrent = now.getHours() + ':0' + now.getMinutes();
        }
        if (timeCurrent == time.first) {
          console.log('==========>上午上班打卡✨✨✨');
          await this.emailsend('==========>上午上班打卡✨✨✨');

        } else if (timeCurrent == time.second) {
          console.log('==========>上午下班打卡✨✨✨');
          await this.emailsend('==========>上午下班打卡✨✨✨');

        } else if (timeCurrent == time.third) {
          console.log('==========>下午上班打卡✨✨✨');
          await this.emailsend('==========>下午上班打卡✨✨✨');

        } else if (timeCurrent == time.fourth) {
          console.log('==========>下午下班打卡✨✨✨');
          await this.emailsend('==========>下午下班打卡✨✨✨');
        } else {
          console.log('==========>' + timeCurrent + '不是打卡时间');
        }

      } else {
        console.log('未获取到fixed Time');
      }
    } else {
      console.log('⭐️⭐️当前时间不在需要打卡的小时时段⭐️⭐️');
    }
  }

  async insertModelLog(msg, time) {
    const now = new Date();
    const querySet = {
      avatar: '测试发邮件插入log',
      gender: 1,
      nickname: '测试发邮件插入log',
      time: now,
      token: time,
      userid: msg,
      username: now,
    };
    // const result = await this.app.mysql.insert('users', querySet);
    // if (result.affectedRows === 1) {
    //   console.log('success');
    // } else {
    //   console.log('error');
    // }
  }
  async getCurrentTime() {
    const now = new Date();
    return Math.floor(now.getTime() / 1000);
  }
  async checkSum(ttt) {
    return utility.sha1('7cbff528b093' + 'huhwidwaidwidhiida' + ttt);
  }
  getCurrentTime2() {
    const now = new Date();
    return Math.floor(now.getTime() / 1000);
  }

  async sendImage() {
    // 7 6 4 3 11
    const imageBase64 = await this.base64_encode('./app/public/7.jpg');
    // console.log('data:image/jpeg;base64,'+imageBase64);
    const encodeImageBase64 = encodeURIComponent('data:image/jpg;base64,' + imageBase64);

    // console.log(encodeImageBase64.substring(0,80));
    // console.log('data%3Aimage%2Fjpg%3Bbase64%2C%2F9j%2F4AAQSkZJRgABAQAASABIAAD%2F4QBYRX');
    // const { ctx } = this;

    // const tt = this.getCurrentTime2();
    // const name = 'testNewName'
    // const lowerTT = await (await this.checkSum(tt)).toLowerCase();
    // console.log(tt);
    // return
    // const re = await ctx.curl('https://api.netease.im/nimserver/user/create.action?accid='+name+'&name='+name,{
    //     method:'POST',
    //     headers:{'Content-Type':'text/html;charset=utf-8',
    //     'AppKey' : '3e716e03baedd1dab18b1f638f92e2f5',
    //     'CurTime' : tt,
    //     'Nonce':'huhwidwaidwidhiida',
    //     'CheckSum':lowerTT
    //     },
    //     dataType: 'json'
    // });
    // console.log(re);

    return;
    if (1) {
      const { ctx } = this;
      const re1 = await ctx.curl('http://daytime.linglong.cn/daytime/index/logs/submit_location.html', {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/javascript, */*; q=0.01',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Origin: 'http://daytime.linglong.cn',
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.26(0x18001a2b) NetType/WIFI Language/zh_CN',
          Referer: 'http://daytime.linglong.cn/daytime/index/logs/location.html',
          Cookie: 'BMAP_SECKEY=5A_fEjiyHqtMruABzTUIOZpQtUVGTajZIn6USf9uUdgAP-46Is0DIqmWkqkf-QCgLB8-QQw3jIise81-TduUXiSk1G_nsGuV_xv7W7jSxvHDaRTyqWi9QkctXfKzGxNxyV2hGZfxmwZgutlcWm_Fy_kTFxuU-f_SXu55iLh-sNE; SECKEY_ABVK=5A/fEjiyHqtMruABzTUIOWSF4TKNGRn9XHsYWp44LpE%3D; BMAP_SECKEY=5A_fEjiyHqtMruABzTUIORinARFSO4isir-C2kyyWikaQphDQCspJ7PSYzc9E_uPnQ_Epvm8UZc6NlqlR_1VzqPJ3XZ9CQO4HBiO0hsN8byibnagD83wCGNzLsENCvd9RcM6314VgrcczuD2Ud_lCnz6L1u5avNIYUfu9JwGrYk; SECKEY_ABVK=5A/fEjiyHqtMruABzTUIOWYoJZMpNhzQVtRRi5TAXfs%3D; daytime_cc_mobile_token=d663PM1NdI4f%2ClfmIpy3rxKt64UsJgRLHhukcud38izxg7wmDBcI7AVDFIGsVLoHTeDzoxkOvWY9GN4SL%2CF98yKTUDzwIhqab-hXbp6h25jJ4ktFHSsoeFbRPEG3VOx6mR0CEuBZ9tuxV0wxljhcHXGh9e-7fiaNwLsDSF2-hIEhz8mv5LpcwXu%2C1-fWOGOJpB2m1SfljcTIjvKJ--Aql1X6qwEmdh%2Cp63zrdzafEjadezUucvEpTnDESYCgsHttUo4XC5cu80cnrwGUgtqZxI3XbDLek27IxvmMpnpK65oG5wDbhPS5ivzVngucPw; PHPSESSID=fuvjtl6jumhs1vhrh6qeite3h1',
        },

        dataType: 'json',
        data: {
          latitude: 36.60257286105444,
          longitude: 117.04338011597096,
          accuracy: 52.331138610839844,
          logphoto: encodeImageBase64,
          isauditing: 0,
          networktype: 'wifi',
          address: '%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E5%9B%BD%E5%AE%B6%E5%A4%A7%E5%AD%A6%E7%A7%91%E6%8A%80%E5%9B%AD%E9%99%84%E8%BF%91%EF%BC%88%E6%B5%8E%E5%8D%97%E5%B8%82%E5%B8%82%E4%B8%AD%E5%8C%BA%E5%85%B4%E4%BB%B2%E8%B7%AF%E5%B1%B1%E4%B8%9C%E4%B8%AD%E8%83%9C%E7%9F%B3%E6%B2%B9%E7%AC%AC8%E5%8A%A0%E6%B2%B9%E7%AB%99%E4%B8%9C%E4%BE%A7%E7%BA%A6200%E7%B1%B3%EF%BC%89',
        },
      });

      console.log(re1);
    }

  }

  async base64_encode(file) {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString('base64');
  }
  async UrlDecode(zipStr) {
    let uzipStr = '';
    for (let i = 0; i < zipStr.length; i += 1) {
      const chr = zipStr.charAt(i);
      if (chr === '+') {
        uzipStr += ' ';
      } else if (chr === '%') {
        const asc = zipStr.substring(i + 1, i + 3);
        if (parseInt('0x' + asc) > 0x7f) {
          uzipStr += decodeURI('%' + asc.toString() + zipStr.substring(i + 3, i + 9).toString());
          i += 8;
        } else {
          uzipStr += AsciiToString(parseInt('0x' + asc));
          i += 2;
        }
      } else {
        uzipStr += chr;
      }
    }
    return uzipStr;
  }

  async emailsend(msg) {
    // this.sendImage();
    return;
    const { ctx } = this;

    // 封装发送者信息
    const transporter = nodemailer.createTransport({
      service: 'qq', // 调用qq服务器
      secureConnection: true, // 启动SSL
      port: 465, // 端口就是465
      auth: {
        user: '103752410@qq.com', // 账号
        pass: 'fwvjiygrmoozbgid', // 授权码,
      },
    });

    // 邮件参数及内容
    const mailOptions = {
      from: '103752410@qq.com', // 发送者,与上面的user一致
      to: '103752410@qq.com', // 接收者,可以同时发送多个,以逗号隔开
      subject: msg, // 标题
      text: '测试内容', // 文本
      html: '<h2>你需要打卡了，请注意不要忘记打卡:</h2><a class="elem-a" href="https://www.google.com"><span class="content-elem-span">测试链接</span></a>',
    };
    await transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
    transporter.close();
  }
}
module.exports = UpdateCache;

