import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";

import UsersDao from "../persistence/daos/mongodb/users.dao.js";
const userDao = new UsersDao();

const strategyOptions = {
  clientID: "Iv1.7d53ce4dba08ecce",
  clientSecret: "d4fe246c85c69ef5f8a7bb58b2382e9c929f3e91",
  callbackURL: "http://localhost:8080/users/github-profile",
};

const registerOrLogin = async (accesToken, refreshToken, profile, done) => {
  const email =
    profile._json.email !== null ? profile._json.email : profile._json.blog;
  let user = await userDao.getUserByEmail(email);
  if (user) return done(null, user);
  const newUser = await userDao.createUser({
    firstName: profile._json.name?.split(" ")[0],
    lastName: profile._json.name?.split(" ")[1],
    email: email,
    password: " ",
    isGithub: true,
  });
  return done(null, newUser);
};

const githubStrategy = new GithubStrategy(strategyOptions, registerOrLogin);
// console.log(githubStrategy);
passport.use("github", githubStrategy);
