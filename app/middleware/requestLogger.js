'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;

    const method = ctx.method;
    const url = ctx.url;
    const ip = ctx.ip;

    // 只记录重要请求，跳过静态资源和健康检查
    const shouldLog = !url.startsWith('/public/') && 
                     !url.startsWith('/favicon.ico') &&
                     !url.includes('.css') && 
                     !url.includes('.js') &&
                     !url.includes('.jpg') && 
                     !url.includes('.png') &&
                     !url.includes('.gif');

    if (shouldLog) {
      const coloredMethod = `\x1b[32m[${method}]\x1b[0m`;
      const coloredUrl = `\x1b[36m${url}\x1b[0m`;
      const coloredIp = `\x1b[33m${ip}\x1b[0m`;
      const coloredStatus = `\x1b[35m${ctx.status}\x1b[0m`;
      const coloredDuration = `\x1b[34m${duration}ms\x1b[0m`;

      // 简化日志输出，只记录关键信息
      console.log(`${coloredMethod} ${coloredUrl} - ${coloredIp} - ${coloredStatus} ${coloredDuration}`);
    }
  };
};