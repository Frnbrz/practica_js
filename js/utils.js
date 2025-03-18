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

/**
 * Creates a product card element.
 * @param {Object} product - The product object.
 * @returns {HTMLElement} The product card element.
 */
function createProductCard({ imagen, nombre, descripcion, id, stock }) {
	const article = createHTMLElement('article');

	const figure = createHTMLElement('figure', '', `<img src="${imagen}" alt="${nombre}" />`);
	article.appendChild(figure);

	const articleBody = createHTMLElement('div', 'article-body');

	const h2 = createHTMLElement('h2', '', nombre);
	articleBody.appendChild(h2);

	const descP = createHTMLElement('p', '', descripcion);
	articleBody.appendChild(descP);

	const button = createButton('Añadir al carrito', () => addProductToCart(id), 'button-primary');

	if (stock === 0) {
		button.disabled = true;
	}

	articleBody.appendChild(button);

	article.appendChild(articleBody);
	return article;
}

/**
 * Creates a button element.
 * @param {string} text - The button text.
 * @param {Function} onClick - The click event handler.
 * @param {string} type - The button type class.
 * @returns {HTMLButtonElement} The button element.
 */
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

// Crear una función auxiliar para reducir la repetición
/**
 * Creates an HTML element with optional class and inner HTML.
 * @param {string} tag - The HTML tag name.
 * @param {string} [className=''] - The class name.
 * @param {string} [innerHTML=''] - The inner HTML content.
 * @returns {HTMLElement} The created HTML element.
 */
function createHTMLElement(tag, className = '', innerHTML = '') {
	const element = document.createElement(tag);
	if (className) element.className = className;
	if (innerHTML) element.innerHTML = innerHTML;
	return element;
}

/**
 * Renders a list of products.
 * @param {Array} productos - The list of products.
 */
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

/**
 * Creates a shopping cart item element.
 * @param {Object} product - The product object.
 * @returns {HTMLElement} The shopping cart item element.
 */
function createShoppingCart({ precio, count, nombre, id, stock }) {
	const div = createElement('div', '', '')
	const span = createElement('span', '', `${nombre} - €${precio} x ${count}`)

	const buttonRemove = createButton('❌', () => removeProduct(id), 'button-icon')
	const buttonPlus = createButton('+', () => addCountProduct(id), 'button-red button-sm')
	const buttonLess = createButton('-', () => removeCountProduct(id), 'button-red button-sm')



	if (stock === count) {
		buttonPlus.disabled = true;
		document.querySelector(`article[id="${id - 1}"] button`).disabled = true
	}


	div.append(buttonRemove, span, buttonPlus, buttonLess)

	return div

}

/**
 * Renders the shopping cart.
 * @param {Array} productsCart - The list of products in the cart.
 */
function renderCart(productsCart) {
	cartListElement.innerHTML = ''

	productsCart.forEach((product, index) => {
		const productElement = createShoppingCart(product)
		productElement.setAttribute('id', index)
		cartListElement.appendChild(productElement)
	})
	cartTotalElement.textContent = `${calcTotal(productsCart)} €`
}

/**
 * Decreases the count of a product in the cart.
 * @param {Object} product - The product object.
 */
function removeCountProduct(id) {
	const productInCart = productsCart.find(p => p.id === id);
	if (productInCart) {
		productInCart.count -= 1;
		if (productInCart.count === 0) {
			removeProduct(id);
			saveToLocalStorage('productsCart', productsCart);
			renderCart(productsCart);
		} else {
			renderCart(productsCart);
		}
	}
}

/**
 * Saves a value to local storage.
 * @param {string} key - The storage key.
 * @param {any} value - The value to store.
 */
function saveToLocalStorage(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Retrieves a value from local storage.
 * @param {string} key - The storage key.
 * @returns {any} The retrieved value.
 */
function getFromLocalStorage(key) {
	const value = localStorage.getItem(key);
	return value ? JSON.parse(value) : null;
}


/**
 * Adds a product to the cart or increases its count if already in the cart.
 * @param {Object} product - The product object.
 */
function addProductToCart(id) {
	const productInCart = productsCart.find(p => p.id === id);
	if (productInCart) {
		addCountProduct(id);
	} else {
		const product = productos.find(p => p.id === id);
		const newProduct = {
			id: product.id,
			nombre: product.nombre,
			precio: product.precio,
			stock: product.stock,
			count: 1
		};
		productsCart.push(newProduct);
		saveToLocalStorage('productsCart', productsCart);
	}
	renderCart(productsCart);
	showDropdown();
}

/**
 * Clears the shopping cart.
 */
function clearShoppingCart() {
	productsCart = []
	renderCart(productsCart)
}

/**
 * Removes a product from the cart.
 * @param {Object} product - The product object.
 */
function removeProduct(id) {
	const index = productsCart.findIndex(p => p.id === id);
	if (index !== -1) {
		productsCart.splice(index, 1);
		saveToLocalStorage('productsCart', productsCart);
		renderCart(productsCart);
	}
}

/**
 * Increases the count of a product in the cart.
 * @param {Object} product - The product object.
 */
function addCountProduct(id) {
	const productInCart = productsCart.find(p => p.id === id);
	if (productInCart) {
		productInCart.count += 1;
		renderCart(productsCart);
	}
}



/**
 * Calculates the total price of the products in the cart.
 * @param {Array} productsCart - The list of products in the cart.
 * @returns {number} The total price.
 */
function calcTotal(productsCart) {
	return productsCart.reduce((total, product) => total + (product.precio * product.count), 0);
}

/**
 * Shows the dropdown menu.
 */
function showDropdown() {
	document.querySelector('.dropdown-menu').style.opacity = '1';
	document.querySelector('.dropdown-menu').style.visibility = 'visible';
}

/**
 * Hides the dropdown menu.
 */
function hideDropdown() {
	document.querySelector('.dropdown-menu').style.opacity = '0';
	document.querySelector('.dropdown-menu').style.visibility = 'hidden';
}

/**
 * Proceeds with the purchase process.
 */
function proceedPurchase() {
	hideDropdown()
	renderPurchase()
	stockValidate()
	clearShoppingCart()
	openDialog()
}




/**
 * Update products stock
 * @function stockValidate
 */
function stockValidate() {
	productsCart.forEach(cartItem => {
		const product = productos.find(p => p.id === cartItem.id);
		if (product) {
			product.stock -= cartItem.count;
		}
	});
}

/**
 * Opens the modal dialog.
 */
function openDialog() {
	document.getElementById('modalDialog').showModal();
}

/**
 * Closes the modal dialog.
 */
function closeDialog() {
	document.getElementById('modalDialog').close();
}

/**
 * Renders the purchase summary.
 */
function renderPurchase() {

	listPurchaseElement.innerHTML = ''

	productsCart.forEach((product) => {
		const productPurchaseElement = productPurchase(product)
		listPurchaseElement.appendChild(productPurchaseElement)
	})

	const totalElement = createElement('p', 'Total:', `${calcTotal(productsCart)} €`)
	listPurchaseElement.appendChild(totalElement)

}

/**
 * Creates an element for a purchased product
 * @param {Object} product - The product object.
 * @returns {HTMLElement} The purchased product element.
 */
function productPurchase({ count, nombre, precio }) {
	const span = createElement('span', '', `${nombre} - €${precio} x ${count}`)

	return span
}
