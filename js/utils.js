/**
 * FUNCIONES PROYECTO:
 *
 * - CREAR CARD PRODUCTO
 * - RENDERIZAR TODOS PRODUCTOS
 * - AÑADIR AL CARRITO
 * - TOTAL CARRITO
 * - AÑADIR/REDUCIR CANTIDAD (CANTIDAD 0 === ELIMINAR PRODUCTO)
 * - ELIMINAR PRODUCTO CARRITO
 * - TOTAL CARRITO
 */

function createProductCard(product) {
	const article = createElement('article', '', '')

	const figure = createElement('figure', '', '')
	figure.innerHTML = `<img src="${product.imagen}" alt="${product.NOMBRE}" />`
	article.appendChild(figure)

	const articleBody = createElement('div', '', '')
	articleBody.className = 'article-body'

	const h2 = createElement('h2', '', '')
	h2.textContent = product.nombre
	articleBody.appendChild(h2)

	const descP = createElement('p', '', '')
	descP.textContent = product.descripcion
	articleBody.appendChild(descP)

	const button = createButton('Añadir al carrito', () => addToCart(product))
	articleBody.appendChild(button)

	article.appendChild(articleBody)
	return article
}

function createButton(text, onClick) {
	const button = document.createElement('button')
	button.className = 'button button-primary'
	button.textContent = text
	button.onclick = onClick
	return button
}

function createElement(element, label, value) {
	const item = document.createElement(element)
	item.textContent = `${label}: ${value}`
	return item
}

function renderProducts(productos) {
	if (!listaProductos) {
		console.error('listaProductos element not found')
		return
	}
	productos.forEach((product, index) => {
		const productElement = createProductCard(product)
		productElement.setAttribute('id', index)
		listaProductos.appendChild(productElement)
	})
}
