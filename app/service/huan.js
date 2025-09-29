const Service = require('egg').Service;
const utility = require('utility');// 密码加密
class HuanService extends Service {
  async token() {
    const { ctx } = this;
    const re = await ctx.curl('a1.easemob.com/1121191202010125/newapp/token?grant_type=client_credentials&client_id=YXA6cMNt-oFoQNG5yR9GdAEKtg&client_secret=YXA6eknxzhQ32-FBe4pZzFuPgHrgEcA', {
      headers: 'Content-Type:application/json',
      dataType: 'json',
    });
    return re;
  }
  async tokenNetEase() {
    const { ctx } = this;
    const query = ctx.request.body;
    const name = query.nickname;
    const gender = query.gender;
    // const avatar = query.avatar;
    if (!name) throw new Error('新增用户：用户名不能为空!');
    if (!gender) throw new Error('新增用户：性别不能为空!');
    // if (!avatar) throw new Error('新增用户：用户名不能为空!');

    const tt = this.getCurrentTime();
    // return tt;
    const re = await ctx.curl('https://api.netease.im/nimserver/user/create.action?accid=' + name + '&name=' + name,
      {
        method: 'POST',
        headers: { 'Content-Type': 'text/html;charset=utf-8',
          AppKey: '3e716e03baedd1dab18b1f638f92e2f5',
          CurTime: tt,
          Nonce: 'huhwidwaidwidhiida',
          CheckSum: this.checkSum(tt).toLowerCase(),
        },
        dataType: 'json',
      });
    return re;
  }
  checkSum(ttt) {
    return utility.sha1('7cbff528b093' + 'huhwidwaidwidhiida' + ttt);
  }
  getCurrentTime() {
    const now = new Date();
    return Math.floor(now.getTime() / 1000);
  }
}
module.exports = HuanService;
