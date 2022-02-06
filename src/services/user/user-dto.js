function normalizeUsers(users) {
  let parsedUsers;
  if (Array.isArray(users)) {
    parsedUsers = users.map((user) => ({
      id: user.id,
      username: user.username,
      cart: user.cart,
      address: user.address,
      age: user.age,
      telephone: user.telephone,
      avatar: user.avatar,
      role: user.role,
    }));
  } else if (typeof users === 'object') {
    parsedUsers = {
      id: users.id,
      username: users.username,
      cart: users.cart,
      address: users.address,
      age: users.age,
      telephone: users.telephone,
      avatar: users.avatar,
      role: users.role,
    };
  } else {
    throw new Error(`Users must be of type object or array, recieved a ${typeof users}`);
  }
  return parsedUsers;
}

module.exports = normalizeUsers;
