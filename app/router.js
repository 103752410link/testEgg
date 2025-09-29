'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/email', controller.home.email);
  router.get('/2019', controller.home.year);
  router.post('/emailsend', controller.home.emailsend);
  router.get('/2000', controller.home.population2000);
  router.get('/2010', controller.home.population2010);
  router.get('/2020', controller.home.population2020);
  router.get('/2030', controller.home.population2030);
  router.post('/userInfo', controller.userInfo.getInfo);
  router.post('/requestback', controller.userInfo.body);
  router.post('/friends', controller.userInfo.xml);
  router.get('/login', controller.login.index);
  router.post('/login', controller.login.login);
  router.get('/logout', controller.login.logout);
  router.get('/register', controller.login.register);
  router.post('/register', controller.login.registerUser);
  router.get('/reset-password', controller.login.resetPasswordPage);
  router.post('/api/forgot-password', controller.login.forgotPassword);
  router.post('/api/reset-password', controller.login.resetPassword);

  router.get('/privacy', controller.home.privacy);
  router.get('/holiday', controller.home.holidayPage);
  router.get('/api/holiday', controller.home.holidayApi);
  router.get('/files', controller.home.filesPage);
  router.post('/api/upload', controller.home.uploadFile);
  router.get('/api/files', controller.home.getFiles);
  router.get('/download/:filename', controller.home.downloadFile);
  router.delete('/api/files/:filename', controller.home.deleteFile);
  router.get('/files/:username/:filename', controller.home.serveFile);
  router.get('/baxiaxia', controller.home.baxiaxiaPage);

  // 健康检查路由
  router.get('/health', controller.health.check);
  router.get('/api/health', controller.health.check);
  router.get('/api/info', controller.health.info);
};
