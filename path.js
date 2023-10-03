import {dirname} from 'path'
import { fileURLToPath } from 'url'
export const __dirname = dirname(fileURLToPath(import.meta.url))


// -----

import bcrypt from 'bcrypt';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(5));


export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);


// -----


import { faker } from "@faker-js/faker";

faker.local = "es";

export const generateProducts = () => {
  return {
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price({ min: 600, max: 20000 }),
    stock: faker.commerce.price({ min: 1, max: 50 }),
    code: faker.string.uuid(),
    category: faker.commerce.productAdjective(),
    thumbnails: faker.image.url(),
  };
};