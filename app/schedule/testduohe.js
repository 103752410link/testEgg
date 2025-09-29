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
    cron: '0,30 */1 * * * *', // 秒 分 时 日 月 星期几（0-7 0or7 都是周日） *代表全部
    type: 'worker',
    disable: true,
  },
  async task(ctx) {

    const time1 = Math.floor(Math.random() * 8 + 1);
    const time2 = Math.floor(Math.random() * 8 + 1);
    const time3 = Math.floor(Math.random() * 15 + 32);
    const time4 = Math.floor(Math.random() * 15 + 35);

    const now = new Date();
    console.log('今天是周' + now.getDay() + '====>' + now);

    const querySet = {
      first: '8:0' + time1,
      second: '12:0' + time2,
      third: '12:' + time3,
      fourth: '17:' + time4,
      updateTime: now,
    };

    // const result = await ctx.app.mysql.insert('fixedTime', querySet);
    // if (result.affectedRows === 1) {
    //   console.log('insert fixedTime success');
    // } else {
    //   console.log('insert fixedTime error');
    // }
  },
};
