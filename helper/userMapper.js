mapUserInfo = (user) => {
  return user
    ? {
        id: user._id ? user._id : '',
        firstName: user.first_name ? user.first_name : '',
        lastName: user.last_name ? user.last_name : '',
        email: user.email ? user.email : '',
        gender: user.gender ? user.gender : '',
        avatar: user.avatar ? user.avatar : '',
      }
    : {};
};

mapUsersInfo = (users) => {
  if (Array.isArray(users)) {
    return users.map((element) => mapUserInfo(element));
  } else {
    return [];
  }
};

module.exports = {
  mapUserInfo,
  mapUsersInfo,
};
