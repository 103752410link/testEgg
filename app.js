// server.js
// const egg = require('egg');

const ProcessManager = require('./app/core/processManager');

module.exports = app => {
  // 开始前执行
  app.beforeStart(async () => {
    app.logger.info('Application starting...');
  });

  // 准备好执行
  app.ready(async () => {
    app.logger.info('Application ready');
    
    // 初始化进程管理器
    app.processManager = new ProcessManager(app);
    
    // // 举例，获取数据库图片域名，放到缓存，便于使用
    // let db = app.mysql;
    // let result = await db.select('config');
    // app.imgURL = result[0].imgURL;
  });

  // 关闭前执行
  app.beforeClose(async () => {
    app.logger.info('Application closing...');
    
    // 清理资源
    try {
      // 这里可以添加数据库连接关闭、缓存清理等逻辑
      app.logger.info('Resources cleaned up successfully');
    } catch (error) {
      app.logger.error('Error during cleanup:', error);
    }
  });
};
