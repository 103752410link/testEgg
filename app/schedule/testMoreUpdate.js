const fs = require('fs');

async function task2(ctx) {
  //   const res = await ctx.curl('http://www.api.com/cache', {
  //     dataType: 'json',
  //   });
  //   ctx.app.cache = res.data;
  console.log(Date() + ':::::::::::::::::定时任务:222显示时间::::::::::::::::::');
  // directory path
  const dir = './';
  console.log(dir);
  // list all files in the directory
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.log(err);

      throw err;
    }
    console.log(files.length);

    // files object contains all files names
    // log them on console
    files.forEach(file => {
      console.log(file);
    });
  });
}
setLL = function() {
  console.log('Hello');
};
module.exports = {
  schedule: {
    interval: '10s', // 1 分钟间隔
    type: 'all', // 指定所有的 worker 都需要执行
    disable: true,
  },
  setRLF() {
    console.log('Hello');
  },
  async getRLF() {
    console.log('Hello');
  },
  async task(ctx) {
    //   const res = await ctx.curl('http://www.api.com/cache', {
    //     dataType: 'json',
    //   });
    //   ctx.app.cache = res.data;
    console.log(Date() + ':::::::::::::::::定时任务:显示时间::::::::::::::::::');
    // setLL();
    // task2(ctx);
  },

};
