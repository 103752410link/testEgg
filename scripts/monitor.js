#!/usr/bin/env node

'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * 进程监控脚本
 * 监控应用健康状态，异常时自动重启
 */
class ProcessMonitor {
  constructor() {
    this.appProcess = null;
    this.restartCount = 0;
    this.maxRestarts = 5;
    this.restartInterval = 30000; // 30秒
    this.healthCheckInterval = 10000; // 10秒
    this.lastRestartTime = 0;
    this.isShuttingDown = false;
  }

  start() {
    console.log('Starting process monitor...');
    this.startApp();
    this.startHealthCheck();
    this.setupSignalHandlers();
  }

  startApp() {
    if (this.appProcess) {
      console.log('App is already running');
      return;
    }

    console.log('Starting application...');
    this.appProcess = spawn('npm', ['start'], {
      stdio: 'inherit',
      cwd: __dirname + '/..'
    });

    this.appProcess.on('exit', (code, signal) => {
      console.log(`App process exited with code ${code} and signal ${signal}`);
      this.appProcess = null;
      
      if (!this.isShuttingDown) {
        this.handleAppExit(code, signal);
      }
    });

    this.appProcess.on('error', (error) => {
      console.error('App process error:', error);
      this.appProcess = null;
      
      if (!this.isShuttingDown) {
        this.handleAppError(error);
      }
    });
  }

  handleAppExit(code, signal) {
    const now = Date.now();
    
    // 检查重启频率限制
    if (now - this.lastRestartTime < this.restartInterval) {
      console.log('Restart too frequent, waiting...');
      setTimeout(() => this.handleAppExit(code, signal), this.restartInterval);
      return;
    }

    // 检查重启次数限制
    if (this.restartCount >= this.maxRestarts) {
      console.error('Max restart attempts reached, stopping monitor');
      process.exit(1);
    }

    this.restartCount++;
    this.lastRestartTime = now;
    
    console.log(`Restarting app (attempt ${this.restartCount}/${this.maxRestarts})...`);
    setTimeout(() => this.startApp(), 5000); // 5秒后重启
  }

  handleAppError(error) {
    console.error('App process error, attempting restart...');
    this.handleAppExit(1, null);
  }

  startHealthCheck() {
    setInterval(() => {
      if (this.isShuttingDown) return;
      
      this.checkHealth().catch(error => {
        console.error('Health check failed:', error);
        if (!this.isShuttingDown) {
          this.handleAppExit(1, null);
        }
      });
    }, this.healthCheckInterval);
  }

  async checkHealth() {
    try {
      const response = await fetch('http://127.0.0.1:7002/health');
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error('Health check returned failure');
      }
      
      console.log('Health check passed');
      this.restartCount = 0; // 重置重启计数
    } catch (error) {
      console.error('Health check error:', error.message);
      throw error;
    }
  }

  setupSignalHandlers() {
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
  }

  shutdown() {
    console.log('Shutting down monitor...');
    this.isShuttingDown = true;
    
    if (this.appProcess) {
      this.appProcess.kill('SIGTERM');
      
      // 强制退出超时
      setTimeout(() => {
        if (this.appProcess) {
          console.log('Force killing app process');
          this.appProcess.kill('SIGKILL');
        }
        process.exit(0);
      }, 10000);
    } else {
      process.exit(0);
    }
  }
}

// 启动监控
const monitor = new ProcessMonitor();
monitor.start();
