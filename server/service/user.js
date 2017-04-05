'use strict';

const _ = require('lodash');
const UserModel = require('../model').User;

let User = module.exports = {};

// 通过微信信息添加用户
User.addByWechatAsync = function* (options) {
  let gender = ['未知', '男', '女'];
  options = {
    user_id: options.userid,
    name: options.name,
    gender: gender[options.gender],
    mobile: options.mobile || '',
    email: options.email || '',
    avatar: _.trimStart(options.avatar, 'htps:') || '',
  };
  return yield this.upsertAsync(options);
};

// 增加或更新
User.upsertAsync = function* (options) {
  yield UserModel.upsert(options);
  return yield this.getAsync(options.user_id);
};

// 更新用户
User.updateAsync = function* (user_id, options) {
  let user = yield UserModel.findOne({
    where: {user_id},
  });
  if (!user) {
    return false;
  }

  user = yield user.update(options);
  return user.get({plain: true});
};

// 搜索用户
User.searchAsync = function* (key) {
  key = '%' + _.trim(key, '%') + '%';
  let users = yield UserModel.findAll({
    where: {
      $or: {
        user_id: {$like: key},
        name: {$like: key},
      },
    },
  });

  let res = [];
  for (let user of users) {
    res.push(user.get({plain: true}));
  }

  return res;
};

// 获取用户信息
User.getAsync = function* (user_id) {
  let user = yield UserModel.findOne({
    where: {user_id},
  });
  if (!user) {
    return false;
  }

  return user.get({plain: true});
};

// 删除用户
User.removeAsync = function* (user_id) {
  let user = yield UserModel.findOne({
    where: {user_id},
  });
  if (!user) {
    return false;
  }

  // TODO 删除用户所有代理
  return user.destroy();
};
