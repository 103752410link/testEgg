'use strict';

/**
 * 全局错误处理中间件
 * 防止未捕获的异常导致进程崩溃
 */
module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 记录错误但不让进程崩溃
      ctx.logger.error('Unhandled error:', err);
      
      // 设置响应状态
      ctx.status = err.status || 500;
      
      // 根据环境返回不同的错误信息
      if (ctx.app.config.env === 'prod') {
        ctx.body = {
          success: false,
          message: '服务器内部错误',
          code: ctx.status
        };
      } else {
        ctx.body = {
          success: false,
          message: err.message,
          stack: err.stack,
          code: ctx.status
        };
      }
    }
  };
};
