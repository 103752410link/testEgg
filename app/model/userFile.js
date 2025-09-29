'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const UserFile = app.model.define('user_file', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: STRING(50),
      allowNull: false,
    },
    filename: {
      type: STRING(255),
      allowNull: false,
    },
    originalName: {
      type: STRING(255),
      allowNull: false,
    },
    filePath: {
      type: STRING(500),
      allowNull: false,
    },
    fileSize: {
      type: INTEGER,
      allowNull: false,
    },
    mimeType: {
      type: STRING(100),
      allowNull: true,
    },
    uploadTime: {
      type: DATE,
      defaultValue: app.Sequelize.NOW,
    },
  }, {
    tableName: 'user_files',
    timestamps: true,
  });

  return UserFile;
};