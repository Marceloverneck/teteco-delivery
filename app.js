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
  cart.forEach(item => {
    message += `- ${item.name} - R$ ${item.price.toFixed(2)}\n`;
  });
  const total = cart.reduce((s,x) => s + x.price, 0).toFixed(2);
  message += `\nTotal: R$ ${total}`;

  const phone = "5521999998888";  // seu número completo aqui
  const encoded = encodeURIComponent(message);

  // Se for móvel, usa wa.me; se for desktop, usa web.whatsapp.com
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const url = isMobile
    ? `https://wa.me/${phone}?text=${encoded}`
    : `https://web.whatsapp.com/send?phone=${phone}&text=${encoded}`;

  window.open(url, "_blank");
});
