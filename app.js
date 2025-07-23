const menuContainer   = document.getElementById('menuContainer');
const cartContainer   = document.getElementById('cartItems');
const cartTotal       = document.getElementById('cartTotal');
const whatsAppBtn     = document.getElementById('whatsAppBtn');
const adminPanel      = document.getElementById('adminPanel');
const adminLoginBtn   = document.getElementById('adminLoginBtn');
const logoutBtn       = document.getElementById('logoutBtn');
const adminDishList   = document.getElementById('adminDishList');

let isAdmin = false;
let menu    = JSON.parse(localStorage.getItem('menu')) || [
  { name: "Churrasco Misto", desc: "Contra filé, frango, linguiça, arroz, farofa, maionese e salada.", price: 28.99 },
  { name: "Risoto de Camarão", desc: "Camarão, arroz branco, creme de leite e milho (opcional).", price: 29.99 }
];
let cart    = [];

function renderMenu() {
  menuContainer.innerHTML = "";
  menu.forEach((item, i) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${item.name} – R$ ${item.price.toFixed(2)}</h3>
      <p>${item.desc}</p>
      <button onclick="addToCart(${i})">Adicionar</button>
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
  let msg = "Olá, gostaria de pedir:\n";
  cart.forEach(item => { msg += `- ${item.name} - R$ ${item.price.toFixed(2)}\n`; });
  msg += `Total: R$ ${cart.reduce((s, x) => s + x.price, 0).toFixed(2)}`;
  window.open(`https://wa.me/5521997291267?text=${encodeURIComponent(msg)}`, '_blank');
});

adminLoginBtn.addEventListener('click', () => {
  const pwd = prompt("Digite a senha de administrador:");
  if (pwd === "admin") {
    isAdmin = true;
    adminPanel.style.display = "block";
    logoutBtn.style.display  = "inline-block";
    renderAdminMenu();
  } else {
    alert("Senha incorreta!");
  }
});

// Logout: voltar ao modo cliente
logoutBtn.addEventListener('click', () => {
  isAdmin = false;
  adminPanel.style.display = "none";
  logoutBtn.style.display  = "none";
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
  if (n && d && !isNaN(p)) {
    menu.push({ name: n, desc: d, price: p });
    localStorage.setItem('menu', JSON.stringify(menu));
    renderMenu();
  }
}

function editDish(i) {
  const n = prompt("Novo nome:", menu[i].name);
  const d = prompt("Nova descrição:", menu[i].desc);
  const p = prompt("Novo preço:", menu[i].price);
  if (n && d && p) {
    menu[i] = { name: n, desc: d, price: parseFloat(p) };
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

renderMenu();
renderCart();
