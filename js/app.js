/**
 * Lógica da Aplicação - Salgados PDI
 * Carrinho de compras, seleção de quantidades, checkout e integração WhatsApp
 */

// Estado da Aplicação
const state = {
  cart: [],
  selectedProduct: null,
  selectedQuantity: 50,
  currentCategory: 'todos',
  searchQuery: '',
};

// Formatação de Moeda
function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
  renderPricingTiers();
  renderProducts();
  setupEventListeners();
  updateCartUI();
  setupMinDate();
});

// Carregar carrinho do localStorage
function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('salgados_pdi_cart');
    if (saved) {
      state.cart = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Erro ao carregar carrinho:', e);
    state.cart = [];
  }
}

// Salvar carrinho no localStorage
function saveCartToStorage() {
  try {
    localStorage.setItem('salgados_pdi_cart', JSON.stringify(state.cart));
  } catch (e) {
    console.error('Erro ao salvar carrinho:', e);
  }
}

// Configura data mínima para o formulário (hoje ou amanhã)
function setupMinDate() {
  const dateInput = document.getElementById('orderDate');
  if (dateInput) {
    const today = new Date();
    // Sugere amanhã por padrão por ser encomenda
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }
}

// Renderizar Tabela de Preços Explicativa (conforme solicitado pelo usuário)
function renderPricingTiers() {
  const container = document.getElementById('pricingTiersContainer');
  if (!container) return;

  container.innerHTML = PRICING_TIERS.map(tier => `
    <div class="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
      <div class="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-6 -mt-6 z-0"></div>
      
      <div class="relative z-10">
        <div class="flex items-center justify-between mb-3">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${tier.badgeColor}">
            ${tier.badge}
          </span>
          <span class="text-xs font-medium text-slate-500">A partir de 50 un</span>
        </div>

        <h3 class="text-lg font-bold text-slate-800 mb-1">${tier.category}</h3>
        <p class="text-xs text-slate-500 mb-4 leading-relaxed">${tier.description}</p>
        
        <div class="bg-amber-50/70 rounded-xl p-3 mb-3 border border-amber-100/80">
          <div class="flex items-baseline justify-between mb-1.5">
            <span class="text-xs text-slate-600 font-medium">Preço Unitário:</span>
            <span class="text-base font-extrabold text-amber-700">${formatCurrency(tier.unitPrice)} <span class="text-xs font-normal text-slate-500">/un</span></span>
          </div>
          <div class="flex items-center justify-between text-xs pt-1 border-t border-amber-200/50">
            <span class="text-slate-600 font-semibold">50 un: <span class="text-slate-900 font-bold">${formatCurrency(tier.price50)}</span></span>
            <span class="text-amber-800 font-bold">100 un (Cento): ${formatCurrency(tier.price100)}</span>
          </div>
        </div>
      </div>

      <div class="relative z-10 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
        <span class="font-semibold text-slate-700">Opções:</span> ${tier.examples}
      </div>
    </div>
  `).join('');
}

