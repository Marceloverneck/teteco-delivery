const menuContainer   = document.getElementById('menuContainer');
const cartContainer   = document.getElementById('cartItems');
const cartTotal       = document.getElementById('cartTotal');
const whatsAppBtn     = document.getElementById('whatsAppBtn');
const adminPanel      = document.getElementById('adminPanel');
const adminLoginBtn   = document.getElementById('adminLoginBtn');
const logoutBtn       = document.getElementById('logoutBtn');
const adminDishList   = document.getElementById('adminDishList');

let isAdmin = false;
let menu = JSON.parse(localStorage.getItem('menu')) || [
  { name: "Churrasco Misto", desc: "Contra filé, frango, linguiça, arroz, farofa e maionese.", price: 28.99, image: "" },
  { name: "Risoto de Camarão", desc: "Camarão, arroz branco, creme de leite e milho (opcional).", price: 29.99, image: "" }
];
let cart = [];

function renderMenu() {
  menuContainer.innerHTML = "";
  menu.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = "bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col items-start space-y-2 mb-6";
    const imgUrl = item.image && item.image.trim().toLowerCase().startsWith('http')
                 ? item.image.trim()
                 : "https://via.placeholder.com/600x400";
    div.innerHTML = `
      <img src="${imgUrl}" alt="${item.name}" class="w-full h-auto rounded-md mb-2">
      <h3 class="text-xl font-bold text-amber-400">${item.name} – R$ ${item.price.toFixed(2)}</h3>
      <p class="text-gray-300">${item.desc}</p>
      <button onclick="addToCart(${i})" class="mt-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold py-2 px-4 rounded">
        Adicionar
      </button>
    `;
    menuContainer.appendChild(div);
  });
  if (isAdmin) renderAdminMenu();
}

function renderCart() {
  cartContainer.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - R$ ${item.price.toFixed(2)}`;
    cartContainer.appendChild(li);
    total += item.price;
  });
  cartTotal.textContent = total.toFixed(2).replace('.', ',');
}

function addToCart(i) {
  cart.push(menu[i]);
  renderCart();
}

whatsAppBtn.addEventListener('click', () => {
  const customerName = prompt("Por favor, digite seu nome:");
  if (!customerName) {
    alert("Você precisa informar seu nome para continuar o pedido.");
    return;
  }
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR");
  const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  let message = `*Novo Pedido*\nCliente: ${customerName}\nData: ${dateStr} ${timeStr}\n\n`;
  cart.forEach(item => message += `- ${item.name} - R$ ${item.price.toFixed(2)}\n`);
  const total = cart.reduce((s, x) => s + x.price, 0).toFixed(2);
  message += `\nTotal: R$ ${total}`;

  const phone = "5521997291267";  // <-- substitua pelo seu número completo (ex: 5521999998888)
  const encoded = encodeURIComponent(message);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const url = isMobile
    ? `https://wa.me/${5521997291267}?text=${encoded}`
    : `https://web.whatsapp.com/send?phone=${5521997291267}&text=${encoded}`;

  window.open(url, "_blank");
});

adminLoginBtn.addEventListener('click', () => {
  const pwd = prompt("Digite a senha de administrador:");
  if (pwd === "Marcelo") {
    isAdmin = true;
    adminPanel.style.display = "block";
    logoutBtn.style.display = "inline-block";
    renderAdminMenu();
  } else {
    alert("Senha incorreta!");
  }
});

logoutBtn.addEventListener('click', () => {
  isAdmin = false;
  adminPanel.style.display = "none";
  logoutBtn.style.display = "none";
  renderMenu();
});

function renderAdminMenu() {
  adminDishList.innerHTML = "";
  menu.forEach((item, i) => {
    const li = document.createElement('li');
    li.innerHTML = `${item.name} - R$ ${item.price.toFixed(2)} 
      <button onclick="editDish(${i})">✏️</button> 
      <button onclick="deleteDish(${i})">🗑️</button>`;
    adminDishList.appendChild(li);
  });
}

function addNewDish() {
  const n = document.getElementById('newDishName').value;
  const d = document.getElementById('newDishDesc').value;
  const p = parseFloat(document.getElementById('newDishPrice').value);
  const imgInput = document.getElementById('newDishImage').value.trim();
  const image = imgInput.toLowerCase().startsWith('http') ? imgInput : "";
  if (n && d && !isNaN(p)) {
    menu.push({ name: n, desc: d, price: p, image });
    localStorage.setItem('menu', JSON.stringify(menu));
    renderMenu();
    document.getElementById('newDishImage').value = '';
  }
}

function editDish(i) {
  const n = prompt("Novo nome:", menu[i].name);
  const d = prompt("Nova descrição:", menu[i].desc);
  const p = prompt("Novo preço:", menu[i].price);
  if (n && d && p) {
    menu[i] = { name: n, desc: d, price: parseFloat(p), image: menu[i].image };
    localStorage.setItem('menu', JSON.stringify(menu));
    renderMenu();
  }
}

function deleteDish(i) {
  if (confirm("Deseja excluir este prato?")) {
    menu.splice(i, 1);
    localStorage.setItem('menu', JSON.stringify(menu));
    renderMenu();
  }
}

// Inicializa
renderMenu();
renderCart();
