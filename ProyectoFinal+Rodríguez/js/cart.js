const cartTable = document.getElementById("cartTable");
const totalAmountElement = document.getElementById("totalAmount");
const cart = JSON.parse(localStorage.getItem("cart")) || [];


// Constantes para Modal de pago 
const mainModal = document.getElementById("mainModal");
const buyBtn = document.getElementById("buyBtn");
const closeBtn = document.getElementById("closeBtn")
const finishBuyBtn = document.getElementById("finishBuyBtn");
const creditCheckbox = document.getElementById("creditOption");
const transferCheckbox = document.getElementById("transferOption");
const creditInputs = document.querySelectorAll('.creditInputs input');
const transferInputs = document.querySelectorAll('.transferInputs input');
const pageOverlay = document.querySelector(".page-overlay");
const divModal = document.getElementById("paymentModal");
const cardNum = document.getElementById("cardNum");
const segNum = document.getElementById("segNum");
const inputVencimiento = document.getElementById("vencimiento");
const accNumInput = document.getElementById("accNum");
const formadepago = document.getElementById("formadepago")


let totalPrice = 0;

if (cart.length === 0) {
  document.getElementById("cartCont").style.display = "none";
  document.getElementById("checkoutDiv").style.display = "none";

  const emptyCartDiv = document.createElement("div");
  emptyCartDiv.classList.add("emptyCartAlert");
  document.body.appendChild(emptyCartDiv);

  const emptyCartMessage = document.createElement("h1");
  emptyCartMessage.textContent = "Carrito vacío";


  const goHome = document.createElement("a")
  goHome.classList.add("emptyCartLink");
  goHome.textContent = "INICIO";
  goHome.href = "index.html";

  emptyCartDiv.appendChild(emptyCartMessage);
  emptyCartDiv.appendChild(goHome);
}




document.addEventListener("DOMContentLoaded", function () {
  updateTotalPrice();  
  // Calcula el precio total al cargar la página

  // Agrega un evento de escucha al botón de envío
  const shippingRadios = document.querySelectorAll('input[name="shipping"]');
  shippingRadios.forEach(radio => {
    radio.addEventListener('change', updateTotalPrice);
  });
});

