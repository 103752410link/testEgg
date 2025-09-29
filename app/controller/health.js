'use strict';

const { Controller } = require('egg');

class HealthController extends Controller {
  // 健康检查接口
  async check() {
    const { ctx, app } = this;
    
    try {
      const healthInfo = app.processManager ? app.processManager.healthCheck() : {
        status: 'unknown',
        message: 'Process manager not initialized'
      };
      
      ctx.body = {
        success: true,
        data: healthInfo
      };
    } catch (error) {
      ctx.logger.error('Health check error:', error);
      ctx.body = {
        success: false,
        message: 'Health check failed',
        error: error.message
      };
    }
  }

  // 系统信息接口
  async info() {
    const { ctx } = this;
    
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      pid: process.pid,
      timestamp: new Date().toISOString()
    };
    
    ctx.body = {
      success: true,
      data: systemInfo
    };
  }
}

module.exports = HealthController;
