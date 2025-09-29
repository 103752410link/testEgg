/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1575868834449_7050';

  // 配置日志路径和级别
  config.logger = {
    dir: path.join(appInfo.baseDir, 'logs'),
    level: 'WARN', // 只记录WARN及以上级别日志，减少ERROR日志
    consoleLevel: 'INFO',
    // 日志轮转配置
    rotateLogDirs: true,
    maxFileSize: '10MB', // 减小单个日志文件大小
    maxFiles: 5, // 保留更多日志文件
    // 错误日志特殊配置
    errorLogName: 'common-error.log',
    // 防止日志爆炸的配置
    buffer: true,
    flushInterval: 1000, // 1秒刷新一次
  };

  // 配置集群客户端超时，减少连接超时错误
  config.cluster = {
    listen: {
      port: 7002,
      hostname: '127.0.0.1',
    },
  };

  // 配置集群客户端连接参数
  config.clusterClient = {
    maxIdleTime: 30000, // 减少空闲超时时间到30秒
    responseTimeout: 10000, // 响应超时时间10秒
    retryPolicy: {
      retries: 2, // 减少重试次数
    },
  };

  // 优雅关闭配置
  config.cluster = {
    ...config.cluster,
    // 优雅关闭超时时间
    gracefulTimeout: 10000, // 10秒
    // 优雅关闭时是否拒绝新连接
    gracefulClose: true,
  };

  // add your middleware config here
  config.middleware = ['errorHandler', 'requestLogger'];

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks', // 左边写成.html后缀，会自动渲染.html文件
    },
  };

  // config.mysql = {
  //   // database configuration
  //   client: {
  //     // host
  //     host: 'doudouliu.asuscomm.com',
  //     // port
  //     port: '3010',
  //     // username
  //     user: 'root',
  //     // password
  //     password: '123456',
  //     // database
  //     database: 'myLogUser',
  //   },
  //   // load into app,default is open //加载到应用程序，默认为打开
  //   app: true,
  //   // load into agent,default is close //加载到代理中，默认值为"关闭"
  //   agent: false,
  // };
  config.session = {
    key: 'EGG_SESS',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: true,
  };

  config.multipart = {
    mode: 'file',
    fileSize: '500mb',
    whitelist: [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.bmp',
      '.wbmp',
      '.webp',
      '.tif',
      '.psd',
      '.svg',
      '.js',
      '.jsx',
      '.json',
      '.css',
      '.less',
      '.html',
      '.htm',
      '.xml',
      '.pdf',
      '.zip',
      '.gz',
      '.tgz',
      '.gzip',
      '.mp3',
      '.mp4',
      '.avi',
      '.mov',
      '.wmv',
      '.flv',
      '.swf',
      '.mkv',
      '.m4v',
      '.txt',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.ppt',
      '.pptx',
      '.md',
    ],
    // 允许中文文件名
    filename: filename => {
      // 移除路径分隔符和特殊字符，但允许中文
      return filename.replace(/[\\/:*?"<>|]/g, '').trim();
    },
  };
  // 数据存储路径配置
  config.dataPaths = {
    // 用户数据文件路径
    usersFile: path.join(appInfo.baseDir, '../data/users.json'),
    // 文件存储根目录
    filesRoot: path.join(appInfo.baseDir, '../data/files'),
    // 用户文件存储目录
    userFilesDir: path.join(appInfo.baseDir, '../data/files/user_files'),
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};

