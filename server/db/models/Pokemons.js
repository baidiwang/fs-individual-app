const db = require('../db')
const Sequelize = require('sequelize')

const Pokemon = db.define('pokemon', {
	name: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false
	},
	type: {
		type: Sequelize.STRING,
	},
	imageUrl: {
		type: Sequelize.STRING,
	}
})

module.exports = Pokemon
