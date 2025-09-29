module.exports = {
  schedule: {
    //  *    *    *    *    *    *
    //  ┬    ┬    ┬    ┬    ┬    ┬
    //  │    │    │    │    │    |
    //  │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
    //  │    │    │    │    └───── month (1 - 12)
    //  │    │    │    └────────── day of month (1 - 31)
    //  │    │    └─────────────── hour (0 - 23)
    //  │    └──────────────────── minute (0 - 59)
    //  └───────────────────────── second (0 - 59, optional)
    cron: '0 59 */1 * * *', // 秒 分 时 日 月 星期几（0-7 0or7 都是周日） *代表全部
    type: 'worker',
    disable: true,
  },
  async task(ctx) {
    //   const res = await ctx.curl('http://www.api.com/cache', {
    //     dataType: 'json',
    //   });
    //   ctx.app.cache = res.data;
    const time1 = Math.floor(Math.random() * 8 + 1);
    const time2 = Math.floor(Math.random() * 8 + 1);
    const time3 = Math.floor(Math.random() * 15 + 32);
    const time4 = Math.floor(Math.random() * 15 + 35);

    console.log(':::::::::::::::::定时任务随机上午上班 fixTime 8:0' + time1 + '::::::::::::::::::');
    console.log(':::::::::::::::::定时任务随机上午下班 fixTime 12:0' + time2 + '::::::::::::::::::');
    console.log(':::::::::::::::::定时任务随机下午上班 fixTime 12:' + time3 + '::::::::::::::::::');
    console.log(':::::::::::::::::定时任务随机下午下班 fixTime 17:' + time4 + '::::::::::::::::::');

    // const result = await ctx.app.mysql.select('fixedTime', {
    //   // columns: ['id', 'name'], //查询字段，全部查询则不写，相当于查询*
    //   where: {
    //     uid: 0,
    //   }, // 查询条件
    //   // orders: [
    //   //     ['id', 'desc'] //降序desc，升序asc
    //   // ],
    //   // limit: 10, //查询条数
    //   // offset: 0 //数据偏移量（分页查询使用）
    // });
    const now = new Date();
    const querySet = {
      first: '8:0' + time1,
      second: '12:0' + time2,
      third: '12:' + time3,
      fourth: '17:' + time4,
      updateTime: now,
    };
    if ((result.length) > 0) {
      // const result = await ctx.app.mysql.update('fixedTime', querySet, { where: {
      //   uid: 0,
      // } });
      // if (result.affectedRows === 1) {
      //   console.log('update fixedTime success');
      // } else {
      //   console.log('update fixedTime error');
      // }
    } else {
      // const result = await ctx.app.mysql.insert('fixedTime', querySet);
      // if (result.affectedRows === 1) {
      //   console.log('insert fixedTime success');
      // } else {
      //   console.log('insert fixedTime error');
      // }
    }

  },
};
