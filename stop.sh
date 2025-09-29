#!/bin/bash

# 停止脚本 - 优雅关闭应用

echo "Stopping PetsMatch Server..."

# 停止主应用
npm stop

# 等待进程完全停止
sleep 3

# 检查是否还有残留进程
if pgrep -f "egg-server-readme" > /dev/null; then
    echo "Force killing remaining processes..."
    pkill -f "egg-server-readme"
    sleep 2
fi

# 检查是否还有Node.js进程占用7002端口
if lsof -i :7002 > /dev/null 2>&1; then
    echo "Killing processes on port 7002..."
    lsof -ti :7002 | xargs kill -9
fi

echo "Server stopped successfully"
