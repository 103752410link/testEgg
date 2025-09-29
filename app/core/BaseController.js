const { Controller } = require('egg');
class BaseController extends Controller {

  async success(data) {
    this.ctx.body = {
      success: true,
      data,
    };
  }

  async notFound(msg) {
    msg = msg || 'not found';
    // this.ctx.throw(404, msg);
    // this.ctx.body = {
    //   success: false,
    //   message:msg,
    // };
    await this.ctx.render('404', {
    });
  }
}
module.exports = BaseController;
