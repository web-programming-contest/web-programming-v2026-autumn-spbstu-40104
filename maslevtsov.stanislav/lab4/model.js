'use strict';

export class User {
  #id;
  #name;
  #friends;

  constructor(id, name, friends = []) {
    this.#id = id;
    this.#name = name;
    this.#friends = [...new Set(friends)];
  }

  addFriend(friendId) {
    if (this.#id === friendId) {
      throw new Error('User::addFriend: cannot add yourself as a friend');
    }

    if (!this.#friends.includes(friendId)) {
      this.#friends.push(friendId);
    }
  }

  removeFriend(friendId) {
    const indexToRemove = this.#friends.indexOf(friendId);
    if (indexToRemove !== -1) {
      this.#friends.splice(indexToRemove, 1);
    }
  }

  get friendCount() {
    return this.#friends.length;
  }
}

export function groupUsersByFriendCount(users) {
  const result = {};
  for (const u of users) {
    (result[u.friendCount] ??= []).push(u);
  }
  return result;
}

export function getUniqueFriendIds(users) {
  const set = new Set();
  for (const i of users) {
    for (const j of i.friends) set.add(j);
  }
  return [...set];
}

export function getUsersWithCommonFriend(users, targetId) {
  const target = users.find((u) => u.id === targetId);
  if (!target) {
    return [];
  }

  const targetFriends = new Set(target.friends);
  return users.filter((u) => {
    if (u.id === targetId) {
      return false;
    }
    return u.friends.some((f) => targetFriends.has(f));
  });
}

export function getUsersWithMoreFriendsThan(users, n) {
  return users.filter((u) => u.friendCount > n);
}

export function getUsersWithoutFriends(users) {
  return users.filter((u) => u.friendCount === 0);
}
