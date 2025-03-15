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

	const button = createButton('Añadir al carrito', () => addShoppingCart(product), 'button-primary')
	articleBody.appendChild(button)

	article.appendChild(articleBody)
	return article
}

function createButton(text, onClick, type) {
	const button = document.createElement('button')
	button.className = `button ${type}`
	button.textContent = text
	button.onclick = onClick
	return button
}

function createElement(element, label, value) {
	const item = document.createElement(element)
	item.textContent = label === '' ? value : `${label}: ${value}`
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

function createShoppingCart(product){
	const div = createElement('div', '', '')

	const span = createElement('span', '', `${product.nombre} - €${product.precio} x ${product.count}`)

	const buttonRemove = createButton('❌', () => removeProduct(product), 'button-icon')
	const buttonPlus = createButton('+', () => addCountProduct(product), 'button-red button-sm')
	
	const buttonLess = createButton('-', () => removeCountProduct(product), 'button-red button-sm')


	div.append(buttonRemove, span,  buttonPlus, buttonLess)

	return div

}

function renderCart(productsCart){
	cartListElement.innerHTML=''

	productsCart.forEach((product, index) => {
		const productElement = createShoppingCart(product)
		productElement.setAttribute('id', index)
		cartListElement.appendChild(productElement)
	})
	cartTotalElement.textContent = `${calcTotal(productsCart)} €`
}

function removeCountProduct(product){
	const productInCart = productsCart.find(p => p.id === product.id);
	if (productInCart) {
		productInCart.count -= 1;
		if (productInCart.count === 0) {
			removeProduct(product);
			renderCart(productsCart);
		} else {
			renderCart(productsCart);
		}
	}
}


function addShoppingCart (product) {
	showDropdown()
	const newProduct = {
		id: product.id,
		nombre: product.nombre,
		precio: product.precio,
		stock: product.stock,
		count: 1
	};

	productsCart.push(newProduct);
	renderCart(productsCart);
}

function clearShoppingCart(){
	productsCart = []
	renderCart(productsCart)
}

function removeProduct(product){
	const index = productsCart.findIndex(p => p.id === product.id);
	if (index !== -1) {
		productsCart.splice(index, 1);
		renderCart(productsCart);
	}
}



function addCountProduct(product){
	const productInCart = productsCart.find(p => p.id === product.id);
	if (productInCart) {
		productInCart.count += 1;
		renderCart(productsCart);
	}
}


function calcTotal(productsCart) {
	return productsCart.reduce((total, product) => total + (product.precio * product.count), 0);
}

function showDropdown() {
	document.querySelector('.dropdown-menu').style.opacity = '1';
	document.querySelector('.dropdown-menu').style.visibility = 'visible';
}

function hideDropdown() {
	document.querySelector('.dropdown-menu').style.opacity = '0';
	document.querySelector('.dropdown-menu').style.visibility = 'hidden';
}


function proceedPurchase(){
	hideDropdown()
	renderPurchase()
	clearShoppingCart()
	openDialog()
}

function openDialog() {
	document.getElementById('modalDialog').showModal();
}

function closeDialog() {
	document.getElementById('modalDialog').close();
}


function renderPurchase(){

	listPurchaseElement.innerHTML = ''

	productsCart.forEach((product) => {
		const productPurchaseElement = productPurchase(product)
		listPurchaseElement.appendChild(productPurchaseElement)
	})

	const totalElement = createElement('p', 'Total:', `${calcTotal(productsCart)} €`)
	listPurchaseElement.appendChild(totalElement)

}

function productPurchase(product){
	const span = createElement('span', '', `${product.nombre} - €${product.precio} x ${product.count}`)

	return span
}
