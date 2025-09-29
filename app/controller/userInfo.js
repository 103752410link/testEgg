'use strict';
const { Controller } = require('egg');

class UserInfoController extends Controller {
  async getInfo() {
    // const dataList = await this.data();
    this.ctx.status = 200;
    this.ctx.body = {
      status: 0,
      message: 'success',
      // data:dataList
    };
  }

  async body() {
    const { ctx } = this;

    ctx.body = {
      type: ctx.get('content-type'),
      body: ctx.request.body,
    };
  }

  async xml() {
    const { ctx } = this;

    const body = {
      status: 0,
      message: 'success',
    };

    ctx.body = {
      type: ctx.get('content-type'),
      body,
    };
  }

  async data() {
    return [
      { userid: '1',
        hxusername: 'user1',
        username: 'rose1',
        gender: '1',
        avatar: 'https://i.loli.net/2019/05/20/5ce26578e0e5549312.png',
        nickname: 'rose1',
        token: '',
        mobilephone: '18010181051',
        status: '',
      },
      { userid: '2',
        hxusername: 'user2',
        username: 'rose2',
        gender: '1',
        avatar: 'https://i.loli.net/2019/05/20/5ce26578e0e5549312.png',
        nickname: 'rose2',
        token: '',
        mobilephone: '18010181051',
        status: '',
      },
      { userid: '3',
        hxusername: 'user3',
        username: 'rose3',
        gender: '1',
        avatar: 'https://i.loli.net/2019/05/20/5ce26578e0e5549312.png',
        nickname: 'rose3',
        token: '',
        mobilephone: '18010181051',
        status: '',
      },
      { userid: '4',
        hxusername: 'user4',
        username: 'rose4',
        gender: '1',
        avatar: 'https://i.loli.net/2019/05/20/5ce26578e0e5549312.png',
        nickname: 'rose4',
        token: '',
        mobilephone: '18010181051',
        status: '',
      },
      { userid: '5',
        hxusername: 'user5',
        username: 'rose5',
        gender: '1',
        avatar: 'https://i.loli.net/2019/05/20/5ce26578e0e5549312.png',
        nickname: 'rose5',
        token: '',
        mobilephone: '18010181051',
        status: '',
      },
    ];
  }
}

module.exports = UserInfoController;
