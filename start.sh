#!/bin/bash

# 启动脚本 - 带监控的应用启动

echo "Starting PetsMatch Server with monitoring..."

# 检查是否已有进程在运行
if pgrep -f "egg-server-readme" > /dev/null; then
    echo "Server is already running. Stopping first..."
    npm stop
    sleep 2
fi

# 启动应用
echo "Starting application..."
npm start

# 等待应用启动
sleep 5

# 检查应用是否成功启动
if curl -f http://127.0.0.1:7002/health > /dev/null 2>&1; then
    echo "Application started successfully!"
    echo "Health check: http://127.0.0.1:7002/health"
    echo "System info: http://127.0.0.1:7002/api/info"
else
    echo "Application failed to start properly"
    exit 1
fi
