/**
 * Configurações Gerais e Cardápio - Salgados PDI
 * Edite os valores aqui facilmente para atualizar preços, contatos e itens do cardápio!
 */

const CONFIG = {
  storeName: "Salgados PDI",
  tagline: "Salgados artesanais crocantes e recheados para sua festa!",
  whatsappNumber: "5582996886925", // 82 99688-6925
  whatsappDisplay: "(82) 99688-6925",
  instagram: "@salgadospdi",
  instagramUrl: "https://instagram.com",
  city: "Alagoas",
  minimumOrder: 50, // Quantidade mínima por item
  quantityOptions: [50, 100, 150, 200, 250, 300, 350, 400, 450, 500],
  noticeLeadTime: "Encomendas com antecedência mínima de 24h a 48h.",
  defaultDeliveryFeeText: "A combinar de acordo com o bairro",
};

// Tabela explicativa de preços por categoria (exibida de forma clara e legível no site)
const PRICING_TIERS = [
  {
    category: "Salgados Fritos Tradicionais",
    unitPrice: 0.70,
    price50: 35.00,
    price100: 70.00,
    badge: "Mais Populares",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    description: "Massa leve e crocante, fritos em óleo novo, sequinhos e bem recheados.",
    examples: "Coxinha de frango, Pastelzinho, Bolinha de queijo, Quibe, Enroladinho, Risole."
  },
  {
    category: "Salgados Assados & Folhados",
    unitPrice: 0.80,
    price50: 40.00,
    price100: 80.00,
    badge: "Assados na Hora",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-300",
    description: "Massa artesanal fofinha e dourada, perfeitos para quem ama assados.",
    examples: "Esfirra de carne, Esfirra de frango com requeijão, Empadinha, Enroladinho assado."
  },
  {
    category: "Tortiletes & Salgados Especiais",
    unitPrice: 0.90,
    price50: 45.00,
    price100: 90.00,
    badge: "Gourmet / Doces",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
    description: "Massa crocante que derrete na boca com recheio nobre generoso e tortiletes doces.",
    examples: "Tortilete de frango cremoso, Tortilete doce de leite, Tortilete de limão."
  }
];

// Lista de Produtos do Cardápio
const PRODUCTS = [
  {
    id: "coxinha-frango",
    name: "Coxinha de Frango Cremosa",
    category: "fritos",
    categoryLabel: "Fritos",
    unitPrice: 0.70,
    badge: "Campeã de Vendas",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80",
    fallbackIcon: "🥟",
    description: "A clássica e irresistível coxinha com massa de caldo de galinha dourada, recheio generoso de frango desfiado suculento e tempero caseiro especial."
  },
  {
    id: "pastel-carne",
    name: "Pastelzinho de Carne Moída",
    category: "fritos",
    categoryLabel: "Fritos",
    unitPrice: 0.70,
    badge: "Tradicional",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80",
    fallbackIcon: "🥟",
    description: "Massa crocante e sequinha, recheada com carne moída de primeira, azeitonas picadinhas e cheiro-verde fresco."
  },
  {
    id: "esfirra-carne",
    name: "Esfirra de Carne Temperada",
    category: "assados",
    categoryLabel: "Assados",
    unitPrice: 0.80,
    badge: "Assado",
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=700&q=80",
    fallbackIcon: "🥐",
    description: "Massa macia e dourada, recheada com carne moída com toque especial de limão, cebola, tomate fresco e especiarias árabes suaves."
  },
  {
    id: "tortilete-frango",
    name: "Tortilete de Frango Especial",
    category: "tortiletes",
    categoryLabel: "Tortiletes & Especiais",
    unitPrice: 0.90,
    badge: "Especial",
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=700&q=80",
    fallbackIcon: "🥧",
    description: "Massa crocante amanteigada 'podre' que desmancha na boca, recheio generoso de frango desfiado com requeijão cremoso e gratinada."
  },
  {
    id: "bolinha-queijo",
    name: "Bolinha de Queijo Crocante",
    category: "fritos",
    categoryLabel: "Fritos",
    unitPrice: 0.70,
    badge: "Favorito",
    image: "https://images.unsplash.com/photo-1548340749-47575126f3e4?auto=format&fit=crop&w=700&q=80",
    fallbackIcon: "🧀",
    description: "Crostinha finíssima e crocante com recheio de queijo mussarela puxa-puxa derretido com leve toque de orégano."
  },
  {
    id: "quibe-recheado",
    name: "Quibe Tradicional Temperado",
    category: "fritos",
    categoryLabel: "Fritos",
    unitPrice: 0.70,
    badge: "Clássico",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=700&q=80",
    fallbackIcon: "🧆",
    description: "Trigo para quibe selecionado, carne moída de primeira bem temperada com hortelã fresca, alho e cebola."
  },
  {
    id: "enroladinho-salsicha",
    name: "Enroladinho de Salsicha",
    category: "fritos",
    categoryLabel: "Fritos",
    unitPrice: 0.70,
    badge: "Sucesso Infantil",
    image: "https://images.unsplash.com/photo-1627042633706-01a5e040c837?auto=format&fit=crop&w=700&q=80",
    fallbackIcon: "🌭",
    description: "Massa macia e dourada por fora envolvendo salsicha de qualidade, crocante e adorado por crianças e adultos em festas."
  },
  {
    id: "risole-presunto-queijo",
    name: "Risole de Presunto e Queijo",
    category: "fritos",
    categoryLabel: "Fritos",
    unitPrice: 0.70,
    badge: "Frito",
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=700&q=80",
    fallbackIcon: "🥟",
    description: "Massa fina empanada em farinha crocante, com recheio cremoso e generoso de presunto cozido e queijo mussarela derretido."
  },
  {
    id: "esfirra-frango",
    name: "Esfirra de Frango com Catupiry",
    category: "assados",
    categoryLabel: "Assados",
    unitPrice: 0.80,
    badge: "Assado",
    image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=700&q=80",
    fallbackIcon: "🥐",
    description: "Esfirra assada com massa macia, recheio farto de frango finamente desfiado combinado com catupiry cremoso."
  },
  {
    id: "empadinha-frango",
    name: "Empadinha de Frango com Azeitona",
    category: "assados",
    categoryLabel: "Assados",
    unitPrice: 0.80,
    badge: "Assado",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80",
    fallbackIcon: "🥧",
    description: "Tradicional massa podre que desmancha na boca com recheio úmido e suculento de frango bem temperadinho e azeitona."
  },
  {
    id: "tortilete-doce-leite",
    name: "Tortilete Doce de Leite Moça",
    category: "tortiletes",
    categoryLabel: "Tortiletes & Especiais",
    unitPrice: 0.90,
    badge: "Doce Gourmet",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=700&q=80",
    fallbackIcon: "🥧",
    description: "Casquinha crocante amanteigada recheada com doce de leite cremoso caramelizado no ponto certo. O doce perfeito para a festa!"
  },
  {
    id: "mini-churros",
    name: "Mini Churros de Doce de Leite",
    category: "tortiletes",
    categoryLabel: "Tortiletes & Especiais",
    unitPrice: 0.80,
    badge: "Doce",
    image: "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?auto=format&fit=crop&w=700&q=80",
    fallbackIcon: "🥖",
    description: "Mini churros crocantes passados no açúcar e canela, com recheio delicioso de doce de leite cremoso."
  }
];
