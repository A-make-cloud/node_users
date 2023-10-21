import { BadRequestError, NotFoundError } from "../exceptions";
import fs from "fs";
let users = [
  {
    id: 1,
    nom: "toto",
    prenom: "tata",
    email: "toto@mail.com",
    avatar: "",
  },
];
class UserService {
  static listUser() {
    return users;
  }

  static find(id) {
    let user = users.find((u) => u.id == id);
    if (!user) {
      throw new NotFoundError("Ce user n'existe pas");
    }
    return user;
  }
  static findUserByEmail(email) {
    return users.some((u) => u.email === email);
  }

  // static create(data) {
  static create({ nom, prenom, email, avatar }) {
    let newId = Math.max(...users.map((u) => u.id), 0) + 1;

    users = [...users, { id: newId, nom, prenom, email, avatar }];
    if (avatar) {
      this.moveFile(avatar);
    }
    return users;
  }
  static moveFile(avatar) {
    fs.rename("temp/" + avatar, "public/avatars/" + avatar, (err) => {
      if (err) throw err;
      console.log(`Fichier déplacé ${avatar}`);
    });
  }
  static delete(id) {
    let userIndex = users.findIndex((u) => u.id == id);
    if (userIndex === -1) {
      throw new NotFoundError("L'utilisateur n'existe pas");
    }
    let { avatar } = users[userIndex];
    users.splice(userIndex, 1);
    if (avatar) {
      this.removeFile(avatar);
    }

    return users;
  }

  static removeFile(avatar) {
    fs.unlink(`public/avatars/${avatar}`, (err) => {
      if (err) {
        throw err;
      }
      console.log(`Le fichier ${avatar} a été supprimé`);
    });
  }
  static edit({ id, ...other }) {
    let index = users.findIndex((u) => u.id == id);
    if (index === -1) {
      throw new NotFoundError("Pas d'utilisateur avec cet id");
    }
    let user = { ...users[index] };
    const oldAvatar = user.avatar;
    const avatar = other.avatar;
    Object.keys(other).forEach((k) => {
      if (other[k] && user.hasOwnProperty(k)) {
        user[k] = other[k];
      }
    });
    users.splice(index, 1, user);

    if (avatar) {
      this.moveFile(avatar);
      if (oldAvatar) this.removeFile(oldAvatar);
    }
    return user;
  }
}

export default UserService;
