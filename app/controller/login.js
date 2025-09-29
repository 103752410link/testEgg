'use strict';
const { Controller } = require('egg');
const BaseController = require('../core/BaseController');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class LoginController extends BaseController {
  async index() {
    await this.ctx.render('login');
  }

  async register() {
    await this.ctx.render('register');
  }

  async resetPasswordPage() {
    await this.ctx.render('reset-password');
  }

  async registerUser() {
    const { ctx } = this;
    const { username, email, password, confirmPassword } = ctx.request.body;

    // 验证输入
    if (!username || !email || !password || !confirmPassword) {
      return await this.ctx.render('register', {
        error: '所有字段都是必填的'
      });
    }

    if (password !== confirmPassword) {
      return await this.ctx.render('register', {
        error: '两次输入的密码不一致'
      });
    }

    if (username.length < 3 || username.length > 20) {
      return await this.ctx.render('register', {
        error: '用户名长度必须在3-20个字符之间'
      });
    }

    if (password.length < 6) {
      return await this.ctx.render('register', {
        error: '密码长度至少为6个字符'
      });
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return await this.ctx.render('register', {
        error: '邮箱格式不正确'
      });
    }

    try {
      // 读取现有用户数据
      const userFilePath = this.config.dataPaths.usersFile;
      let users = [];

      if (fs.existsSync(userFilePath)) {
        const userData = fs.readFileSync(userFilePath, 'utf8');
        users = JSON.parse(userData);
      }

      // 检查用户名是否已存在
      if (users.some(user => user.username === username)) {
        return await this.ctx.render('register', {
          error: '用户名已存在'
        });
      }

      // 检查邮箱是否已存在
      if (users.some(user => user.email === email)) {
        return await this.ctx.render('register', {
          error: '该邮箱已被注册'
        });
      }

      // MD5加密密码
      const md5Password = crypto.createHash('md5').update(password).digest('hex');

      // 创建新用户
      const newUser = {
        id: Date.now(),
        username,
        email,
        password: md5Password,
        createTime: new Date().toISOString()
      };

      // 保存用户数据
      users.push(newUser);
      fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));

      // 注册成功，重定向到登录页面
      await this.ctx.render('register', {
        success: '注册成功！请登录'
      });

    } catch (error) {
      console.error('注册错误:', error);
      await this.ctx.render('register', {
        error: '注册失败，请稍后重试'
      });
    }
  }

  async login() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;

    
    if (!username || !password) {
      return await this.ctx.render('login', {
        error: '请输入用户名和密码'
      });
    }

    try {
      // 读取用户数据
      const userFilePath = this.config.dataPaths.usersFile;
      if (!fs.existsSync(userFilePath)) {
        return await this.ctx.render('login', {
          error: '用户名或密码错误'
        });
      }

      const userData = fs.readFileSync(userFilePath, 'utf8');
      const users = JSON.parse(userData);

      // MD5加密输入的密码
      const md5Password = crypto.createHash('md5').update(password).digest('hex');

      // 查找用户
      const user = users.find(u => u.username === username && u.password === md5Password);

      if (user) {
        // 登录成功
        ctx.session.username = username;
        ctx.session.userId = user.id;
        ctx.redirect('/');
      } else {
        // 登录失败
        return await this.ctx.render('login', {
          error: '用户名或密码错误'
        });
      }

    } catch (error) {
      console.error('登录错误:', error);
      return await this.ctx.render('login', {
        error: '登录失败，请稍后重试'
      });
    }
  }

  async logout() {
    const { ctx } = this;
    ctx.session.username = null;
    ctx.session.userId = null;
    ctx.redirect('/');
  }

  async forgotPassword() {
    const { ctx } = this;
    const { email } = ctx.request.body;

    console.log('收到找回密码请求，邮箱:', email);

    if (!email) {
      ctx.body = {
        status: 1,
        message: '请输入邮箱地址'
      };
      return;
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ctx.body = {
        status: 1,
        message: '邮箱格式不正确'
      };
      return;
    }

    try {
      // 读取用户数据
      const userFilePath = this.config.dataPaths.usersFile;
      console.log('用户数据文件路径:', userFilePath);
      
      if (!fs.existsSync(userFilePath)) {
        console.log('用户数据文件不存在');
        ctx.body = {
          status: 1,
          message: '该邮箱未注册'
        };
        return;
      }

      const userData = fs.readFileSync(userFilePath, 'utf8');
      const users = JSON.parse(userData);
      console.log('当前用户数量:', users.length);

      // 查找用户
      const user = users.find(u => u.email === email);
      if (!user) {
        console.log('未找到邮箱对应的用户:', email);
        ctx.body = {
          status: 1,
          message: '该邮箱未注册'
        };
        return;
      }

      console.log('找到用户:', user.username);

      // 生成重置令牌
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 3600000); // 1小时后过期

      // 保存重置令牌到用户数据
      user.resetToken = resetToken;
      user.resetExpires = resetExpires.toISOString();

      // 更新用户数据
      const userIndex = users.findIndex(u => u.id === user.id);
      users[userIndex] = user;
      fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
      console.log('用户数据已更新，重置令牌已保存');

      // 发送重置邮件
      console.log('准备发送重置邮件给用户:', user.username, '邮箱:', email);
      await this.sendResetEmail(email, resetToken, user.username);

      ctx.body = {
        status: 0,
        message: '密码重置链接已发送到您的邮箱'
      };

    } catch (error) {
      console.error('找回密码错误:', error);
      console.error('错误堆栈:', error.stack);
      ctx.body = {
        status: 1,
        message: '发送失败，请稍后重试'
      };
    }
  }

  async sendResetEmail(email, resetToken, username) {
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      service: 'qq',
      secureConnection: true,
      port: 465,
      auth: {
        user: '103752410@qq.com',
        pass: 'fwvjiygrmoozbgid',
      },
    });

    const resetUrl = `http://182.92.6.81:7002/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: '103752410@qq.com',
      to: email,
      subject: 'Phoenix - 密码重置',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00ff88;">Phoenix 密码重置</h2>
          <p>亲爱的 ${username}，</p>
          <p>您请求重置密码。请点击下面的链接来重置您的密码：</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #00ff88, #00ccff); color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">重置密码</a>
          </div>
          <p>如果按钮无法点击，请复制以下链接到浏览器地址栏：</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p><strong>注意：</strong>此链接将在1小时后过期。</p>
          <p>如果您没有请求重置密码，请忽略此邮件。</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">此邮件由 Phoenix 系统自动发送，请勿回复。</p>
        </div>
      `,
    };

    try {
      console.log('开始发送密码重置邮件到:', email);
      console.log('重置URL:', resetUrl);
      
      const info = await transporter.sendMail(mailOptions);
      console.log('密码重置邮件发送成功:', email, 'Message ID:', info.messageId);
    } catch (error) {
      console.error('发送密码重置邮件失败:', error);
      console.error('错误详情:', {
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode
      });
      throw error;
    }
  }

  async resetPassword() {
    const { ctx } = this;
    const { token, newPassword } = ctx.request.body;

    if (!token || !newPassword) {
      ctx.body = {
        status: 1,
        message: '缺少必要参数'
      };
      return;
    }

    if (newPassword.length < 6) {
      ctx.body = {
        status: 1,
        message: '密码长度至少为6个字符'
      };
      return;
    }

    try {
      // 读取用户数据
      const userFilePath = this.config.dataPaths.usersFile;
      if (!fs.existsSync(userFilePath)) {
        ctx.body = {
          status: 1,
          message: '用户数据不存在'
        };
        return;
      }

      const userData = fs.readFileSync(userFilePath, 'utf8');
      const users = JSON.parse(userData);

      // 查找具有有效重置令牌的用户
      const user = users.find(u => 
        u.resetToken === token && 
        u.resetExpires && 
        new Date(u.resetExpires) > new Date()
      );

      if (!user) {
        ctx.body = {
          status: 1,
          message: '重置令牌无效或已过期'
        };
        return;
      }

      // 更新密码
      const md5Password = crypto.createHash('md5').update(newPassword).digest('hex');
      user.password = md5Password;
      
      // 清除重置令牌
      delete user.resetToken;
      delete user.resetExpires;

      // 更新用户数据
      const userIndex = users.findIndex(u => u.id === user.id);
      users[userIndex] = user;
      fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));

      ctx.body = {
        status: 0,
        message: '密码重置成功'
      };

    } catch (error) {
      console.error('重置密码错误:', error);
      ctx.body = {
        status: 1,
        message: '重置失败，请稍后重试'
      };
    }
  }
}

module.exports = LoginController;