// Itera a través de los productos en el carrito y crea filas de tabla
cart.forEach((product, index) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><img src="${product.image}" alt="${product.name}" class="cartProductImage" style="max-width: 70px;"></td>
    <td><b>${product.name}</b></td>
    <td>${product.price}</td>
    <td>
    <button class="quantityBtn" onclick="decrementQuantity(${index})">-</button>
    <span class="quantitySpan" id="quantitySpan${index}">${product.quantity}</span>
    <button class="quantityBtn" onclick="incrementQuantity(${index})">+</button>
    </td>
    <td class="subtotal" id="subtotal${index}">U$S ${product.price.replace("U$S ", "")}</td>
    <td>  
      <button id="removeBtn${index}" onclick="removeProduct(${index})" class="removeProd">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
        </svg>
      </button>
    </td>
  `;
  cartTable.appendChild(row);

  // Suma el precio de cada producto al precio total
  totalPrice += parseFloat(product.price.replace("U$S ", ""));
});

// Muestra el precio total en el elemento totalAmount
totalAmountElement.textContent = `U$S ${totalPrice.toFixed(2)}`;


// función para incrementar la cantidad de un porducto 
function incrementQuantity(index) {
  const quantitySpan = document.getElementById(`quantitySpan${index}`);
  const currentQuantity = parseInt(quantitySpan.textContent);
  quantitySpan.textContent = currentQuantity + 1;

  // Actualiza la cantidad en el arreglo cart
  cart[index].quantity = currentQuantity + 1;

  // Guarda la información actualizada en el almacenamiento local
  localStorage.setItem("cart", JSON.stringify(cart));

  // Actualiza los subtotales y el precio total
  updateSubtotals(index);

  // Actualiza la cantidad directamente en el span después de la operación
  updateQuantitySpan(index);
}


// función para reducir la cantidad de un porducto 
function decrementQuantity(index) {
  const quantitySpan = document.getElementById(`quantitySpan${index}`);
  const currentQuantity = parseInt(quantitySpan.textContent);

  if (currentQuantity > 1) {
    quantitySpan.textContent = currentQuantity - 1;

    // Actualiza la cantidad en el arreglo cart
    cart[index].quantity = currentQuantity - 1;

    // Guarda la información actualizada en el almacenamiento local
    localStorage.setItem("cart", JSON.stringify(cart));

    // Actualiza los subtotales y el precio total
    updateSubtotals(index);

    // Actualiza la cantidad directamente en el span después de la operación
    updateQuantitySpan(index);
  }
}

// función para actualizar la cantidad en el span (la cantidad se tome del Storage)
function updateQuantitySpan(index) {
  const quantitySpan = document.getElementById(`quantitySpan${index}`);
  const currentQuantity = cart[index].quantity;
  quantitySpan.textContent = currentQuantity;
}

// función para actualizar el precio total en tiempo real 
function updateTotalPrice() {
  totalPrice = 0;
  const rows = cartTable.getElementsByTagName("tr");
  const subtotals = [];
// se recorre cada subtotal y se los suma. 
  for (let i = 0; i < rows.length; i++) {
    const subtotalCell = rows[i].querySelector(".subtotal");
    const subtotal = parseFloat(subtotalCell.textContent.replace("U$S ", ""));
    totalPrice += subtotal;
  }

// Verifica si la opción de envío está marcada y agrega $10 al costo total si esta checked 
  const shippingRadio = document.querySelector('input[name="shipping"][value="envio"]');
  const shippingCost = shippingRadio && shippingRadio.checked ? 10 : 0;

// Se actualiza y muestra el precio total sumandole el envio
  totalAmountElement.textContent = `U$S ${(totalPrice + shippingCost).toFixed(2)}`;
}

// función para actualizar los subtotales en tiempo real 
function updateSubtotals(index) {
  const rows = cartTable.getElementsByTagName("tr");
  const quantitySpan = rows[index].querySelector(".quantitySpan");
  const priceCell = rows[index].querySelector("td:nth-child(3)");
  const subtotalCell = rows[index].querySelector(".subtotal");
//cantidad de elementos de un producto
  const quantity = parseInt(quantitySpan.textContent);
//precio del producto  
  const price = parseFloat(priceCell.textContent.replace("U$S ", ""));
//multiplica los dos valores y da el subtotal de c/producto  
  const subtotal = quantity * price;
//se muestra el subtotal en su casilla 
  subtotalCell.textContent = `U$S ${subtotal.toFixed(2)}`;
// Actualiza el precio total después de modificar los subtotales
  updateTotalPrice();
}

// función para borrar productos del carrito
function removeProduct(index) {
// Elimina el producto del array
  cart.splice(index, 1);
// Actualiza el localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
// se recarga la pagina para que se borre en tiempo real
  location.reload();
}

/* cuando se entra a la página se da display = none al Modal, se checkea el input de credit 
y se deshabilitan los inputs de transferencia bancaria 
(es necesario para solucionar un bug con el input)
*/
window.addEventListener("load", () => {
  mainModal.style.display = "none";
  creditCheckbox.checked = true;
  disableInputs(transferInputs);
});

// evento para abrir el Modal de pago
buyBtn.addEventListener("click", () => {
  if (mainModal.style.display === "none") {
    mainModal.style.display = "block";
    pageOverlay.style.display = "block";
  }
});

// evento para cerrar el Modal de pago 
function closeModal() {
  closeBtn.addEventListener("click", () => {
    if (mainModal.style.display === "block") {
      mainModal.style.display = "none";
      pageOverlay.style.display = "none";
    }
  });
}

// Llamo a la función para arreglar Bug al cerrar el Modal. 
closeModal();

// se verifica si los inputs estan completos para realizar el pago
finishBuyBtn.addEventListener("click", () => {
  creditCheckbox.checked
    ? cardNum.value.length === 19 && segNum.value.length === 3 && inputVencimiento.value.length === 5
      ?
      Swal.fire({
        position: "center",
        icon: "success", title: "Compra realizada",
        showConfirmButton: false,
        timer: 1500
      })
      :
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Completa los datos correctamente"
      })
    :
    transferCheckbox.checked
      ? accNumInput.value.length === 14
        ? Swal.fire({
          position: "center",
          icon: "success",
          title: "Compra realizada",
          showConfirmButton: false,
          timer: 1500
        })
        :
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Completa los datos correctamente"
        })
      : null;

  closeModal();
});


// Función para habilitar inputs
function enableInputs(inputs) {
  inputs.forEach(input => {
    input.removeAttribute('disabled');
  });
}


// Función para deshabilitar inputs
function disableInputs(inputs) {
  inputs.forEach(input => {
    input.setAttribute('disabled', 'disabled');
  });
}


// Función para limpiar los inputs de tarjeta de crédito
function clearCreditInputs() {
  cardNum.value = '';
  segNum.value = '';
  inputVencimiento.value = '';
}


// Función para limpiar los inputs de transferencia
function clearTransferInputs() {
  accNumInput.value = '';
}


// Añadir event listener para desmarcar transferCheckbox cuando creditCheckbox se marque
creditCheckbox.addEventListener("change", function () {
  if (creditCheckbox.checked) {
    transferCheckbox.checked = false;
    enableInputs(creditInputs);
    disableInputs(transferInputs);
// Limpia los inputs de transferencia al cambiar al checkear el otro checkBox
    clearTransferInputs(); 
  }
});


// Añadir event listener para desmarcar creditCheckbox cuando transferCheckbox se marque
transferCheckbox.addEventListener("change", function () {
  if (transferCheckbox.checked) {
    creditCheckbox.checked = false;
    enableInputs(transferInputs);
    disableInputs(creditInputs);
// Limpia los inputs de tarjeta de crédito al cambiar al checkear el otro checkBox
    clearCreditInputs(); 
  }
});


// formato de input de numero de cuenta (XXXX-XXXX-XXXX) luego del caracter 4 y 8 coloca un "-"
accNumInput.addEventListener("input", function () {
  const value = accNumInput.value.replace(/[^\d]/g, '');

  if (value.length > 12) {
    accNumInput.value = value.slice(0, 12);
  } else if (value.length > 8) {
    accNumInput.value = value.slice(0, 4) + '-' + value.slice(4, 8) + '-' + value.slice(8);
  } else if (value.length > 4) {
    accNumInput.value = value.slice(0, 4) + '-' + value.slice(4);
  } else {
    accNumInput.value = value;
  }
});


// formato de input de vencimiento (mm/aa) luego del caracter 2 coloca un "/"
inputVencimiento.addEventListener("input", function () {
  let inputValue = inputVencimiento.value;

  if (/^\d{2}$/.test(inputValue)) {
    inputVencimiento.value = inputValue + "/";
  } else if (/^\d{2}\/\d{2}$/.test(inputValue)) {
    inputVencimiento.value = inputValue.slice(0, 5);
  }
});

