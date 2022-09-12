"use strict";

const {
  db,
  models: { User },
} = require("../server/db");
const axios = require("axios");
const { response } = require("express");
const Pokemon = require("../server/db/models/Pokemons");

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log("db synced!");

  // Creating Users
  const users = await Promise.all([
    User.create({ username: "cody", password: "123" }),
    User.create({ username: "murphy", password: "123" }),
  ]);

  console.log(`seeded ${users.length} users`);

  // Get Pokemon data
  const pokemonRequests = [];
  for (let i = 1; i < 90; i++) {
    const request = axios.get("https://pokeapi.co/api/v2/pokemon-form/" + i);
    pokemonRequests.push(request);
  }

  try {
    const responses = await axios.all(pokemonRequests);
    for (let i = 0; i < responses.length; i++) {
      const data = responses[i].data;
      await Pokemon.create({
        name: data.pokemon.name,
        imageUrl: data.sprites.front_default,
        type: data.types[0].type.name,
      });
    }
  } catch (e) {
    console.log(e);
  }
  console.log(`seeded ${pokemonRequests.length} pokemons`);

  console.log(`seeded successfully`);
  return {
    users: {
      cody: users[0],
      murphy: users[1],
    },
  };
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
