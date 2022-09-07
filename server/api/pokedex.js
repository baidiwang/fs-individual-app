const router = require("express").Router();
const axios = require("axios");

router.get("/", async (req, res, next) => {
	const randomPokemonImages = [];
	for (let i = 0; i < 6; i++) {
		const id = Math.floor(Math.random() * 500) + 1;
		const pokemonDetailResp = await axios.get('https://pokeapi.co/api/v2/pokemon/' + id);
		const imageUrl = pokemonDetailResp.data.sprites.front_default;
		randomPokemonImages.push(imageUrl);
	}

	res.json(randomPokemonImages);
});

module.exports = router;
