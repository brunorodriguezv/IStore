const mainContainer = document.getElementById("mainContainer");
const cartBtn = document.getElementById("cartBtn");

// Función para mostrar una alerta y agregar un producto al carrito
function addToCart(productInfo) {
  const productName = productInfo.querySelector(".productTitle h2").textContent;
  const productPrice = productInfo.querySelector(".productPrice p").textContent;
  const productImage = productInfo.querySelector(".productImg").src;

  const product = {
    name: productName,
    price: productPrice,
    image: productImage,
  };

  // Obtener el carrito del localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Verificar si el producto ya está en el carrito
  const existingProduct = cart.find((item) => item.name === productName);

  if (existingProduct) {
    // Si el producto ya está en el carrito, aumenta la cantidad en 1 
    existingProduct.quantity += 1;
  } else {
    // Si el producto no está en el carrito, agregarlo
    product.quantity = 1;
    cart.push(product);
  }

  // Guardar el carrito actualizado en el localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Mostrar mensaje de éxito
  alert("Producto agregado al carrito");
}

// fetch a data.json 
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    const products = data.products;
    // por cada producto se crea un div class = "productCont"
    products.forEach(product => {
      const productElement = document.createElement("div");
      productElement.classList.add("productCont");

      const imageElement = document.createElement("img");
      imageElement.src = product.image;
      imageElement.classList.add("productImg");
      productElement.appendChild(imageElement);

      //formato de cada card
      productElement.innerHTML += `
        <div class="productDescription">
          <div class="productTitle"><h2>${product.name}</h2></div>
          <div class="productPrice"><p>${product.price}</p></div>
          <div class="cartBtnCont"><button class="addToCart">AÑADIR AL CARRITO</button></div>
        </div>
      `;

      mainContainer.appendChild(productElement);

      // Agregar evento al botón "AÑADIR AL CARRITO"
      const addToCartBtn = productElement.querySelector(".addToCart");
      addToCartBtn.addEventListener("click", () => addToCart(productElement));
    });
  })
  // manejo de error al realizar el fetch 
  .catch(error => {
    console.error("Error al cargar data.json:", error);
});

// Redirigir a la página del carrito al hacer clic en el botón "Ver Carrito"
cartBtn.addEventListener("click", () => {
  window.location.href = "cart.html";
});
