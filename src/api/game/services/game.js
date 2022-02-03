"use strict";

/**
 * game service.
 */

const axios = require("axios");
const slugify = require("slugify");
const qs = require("querystring");

const { createCoreService } = require("@strapi/strapi").factories;

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function Exception(e) {
  return { e, data: e.data && e.data.errors && e.data.errors };
}

async function getGameInfo(slug) {
  try {
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;

    const body = await axios.get(`https://www.gog.com/game/${slug}`);
    const dom = new JSDOM(body.data);

    const description = dom.window.document.querySelector(".description");

    return {
      rating: "FREE",
      short_description: description.textContent.slice(0, 160),
      description: description.innerHTML,
    };
  } catch (err) {
    console.log("getGameInfo", Exception(err));
  }
}

async function getByName(name, entityName) {
  const item = await strapi.db
    .query(`api::${entityName}.${entityName}`)
    .findOne({
      where: { name },
    });
  return item;
}

async function getBySlug(slug, entityName) {
  const item = await strapi.db
    .query(`api::${entityName}.${entityName}`)
    .findOne({
      where: { slug },
    });
  return item;
}

async function create(name, entityName) {
  const item = await getByName(name, entityName);

  if (!item) {
    try {
      return await strapi.service(`api::${entityName}.${entityName}`).create({
        data: {
          name,
          slug: slugify(name, { lower: true }),
        },
      });
    } catch (err) {
      console.log("create", Exception(err));
    }
  }
}

async function createManyToManyData(products) {
  const developers = {};
  const publishers = {};
  const categories = {};
  const platforms = {};

  products.forEach((product) => {
    const { developer, publisher, genres, supportedOperatingSystems } = product;

    genres &&
      genres.forEach((item) => {
        categories[item] = true;
      });

    supportedOperatingSystems &&
      supportedOperatingSystems.forEach((item) => {
        platforms[item] = true;
      });

    developers[developer] = true;
    publishers[publisher] = true;

    return Promise.all([
      ...Object.keys(developers).map((name) => create(name, "developer")),
      ...Object.keys(publishers).map((name) => create(name, "publisher")),
      ...Object.keys(categories).map((name) => create(name, "category")),
      ...Object.keys(platforms).map((name) => create(name, "platform")),
    ]);
  });
}

async function createGames(products) {
  await Promise.all(
    products.map(async (product) => {
      const item = await getByName(product.title, "game");

      if (!item) {
        console.log(`Creating: ${product.title}...`);

        const game = await strapi.service(`api::game.game`).create({
          data: {
            name: product.title,
            slug: product.slug.replace(/_/g, "-"),
            price: product.price.amount,
            release_date: new Date(
              Number(product.globalReleaseDate) * 1000
            ).toISOString(),
            categories: await Promise.all(
              product.genres.map((name) => getByName(name, "category"))
            ),
            platforms: await Promise.all(
              product.supportedOperatingSystems.map((name) =>
                getByName(name, "platform")
              )
            ),
            developers: [await getByName(product.developer, "developer")],
            publisher: await getByName(product.publisher, "publisher"),
            ...(await getGameInfo(product.slug)),
          },
        });

        await setImage({ image: product.image, game });
        await Promise.all(
          product.gallery
            .slice(0, 5)
            .map((url) => setImage({ image: url, game, field: "gallery" }))
        );

        await timeout(2000);
        return game;
      }
    })
  );
}

async function setImage({ image, game, field = "cover" }) {
  const url = `https:${image}_bg_crop_1680x655.jpg`;
  const { data } = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(data, "base64");

  const FormData = require("form-data");
  const formData = new FormData();

  formData.append("refId", game.id);
  formData.append("ref", "api::game.game");
  formData.append("field", field);
  formData.append("files", buffer, { filename: `${game.slug}.jpg` });

  console.info(`Uploading ${field} image: ${game.slug}.jpg`);

  try {
    await axios({
      method: "POST",
      url: `http://${strapi.config.host}:${strapi.config.port}/api/upload`,
      data: formData,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      },
    });
  } catch (err) {
    console.log("setImage", Exception(err));
  }
}

module.exports = createCoreService("api::game.game", ({ strapi }) => ({
  async populate(params) {
    const gogApiUrl = `https://www.gog.com/games/ajax/filtered?mediaType=game&${qs.stringify(
      params
    )}`;

    const {
      data: { products },
    } = await axios.get(gogApiUrl);

    await createManyToManyData(products);
    await createGames(products);
  },
}));
