import { UserModel } from "./model/user.model.js";
import { createHash, isValidPassword } from '../path.js';

export default class UsersDao {
  async getByEmail(email) {
    try {
      const userExist = await UserModel.findOne({ email });
      if (!userExist) {
        return false;
      } else {
        return userExist;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getUserById(id) {
    try {
      const userExist = await UserModel.findById(id);
      if (!userExist) {
        return false;
      } else {
        return userExist;
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async createUser(user) {
    try {
      const password = user.password;
      const email = user.email;
      const existUser = await UserModel.findOne({ email });
      if (existUser) {
        return false;
      } else {
        if (email === "adminCoder@coder.com" && password === "adminCoder123") {
          const newUser = await UserModel.create({
            ...user,
            role: "admin",
            password: createHash(password),
          });
          return newUser;
        } else {
          const newUser = await UserModel.create({
            ...user,
            password: createHash(password),
          });
          return newUser;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async loginUser(user) {
    try {
      const email = user.email;
      const password = user.password;
      const findUser = await UserModel.findOne({ email: email });

      if (findUser) {
        const passwordValidate = isValidPassword(password, findUser);
        if (!passwordValidate) return false;
        else return findUser;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }
};