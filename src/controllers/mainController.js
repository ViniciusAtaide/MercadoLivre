const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const calculateDiscount = (price, discount) => price * (100 - discount) / 100

const controller = {
	index: (req, res) => {
		const inSale = products.filter(p => p.category === 'in-sale')
		const visited = products.filter(p => p.category === 'visited')
		res.render('index', { visited, inSale, toThousand, calculateDiscount })
	},
	search: (req, res) => {
		// Do the magic
	},
};

module.exports = controller;
