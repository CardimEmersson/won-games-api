"use strict";

/**
 *  game controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::game.game", ({ strapi }) => ({
  async populate(ctx, next) {
    // called by POST /populate
    console.log("Initializing");

    const options = {
      sort: "popularity",
      page: "1",
      ...ctx.query,
    };

    await strapi.service("api::game.game").populate(options);
  },
}));
