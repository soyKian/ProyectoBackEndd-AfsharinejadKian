import { UserModel } from "./models/users.model.js";
import { CartsModel } from "./models/carts.model.js";
import { createHash, isValidPassword } from "../../../path.js";
import UserResponseDTO from "../../dtos/userDatos.dto.js";
import { logger } from "../../../utils/logger.js";
import { sendMail } from "../../../utils/mailing.service.js";
export default class UsersDao {
  
  async getAllUsers () {
    try {
      const response = await UserModel.find({});
      const userDoc = response.map((user) => new UserResponseDTO(user));
      return userDoc;
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  } 

  async getUserByEmail(email) {
    try {
      const userExist = await UserModel.findOne({ email });
      if (!userExist) {
        return false;
      } else {
        return userExist;
      }
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
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
      logger.error(error);
      throw new Error(error.message);
    }
  }

  async createUser(user) {
    try {
      const { email, password } = user;
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

          const newCart = await CartsModel.create({});
          newUser.cart = newCart._id;
          await newUser.save();
          await sendMail(user);
          return newUser;
        }
      }
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
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
      logger.error(error);
      throw new Error(error.message);
    }
  }

  async updateRole(uid, role) {
    try {
      await UserModel.updateOne({ _id: uid }, { role: role });
      return role;
    } catch (error) {
      logger.error(error);
      throw new Error(error.message);
    }
  }
}