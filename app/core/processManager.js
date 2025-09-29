'use strict';

/**
 * 进程管理模块
 * 处理未捕获的异常和Promise rejection
 */
class ProcessManager {
  constructor(app) {
    this.app = app;
    this.setupErrorHandlers();
  }

  setupErrorHandlers() {
    // 处理未捕获的异常
    process.on('uncaughtException', (error) => {
      this.app.logger.error('Uncaught Exception:', error);
      // 不要立即退出，给时间记录日志
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    });

    // 处理未处理的Promise rejection
    process.on('unhandledRejection', (reason, promise) => {
      this.app.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // 不要立即退出，给时间记录日志
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    });

    // 处理SIGTERM信号（优雅关闭）
    process.on('SIGTERM', () => {
      this.app.logger.info('Received SIGTERM, shutting down gracefully');
      this.gracefulShutdown();
    });

    // 处理SIGINT信号（Ctrl+C）
    process.on('SIGINT', () => {
      this.app.logger.info('Received SIGINT, shutting down gracefully');
      this.gracefulShutdown();
    });

    // 处理SIGHUP信号（重新加载配置）
    process.on('SIGHUP', () => {
      this.app.logger.info('Received SIGHUP, reloading configuration');
      // 这里可以添加配置重新加载逻辑
    });
  }

  gracefulShutdown() {
    this.app.logger.info('Starting graceful shutdown...');
    
    // 停止接受新连接
    if (this.app.server) {
      this.app.server.close(() => {
        this.app.logger.info('HTTP server closed');
        process.exit(0);
      });
    }

    // 设置强制退出超时
    setTimeout(() => {
      this.app.logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000); // 10秒后强制退出
  }

  // 健康检查
  healthCheck() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      pid: process.pid,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = ProcessManager;
