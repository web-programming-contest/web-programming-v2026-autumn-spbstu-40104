'use strict';

class User {
  constructor(id, name, friends = []) {
    this.id = id;
    this.name = name;
    this.friends = [...new Set(friends)];
  }

  addFriend(friendId) {
    if (this.id == friendId) {
      throw new Error('User::addFriend: cannot add yourself as a friend');
    }

    if (!this.friends.includes(friendId)) {
      this.friends.push(friendId);
    }
  }

  removeFriend(friendId) {
    const indexToRemove = this.friends.indexOf(friendId);
    if (indexToRemove !== -1) {
      this.friends.splice(indexToRemove, 1);
    }
  }

  get friendCount() {
    return this.friends.length;
  }
}

export {User};
