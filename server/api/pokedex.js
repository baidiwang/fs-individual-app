const Pokemon = require('../db/models/Pokemons')
const {Sequelize} = require('sequelize')
const router = require("express").Router();

router.get("/", async (req, res, next) => {
	const pokemons = await Pokemon.findAll({ order: Sequelize.fn('random'), limit: 6 });

	res.json(pokemons);
});

module.exports = router;
