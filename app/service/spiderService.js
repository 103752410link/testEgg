const Service = require('egg').Service;

class spiderService extends Service {
  async getData(page) {
    const url = 'http://www.zhipin.com/c101280100-p100901';
    // url = url + '?page='+page+'&ka=page-'+page;
    const result = await this.ctx.curl(url,
      { dataType: 'text' }
    );
    return result;
  }
  // getBaiduHomePage() {
  // 	let data = yield new Promise((resolve, reject)=> {
  //     	require('request').get('http://www.baidu.com', function (err, res, data) {
  //         if (err) return reject(err);
  //         	return resolve(data);
  //     	})
  // 	});
  // 	return data;
  // }
}

module.exports = spiderService;
