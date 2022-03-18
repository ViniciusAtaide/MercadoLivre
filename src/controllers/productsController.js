const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const productsImagesPath = path.join(__dirname, '../../public/images/products')
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const calculateDiscount = (price, discount) => price * (100 - discount) / 100

const controller = {
	// Root - Show all products
	index: (req, res) => {
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

		const { message } = req.query

		res.render('products', { products, toThousand, calculateDiscount, message })
	},

	// Detail - Detail from one product
	detail: (req, res) => {

		const { message } = req.query
		const product = products.find(p => p.id === Number(req.params.id))

		res.render('detail', { title: product.name, product, toThousand, calculateDiscount, message })
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const product = req.body

		if (!req.file) {
			product.image = 'default-image.png'
		} else {
			product.image = req.file.filename
		}

		product.id = products[products.length -1].id + 1

		products.push(product)

		fs.writeFileSync(productsFilePath, JSON.stringify(products))

		const message = "Produto criado com sucesso" 

		res.redirect(`/products?message=${message}`)
	},

	// Update - Form to edit
	edit: (req, res) => {
		const productToEdit = products.find(p => p.id === Number(req.params.id))

		const { message } = req.query

		res.render('product-edit-form', { productToEdit, toThousand, calculateDiscount, message })
	},

	// Update - Method to update
	update: (req, res) => {
		const { id } = req.params

		const productToUpdate = req.body

		const product = products.find((p) => p.id	=== Number(id))

		if (req.file) {
			product.image = req.file.filename
		}

		product.name = productToUpdate.name
		product.price = productToUpdate.price
		product.discount = productToUpdate.discount
		product.category = productToUpdate.category
		product.description = productToUpdate.description

		fs.writeFileSync(productsFilePath, JSON.stringify(products))

		const message = "Produto atualizado com sucesso"

		res.redirect(`/products/detail/${product.id}?message=${message}`)
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		const { id } = req.params

		const newProducts = products.filter((product) => product.id !== Number(id))
		const product = products.find((p) => p.id	=== Number(id))

		fs.writeFileSync(productsFilePath, JSON.stringify(newProducts))
		fs.unlinkSync(path.join(productsImagesPath, product.image))

		const message = "Produto deletado com sucesso"

		res.redirect(`/products?message=${message}`)
	}
};

module.exports = controller;