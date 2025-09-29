'use strict';
const { Controller } = require('egg');
const BaseController = require('../core/BaseController');
const nodemailer = require('nodemailer');
const fs = require('fs');

class HomeController extends BaseController {
  async index() {
    const title = 'Phoenix'; // 向模板传入数据
    const username = this.ctx.session.username;
    await this.ctx.render('index', {
      title,
      username,
      isHome: true,
    });
  }
  async population2000() {
    const sheets = await this.ctx.service.population.getFifthData();

    await this.ctx.render('popu/2000', sheets);
  }
  async population2010() {
    const sheets = await this.ctx.service.population.getData();

    await this.ctx.render('popu/2010', sheets);
  }
  async population2020() {
    const sheets = await this.ctx.service.population.get2020Data();

    await this.ctx.render('popu/2020', sheets);
  }
  async population2030() {
    const sheets = await this.ctx.service.population.get2030Data();

    await this.ctx.render('popu/2030', sheets);
  }

  async email() {
    await this.ctx.render('email');
  }

  async year() {
    await this.notFound({});
    // await this.ctx.render('2019',{
    // });
  }
  async privacy() {
    await this.ctx.render('PrivacyPolicy', {
    });
  }
  async holidayPage() {
    await this.ctx.render('holiday', { isHolidayPage: true });
  }