// Renderizar Produtos
function renderProducts() {
  const container = document.getElementById('productsGrid');
  const countSpan = document.getElementById('itemsCount');
  if (!container) return;

  let filtered = PRODUCTS.filter(p => {
    const matchCategory = state.currentCategory === 'todos' || p.category === state.currentCategory;
    const matchSearch = p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                        p.description.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (countSpan) {
    countSpan.textContent = `${filtered.length} ${filtered.length === 1 ? 'item' : 'itens'}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 text-3xl mb-4">
          🔍
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-1">Nenhum salgado encontrado</h3>
        <p class="text-sm text-slate-500 max-w-sm mx-auto mb-4">Tente buscar por outro termo ou selecione uma categoria diferente.</p>
        <button onclick="resetFilters()" class="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition">
          Ver todos os salgados
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => {
    const price50 = product.unitPrice * 50;
    const price100 = product.unitPrice * 100;

    return `
      <div class="item-card bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col justify-between">
        <div>
          <!-- Imagem com Fallback -->
          <div class="product-image-container relative">
            <img 
              src="${product.image}" 
              alt="${product.name}" 
              loading="lazy"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=700&q=80';"
            />
            <span class="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-slate-100">
              ${product.categoryLabel}
            </span>
            ${product.badge ? `
              <span class="absolute top-3 right-3 bg-amber-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                ${product.badge}
              </span>
            ` : ''}
          </div>

          <!-- Conteúdo -->
          <div class="p-4 sm:p-5">
            <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-1.5 line-clamp-1">
              ${product.name}
            </h3>
            <p class="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
              ${product.description}
            </p>

            <!-- Preço Claro e Visível -->
            <div class="bg-amber-50/60 rounded-xl p-2.5 mb-4 border border-amber-100">
              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-600 font-medium">Unidade:</span>
                <span class="font-bold text-amber-700 text-sm">${formatCurrency(product.unitPrice)}</span>
              </div>
              <div class="flex items-center justify-between text-[11px] text-slate-500 mt-1 pt-1 border-t border-amber-200/40">
                <span>50 un: <b class="text-slate-800">${formatCurrency(price50)}</b></span>
                <span>100 un: <b class="text-amber-800">${formatCurrency(price100)}</b></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Botão Escolher Quantidade -->
        <div class="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
          <button 
            onclick="openQuantityModal('${product.id}')"
            class="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>Escolher Quantidade</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Abrir Modal de Seleção de Quantidade
function openQuantityModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  state.selectedProduct = product;
  state.selectedQuantity = 50; // Inicia em 50 conforme padrão solicitado

  const modal = document.getElementById('quantityModal');
  const modalContent = document.getElementById('quantityModalContent');

  updateQuantityModalContent();

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');

  // Animação de entrada
  setTimeout(() => {
    modalContent.classList.remove('translate-y-full', 'scale-95', 'opacity-0');
  }, 10);
}

// Fechar Modal de Quantidade
function closeQuantityModal() {
  const modal = document.getElementById('quantityModal');
  const modalContent = document.getElementById('quantityModalContent');

  modalContent.classList.add('translate-y-full', 'scale-95', 'opacity-0');
  setTimeout(() => {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    state.selectedProduct = null;
  }, 200);
}

// Atualizar Conteúdo do Modal de Quantidade
function updateQuantityModalContent() {
  const product = state.selectedProduct;
  if (!product) return;

  const currentTotal = product.unitPrice * state.selectedQuantity;

  // Imagem e Info do Produto
  document.getElementById('modalProductImage').src = product.image;
  document.getElementById('modalProductImage').onerror = function() {
    this.src = 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=700&q=80';
  };
  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalProductDesc').textContent = product.description;
  document.getElementById('modalUnitPrice').textContent = `${formatCurrency(product.unitPrice)} / un`;

  // Renderizar Botões de Quantidade (50, 100, 150, 200, 250, 300, 350, 400, 450, 500)
  const pillsContainer = document.getElementById('quantityPillsContainer');
  pillsContainer.innerHTML = CONFIG.quantityOptions.map(qty => {
    const isActive = state.selectedQuantity === qty;
    return `
      <button 
        type="button"
        onclick="setQuantity(${qty})"
        class="qty-pill py-2.5 px-3 rounded-xl border text-sm font-bold flex flex-col items-center justify-center ${
          isActive 
            ? 'active' 
            : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-amber-400'
        }"
      >
        <span>${qty} un</span>
        <span class="text-[10px] opacity-80 font-normal">${formatCurrency(product.unitPrice * qty)}</span>
      </button>
    `;
  }).join('');

  // Atualizar input numérico e Subtotal
  const input = document.getElementById('customQuantityInput');
  if (input) input.value = state.selectedQuantity;

  document.getElementById('modalSummaryQuantity').textContent = `${state.selectedQuantity} unidades`;
  document.getElementById('modalSummaryTotal').textContent = formatCurrency(currentTotal);
  document.getElementById('modalAddButtonTotal').textContent = formatCurrency(currentTotal);
}

// Selecionar Quantidade pré-definida
function setQuantity(qty) {
  state.selectedQuantity = Math.max(50, qty);
  updateQuantityModalContent();
}

// Ajustar Quantidade via Botões +/- (passo de 50)
function adjustQuantity(delta) {
  const newQty = state.selectedQuantity + delta;
  if (newQty >= 50) {
    state.selectedQuantity = newQty;
    updateQuantityModalContent();
  } else {
    showToast('Quantidade mínima de encomenda é 50 unidades');
  }
}

// Ajustar Quantidade via Input
function onCustomQuantityChange(input) {
  let val = parseInt(input.value, 10);
  if (isNaN(val) || val < 50) {
    val = 50;
  }
  state.selectedQuantity = val;
  updateQuantityModalContent();
}

// Adicionar ao Carrinho a partir do Modal
function addToCartFromModal() {
  if (!state.selectedProduct) return;

  const product = state.selectedProduct;
  const quantity = state.selectedQuantity;
  const notes = document.getElementById('modalProductNotes')?.value.trim() || '';

  // Procura se já existe no carrinho para somar ou criar novo
  const existingIndex = state.cart.findIndex(item => item.productId === product.id && item.notes === notes);

  if (existingIndex > -1) {
    state.cart[existingIndex].quantity += quantity;
    state.cart[existingIndex].subtotal = state.cart[existingIndex].quantity * product.unitPrice;
  } else {
    state.cart.push({
      id: Date.now() + Math.random().toString(36).substr(2, 4),
      productId: product.id,
      name: product.name,
      category: product.category,
      unitPrice: product.unitPrice,
      quantity: quantity,
      subtotal: quantity * product.unitPrice,
      notes: notes,
      image: product.image
    });
  }

  saveCartToStorage();
  updateCartUI();
  closeQuantityModal();

  // Limpa notas
  const notesField = document.getElementById('modalProductNotes');
  if (notesField) notesField.value = '';

  // Toast de sucesso
  showToast(`✅ Adicionado: ${quantity}x ${product.name}!`);

  // Animação no botão do carrinho
  pulseCartBadge();
}

// Atualizar Interface do Carrinho
function updateCartUI() {
  const totalItems = state.cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = state.cart.reduce((acc, item) => acc + item.subtotal, 0);

  // Badges de contagem
  const badges = document.querySelectorAll('.cart-count-badge');
  badges.forEach(b => {
    b.textContent = state.cart.length; // Quantidade de itens diferentes
    b.classList.toggle('hidden', state.cart.length === 0);
  });

  // Barra flutuante inferior (Mobile)
  const bottomBar = document.getElementById('floatingCartBar');
  if (bottomBar) {
    if (state.cart.length > 0) {
      bottomBar.classList.remove('translate-y-full');
      document.getElementById('floatingCartUnits').textContent = `${totalItems} salgados (${state.cart.length} ${state.cart.length === 1 ? 'item' : 'itens'})`;
      document.getElementById('floatingCartTotal').textContent = formatCurrency(totalPrice);
    } else {
      bottomBar.classList.add('translate-y-full');
    }
  }

  // Atualizar Lista do Drawer se estiver aberto
  renderCartDrawer();
}

function pulseCartBadge() {
  const btn = document.getElementById('floatingCartBar');
  if (btn) {
    btn.classList.add('scale-105');
    setTimeout(() => btn.classList.remove('scale-105'), 200);
  }
}

// Abrir Gaveta/Modal do Carrinho
function openCart() {
  const modal = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const panel = document.getElementById('cartPanel');

  renderCartDrawer();

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');

  setTimeout(() => {
    overlay.classList.remove('opacity-0');
    panel.classList.remove('translate-x-full');
  }, 10);
}

// Fechar Gaveta/Modal do Carrinho
function closeCart() {
  const modal = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const panel = document.getElementById('cartPanel');

  overlay.classList.add('opacity-0');
  panel.classList.add('translate-x-full');

  setTimeout(() => {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }, 250);
}

// Renderizar Conteúdo do Carrinho
function renderCartDrawer() {
  const itemsContainer = document.getElementById('cartItemsList');
  const emptyState = document.getElementById('cartEmptyState');
  const filledState = document.getElementById('cartFilledState');
  if (!itemsContainer) return;

  if (state.cart.length === 0) {
    itemsContainer.innerHTML = '';
    emptyState?.classList.remove('hidden');
    filledState?.classList.add('hidden');
    return;
  }

  emptyState?.classList.add('hidden');
  filledState?.classList.remove('hidden');

  const totalSalgados = state.cart.reduce((acc, i) => acc + i.quantity, 0);
  const totalValor = state.cart.reduce((acc, i) => acc + i.subtotal, 0);
  const pessoasEstimadas = Math.round(totalSalgados / 12);

  // Estimativa de festa
  const estimateBadge = document.getElementById('cartEstimateBadge');
  if (estimateBadge) {
    estimateBadge.innerHTML = `
      <div class="flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200/60 rounded-xl p-3 text-xs">
        <span class="text-base">🎉</span>
        <div>
          <span class="font-bold">${totalSalgados} salgados encomendados:</span>
          <p class="text-slate-600">Ideal para aproximadamente <b>${pessoasEstimadas} a ${pessoasEstimadas + 3} convidados</b> (média de 10 a 12 salgados por pessoa).</p>
        </div>
      </div>
    `;
  }

  itemsContainer.innerHTML = state.cart.map((item, index) => `
    <div class="bg-white rounded-xl p-3.5 border border-slate-100 shadow-sm flex items-start gap-3">
      <img 
        src="${item.image}" 
        alt="${item.name}" 
        class="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-amber-50 border border-slate-100"
        onerror="this.src='https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=700&q=80';"
      />

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-1">
          <h4 class="text-sm font-bold text-slate-800 leading-snug line-clamp-1">${item.name}</h4>
          <button 
            onclick="removeCartItem('${item.id}')"
            class="text-slate-400 hover:text-rose-500 p-1 -mt-1 -mr-1 transition"
            title="Remover item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div class="text-xs text-slate-500 mt-0.5">
          ${formatCurrency(item.unitPrice)} un
        </div>

        ${item.notes ? `
          <div class="text-[11px] text-amber-700 bg-amber-50 rounded px-2 py-0.5 mt-1">
            Obs: ${item.notes}
          </div>
        ` : ''}

        <!-- Seletor de quantidade no carrinho -->
        <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
          <div class="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50">
            <button 
              onclick="changeCartItemQuantity('${item.id}', -50)"
              class="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-200 rounded-l-lg transition font-bold"
              title="Diminuir 50 unidades"
            >
              -
            </button>
            <span class="px-2 text-xs font-bold text-slate-800 min-w-[50px] text-center">
              ${item.quantity} un
            </span>
            <button 
              onclick="changeCartItemQuantity('${item.id}', 50)"
              class="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-200 rounded-r-lg transition font-bold"
              title="Aumentar 50 unidades"
            >
              +
            </button>
          </div>

          <span class="text-sm font-extrabold text-slate-900">
            ${formatCurrency(item.subtotal)}
          </span>
        </div>
      </div>
    </div>
  `).join('');

  // Atualiza totais no rodapé do drawer
  document.getElementById('cartDrawerTotalSalgados').textContent = `${totalSalgados} unidades`;
  document.getElementById('cartDrawerSubtotal').textContent = formatCurrency(totalValor);
  document.getElementById('cartDrawerFinalTotal').textContent = formatCurrency(totalValor);
}

// Alterar Quantidade de Item no Carrinho (passo de 50)
function changeCartItemQuantity(itemId, delta) {
  const item = state.cart.find(i => i.id === itemId);
  if (!item) return;

  const newQty = item.quantity + delta;
  if (newQty <= 0) {
    removeCartItem(itemId);
  } else {
    item.quantity = newQty;
    item.subtotal = item.quantity * item.unitPrice;
    saveCartToStorage();
    updateCartUI();
  }
}

// Remover Item do Carrinho
function removeCartItem(itemId) {
  state.cart = state.cart.filter(i => i.id !== itemId);
  saveCartToStorage();
  updateCartUI();
  showToast('Item removido do carrinho');
}

// Limpar Carrinho
function clearCart() {
  if (confirm('Deseja realmente limpar todos os itens do seu carrinho?')) {
    state.cart = [];
    saveCartToStorage();
    updateCartUI();
    showToast('Carrinho esvaziado');
  }
}

// Alternar campo de endereço dependendo do tipo de entrega
function toggleDeliveryAddress(type) {
  const addressContainer = document.getElementById('deliveryAddressSection');
  const pickupInfo = document.getElementById('pickupInfoSection');

  if (type === 'entrega') {
    addressContainer?.classList.remove('hidden');
    pickupInfo?.classList.add('hidden');
  } else {
    addressContainer?.classList.add('hidden');
    pickupInfo?.classList.remove('hidden');
  }
}

// Alternar campo de troco se pagamento for dinheiro
function togglePaymentChange(method) {
  const changeSection = document.getElementById('cashChangeSection');
  if (method === 'Dinheiro') {
    changeSection?.classList.remove('hidden');
  } else {
    changeSection?.classList.add('hidden');
  }
}

// FINALIZAR PEDIDO VIA WHATSAPP
// Envia exatamente para o WhatsApp com a mensagem formatada conforme solicitado
function finalizeOrder() {
  if (state.cart.length === 0) {
    showToast('⚠️ Seu carrinho está vazio! Selecione os salgados primeiro.');
    return;
  }

  // Coleta dados do formulário
  const customerName = document.getElementById('customerName')?.value.trim();
  const customerPhone = document.getElementById('customerPhone')?.value.trim();
  const deliveryType = document.querySelector('input[name="deliveryType"]:checked')?.value || 'Entrega';
  const street = document.getElementById('customerStreet')?.value.trim();
  const number = document.getElementById('customerNumber')?.value.trim();
  const neighborhood = document.getElementById('customerNeighborhood')?.value.trim();
  const reference = document.getElementById('customerReference')?.value.trim();
  const orderDate = document.getElementById('orderDate')?.value.trim();
  const orderTime = document.getElementById('orderTime')?.value.trim();
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'Pix';
  const cashChange = document.getElementById('cashChangeInput')?.value.trim();
  const generalNotes = document.getElementById('generalOrderNotes')?.value.trim();

  // Validação do Nome
  if (!customerName) {
    showToast('⚠️ Por favor, informe seu nome para o pedido.');
    document.getElementById('customerName')?.focus();
    return;
  }

  // Validação de Endereço se for Entrega
  if (deliveryType === 'Entrega' && (!street || !neighborhood)) {
    showToast('⚠️ Por favor, informe a Rua e o Bairro para entrega.');
    document.getElementById('customerStreet')?.focus();
    return;
  }

  // Montagem do Endereço
  let fullAddress = 'Retirada no balcão da Salgados PDI';
  if (deliveryType === 'Entrega') {
    fullAddress = `${street}${number ? ', Nº ' + number : ', S/N'} - Bairro: ${neighborhood}`;
    if (reference) {
      fullAddress += ` (Ponto de Ref: ${reference})`;
    }
  }

  // Totais
  const totalSalgados = state.cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = state.cart.reduce((acc, item) => acc + item.subtotal, 0);

  // Formatação da data para dd/mm/aaaa
  let formattedDate = 'A combinar';
  if (orderDate) {
    const parts = orderDate.split('-');
    if (parts.length === 3) {
      formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }

  // Construção do Texto do Pedido para o WhatsApp (conforme solicitado pelo usuário):
  // "Oi! Gostaria de fazer o pedido de: aqui, teria os itens selecionados com as quantidades, o nome do cliente e o endereço..."
  let message = `Oi! Gostaria de fazer o pedido de:\n\n`;

  message += `📋 *ITENS DA ENCOMENDA:*\n`;
  state.cart.forEach(item => {
    message += `• *${item.quantity}x ${item.name}* - ${formatCurrency(item.subtotal)}`;
    if (item.notes) {
      message += ` _(Obs: ${item.notes})_`;
    }
    message += `\n`;
  });

  message += `\n🎉 *Total de Salgados:* ${totalSalgados} unidades\n`;
  message += `💰 *Valor Total:* ${formatCurrency(totalPrice)}\n\n`;

  message += `👤 *DADOS PARA O ATENDIMENTO:*\n`;
  message += `• *Nome:* ${customerName}\n`;
  if (customerPhone) {
    message += `• *Telefone:* ${customerPhone}\n`;
  }
  message += `• *Tipo:* ${deliveryType === 'Entrega' ? '🛵 Entrega em Domicílio' : '🏬 Retirada no Local'}\n`;
  message += `• *Endereço:* ${fullAddress}\n`;
  message += `• *Data Desejada:* ${formattedDate}${orderTime ? ' às ' + orderTime : ''}\n`;
  message += `• *Forma de Pagamento:* ${paymentMethod}`;
  
  if (paymentMethod === 'Dinheiro' && cashChange) {
    message += ` (Troco para R$ ${cashChange})`;
  }
  message += `\n`;

  if (generalNotes) {
    message += `\n📝 *Observações Gerais:* ${generalNotes}\n`;
  }

  message += `\nObrigado! Aguardo a confirmação da encomenda.`;

  // Codificação para URL do WhatsApp
  const encodedText = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}&text=${encodedText}`;

  // Abre o WhatsApp
  window.open(whatsappUrl, '_blank');

  showToast('🚀 Abrindo WhatsApp para enviar seu pedido...');
}

// Configurar Filtros e Event Listeners
function setupEventListeners() {
  // Filtro por categorias
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => {
        b.classList.remove('bg-amber-600', 'text-white', 'shadow');
        b.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      });
      btn.classList.add('bg-amber-600', 'text-white', 'shadow');
      btn.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');

      state.currentCategory = btn.dataset.category;
      renderProducts();
    });
  });

  // Busca em tempo real
  const searchInput = document.getElementById('searchProductInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      renderProducts();
    });
  }
}

// Resetar Filtros
function resetFilters() {
  state.currentCategory = 'todos';
  state.searchQuery = '';
  const searchInput = document.getElementById('searchProductInput');
  if (searchInput) searchInput.value = '';

  const buttons = document.querySelectorAll('.category-btn');
  buttons.forEach(b => {
    if (b.dataset.category === 'todos') {
      b.classList.add('bg-amber-600', 'text-white', 'shadow');
      b.classList.remove('bg-white', 'text-slate-700', 'border');
    } else {
      b.classList.remove('bg-amber-600', 'text-white', 'shadow');
      b.classList.add('bg-white', 'text-slate-700', 'border');
    }
  });

  renderProducts();
}

// Toast Notificação
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// Compartilhar Cardápio (ideal para Instagram/WhatsApp)
function shareMenu() {
  const shareData = {
    title: 'Salgados PDI - Cardápio Online',
    text: 'Confira o cardápio e faça sua encomenda de salgados crocantes e deliciosos!',
    url: window.location.href,
  };

  if (navigator.share) {
    navigator.share(shareData).catch((err) => console.log('Erro ao compartilhar:', err));
  } else {
    // Copiar para área de transferência
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('📋 Link do cardápio copiado com sucesso!');
    }).catch(() => {
      showToast('Cardápio: ' + window.location.href);
    });
  }
}