  async holidayApi() {
    const { ctx } = this;
    ctx.status = 888;
    const day = ctx.request.query.day;
    if (day === 'all') {
      const data = fs.readFileSync('./app/public/holiday.txt', { encoding: 'utf-8' });
      const extend = JSON.parse(data.toString());
      ctx.body = {
        status: 0,
        message: 'success',
        data: extend,
      };
      return;
    }
    const pattern = /^[1-9]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
    let a = 0;
    if (day && day.length == 8 && pattern.test(day)) {
      a = 1;
    }
    if (a) {
      const data = fs.readFileSync('./app/public/holiday.txt', { encoding: 'utf-8' });
      const extend = JSON.parse(data.toString());
      if (parseInt(day.substring(0, 4)) < 2022) {
        ctx.body = {
          status: 10002,
          message: 'faild',
          data: {
            res: '只支持2022年及以后',
          },
        };
        return;
      }
      const test = day.substring(0, 4) + '-' + day.substring(4, 6) + '-' + day.substring(6, 8);
      const date = new Date(test);
      console.log('这天是周' + date.getDay() + '====>' + day);
      if (date.getDay() > 0 && date.getDay() < 6) {
        if (extend.holidays.indexOf(day) > -1) {
          ctx.body = {
            status: 0,
            message: 'success',
            data: {
              res: true,
              msg: '这天是工作日，但是节假日放假',
            },
          };

        } else {
          ctx.body = {
            status: 0,
            message: 'success',
            data: {
              res: false,
              msg: '这天是工作日，正常上班',
            },
          };

        }
      } else {
        if (extend.notholidays.indexOf(day) > -1) {
          ctx.body = {
            status: 0,
            message: 'success',
            data: {
              res: false,
              msg: '这天是周末' + day + '因调休上班',
            },
          };
        } else {
          ctx.body = {
            status: 0,
            message: 'success',
            data: {
              res: true,
              msg: '这天是周末' + day + '不因调休上班',
            },
          };
        }
      }
    } else {
      ctx.body = {
        status: 10001,
        message: 'faild',
        data: {
          res: 'missing param day',
        },
      };
    }


  }
  async emailsend() {
    const { ctx } = this;
    const { to, content, password } = ctx.request.body;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}${month}${day}`;

    if (password !== currentDate) {
      ctx.body = {
        status: 1,
        message: '口令错误',
      };
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'qq',
      secureConnection: true,
      port: 465,
      auth: {
        user: '103752410@qq.com',
        pass: 'fwvjiygrmoozbgid',
      },
    });

    const mailOptions = {
      from: '103752410@qq.com',
      to,
      subject: '测试的邮件',
      text: content,
      html: `<h2>${content}</h2>`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(info);
      ctx.body = {
        status: 0,
        message: '发送邮件成功',
        data: info,
      };
    } catch (err) {
      console.log(err);
      ctx.body = {
        status: 1,
        message: '发送失败',
        data: err,
      };
    }
  }
  async weather() {
    await this.ctx.render('PrivacyPolicy', {
    });
  }

  async filesPage() {
    const username = this.ctx.session.username;
    const isAdmin = username === 'myLogUser';
    await this.ctx.render('files', {
      isFilesPage: true,
      username: username,
      isAdmin: isAdmin
    });
  }

  async uploadFile() {
    const { ctx } = this;

    // 检查用户是否登录
    console.log('上传调试 - 当前用户:', ctx.session.username);
    console.log('上传调试 - Session内容:', ctx.session);

    if (!ctx.session.username) {
      ctx.status = 401;
      ctx.body = {
        status: 1,
        message: '请先登录',
      };
      return;
    }

    const file = ctx.request.files[0];
    console.log('上传调试 - 文件信息:', file ? file.filename : '无文件');

    if (!file) {
      ctx.body = {
        status: 1,
        message: '请选择文件',
      };
      return;
    }

    const fs = require('fs');
    const path = require('path');

    // 创建用户专属目录
    const userDir = path.join(this.config.dataPaths.userFilesDir, ctx.session.username);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    // 处理文件名，避免重名
    const timestamp = Date.now();
    const ext = path.extname(file.filename);
    const baseName = path.basename(file.filename, ext);
    const filename = `${baseName}_${timestamp}${ext}`;
    const targetPath = path.join(userDir, filename);
    const relativePath = path.join('../data/files/user_files', ctx.session.username, filename);

    try {
      // 使用流式复制文件
      const reader = fs.createReadStream(file.filepath);
      const writer = fs.createWriteStream(targetPath);
      await new Promise((resolve, reject) => {
        reader.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // 删除临时文件
      fs.unlinkSync(file.filepath);

      ctx.body = {
        status: 0,
        message: '文件上传成功',
        data: {
          filename: filename,
          originalName: file.filename,
          url: `/${relativePath}`,
          size: file.size,
        },
      };
    } catch (err) {
      ctx.body = {
        status: 1,
        message: '文件上传失败',
        error: err.message,
      };
    }
  }

  async getFiles() {
    const { ctx } = this;

    // 检查用户是否登录
    if (!ctx.session.username) {
      ctx.status = 401;
      ctx.body = {
        status: 1,
        message: '请先登录',
      };
      return;
    }

    const fs = require('fs');
    const path = require('path');

    const userDir = path.join(this.config.dataPaths.userFilesDir, ctx.session.username);

    try {
      if (!fs.existsSync(userDir)) {
        ctx.body = {
          status: 0,
          message: '获取文件列表成功',
          data: [],
        };
        return;
      }

      const isAdmin = ctx.session.username === 'myLogUser';
      let fileList = [];

      if (isAdmin) {
        // 管理员查看所有用户的文件
        const baseDir = this.config.dataPaths.userFilesDir;
        if (fs.existsSync(baseDir)) {
          const userDirs = fs.readdirSync(baseDir);

          for (const userDir of userDirs) {
            const userPath = path.join(baseDir, userDir);
            if (fs.statSync(userPath).isDirectory()) {
              const files = fs.readdirSync(userPath);
              // 过滤隐藏文件（以.开头的文件）
              const visibleFiles = files.filter(filename => !filename.startsWith('.'));
              const userFiles = visibleFiles.map(filename => {
                const filePath = path.join(userPath, filename);
                const stats = fs.statSync(filePath);
                return {
                  filename: filename,
                  originalName: filename.replace(/_\d+(\.[^.]+)$/, '$1'),
                  size: stats.size,
                  uploadTime: stats.mtime,
                  url: `/files/${userDir}/${filename}`,
                  downloadUrl: `/download/${userDir}/${encodeURIComponent(filename)}`,
                  owner: userDir
                };
              });
              fileList.push(...userFiles);
            }
          }
        }
      } else {
        // 普通用户只查看自己的文件
        const files = fs.readdirSync(userDir);
        // 过滤隐藏文件（以.开头的文件）
        const visibleFiles = files.filter(filename => !filename.startsWith('.'));
        fileList = visibleFiles.map(filename => {
          const filePath = path.join(userDir, filename);
          const stats = fs.statSync(filePath);
          return {
            filename: filename,
            originalName: filename.replace(/_\d+(\.[^.]+)$/, '$1'),
            size: stats.size,
            uploadTime: stats.mtime,
            url: `/files/${ctx.session.username}/${filename}`,
            downloadUrl: `/download/${ctx.session.username}/${encodeURIComponent(filename)}`,
            owner: ctx.session.username
          };
        });
      }

      // 按上传时间倒序排列
      fileList.sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime));

      ctx.body = {
        status: 0,
        message: '获取文件列表成功',
        data: fileList,
        isAdmin: isAdmin
      };
    } catch (err) {
      ctx.body = {
        status: 1,
        message: '获取文件列表失败',
        error: err.message,
      };
    }
  }

  async downloadFile() {
    const { ctx } = this;

    // 检查用户是否登录
    if (!ctx.session.username) {
      ctx.status = 401;
      ctx.body = {
        status: 1,
        message: '请先登录',
      };
      return;
    }

    const fs = require('fs');
    const path = require('path');

    // 获取用户名和文件名
    const params = ctx.params.filename.split('/');
    if (params.length !== 2) {
      ctx.status = 400;
      ctx.body = '无效的文件路径';
      return;
    }

    const [username, filename] = params;

    // 检查用户权限 - 管理员可以下载所有文件，普通用户只能下载自己的文件
    const isAdmin = ctx.session.username === 'myLogUser';
    if (!isAdmin && username !== ctx.session.username) {
      ctx.status = 403;
      ctx.body = '无权限访问此文件';
      return;
    }

    const filePath = path.join(this.config.dataPaths.userFilesDir, username, decodeURIComponent(filename));

    if (!fs.existsSync(filePath)) {
      ctx.status = 404;
      ctx.body = '文件不存在';
      return;
    }

    // 使用原始文件名（去除时间戳）
    const originalName = filename.replace(/_\d+(\.[^.]+)$/, '$1');
    ctx.attachment(originalName);
    ctx.set('Content-Type', 'application/octet-stream');
    ctx.body = fs.createReadStream(filePath);
  }

  async deleteFile() {
    const { ctx } = this;

    // 检查用户是否登录
    if (!ctx.session.username) {
      ctx.status = 401;
      ctx.body = {
        status: 1,
        message: '请先登录',
      };
      return;
    }

    const fs = require('fs');
    const path = require('path');

    // 获取用户名和文件名
    const params = ctx.params.filename.split('/');
    if (params.length !== 2) {
      ctx.status = 400;
      ctx.body = {
        status: 1,
        message: '无效的文件路径',
      };
      return;
    }

    const [username, filename] = params;

    // 检查用户权限 - 管理员可以删除所有文件，普通用户只能删除自己的文件
    const isAdmin = ctx.session.username === 'myLogUser';
    if (!isAdmin && username !== ctx.session.username) {
      ctx.status = 403;
      ctx.body = {
        status: 1,
        message: '无权限删除此文件',
      };
      return;
    }

    const filePath = path.join(this.config.dataPaths.userFilesDir, username, decodeURIComponent(filename));

    if (!fs.existsSync(filePath)) {
      ctx.body = {
        status: 1,
        message: '文件不存在',
      };
      return;
    }

    try {
      fs.unlinkSync(filePath);
      ctx.body = {
        status: 0,
        message: '文件删除成功',
      };
    } catch (err) {
      ctx.body = {
        status: 1,
        message: '文件删除失败',
        error: err.message,
      };
    }
  }

  async serveFile() {
    const { ctx } = this;
    const { username, filename } = ctx.params;

    // 检查用户是否登录
    if (!ctx.session.username) {
      ctx.status = 401;
      ctx.body = '请先登录';
      return;
    }

    const fs = require('fs');
    const path = require('path');

    // 检查用户权限 - 管理员可以访问所有文件，普通用户只能访问自己的文件
    const isAdmin = ctx.session.username === 'myLogUser';
    if (!isAdmin && username !== ctx.session.username) {
      ctx.status = 403;
      ctx.body = '无权限访问此文件';
      return;
    }

    const filePath = path.join(this.config.dataPaths.userFilesDir, username, decodeURIComponent(filename));

    if (!fs.existsSync(filePath)) {
      ctx.status = 404;
      ctx.body = '文件不存在';
      return;
    }

    // 设置适当的Content-Type
    const ext = path.extname(filename).toLowerCase();
    const contentType = this.getContentType(ext);

    ctx.set('Content-Type', contentType);
    ctx.body = fs.createReadStream(filePath);
  }

  getContentType(ext) {
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    };
    return contentTypes[ext] || 'application/octet-stream';
  }

  async index2() {
    const { ctx } = this;
    const ret = await ctx.service.population.getData(dataP => {
      dataP.forEach(function(sheet) {
        console.log(sheet.name);
        // 读取每行内容
        for (const rowId in sheet.data) {
          console.log(rowId);
          const row = sheet.data[rowId];
          console.log(row);
        }
      });
    });
    ctx.body = {
      status: 0,
      message: '登录成功',
      data: {
        res: ret,
      },
    };

  }

  async data() {
    return {
      list: [
        { id: 1, title: 'news1', url: 'https://i.loli.net/2019/05/20/5ce26578e0e5549312.png' },
        { id: 2, title: 'news2', url: 'https://i.loli.net/2019/05/20/5ce2657a0e01277224.png' },
        { id: 3, title: 'news3', url: 'https://i.loli.net/2019/05/20/5ce2657b67be250185.png' },
      ],
    };
  }
}

module.exports = HomeController;
