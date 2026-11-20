# 🥟 Cardápio Online - Salgados PDI

Cardápio online moderno, responsivo e adaptado para celulares, desenvolvido especialmente para a **Salgados PDI** para divulgação no Instagram e envio direto de encomendas para o WhatsApp: **(82) 99688-6925**.

---

## 🌟 Funcionalidades Principais

1. **📱 100% Adaptado para Celulares (Mobile-First)**:
   - Desenvolvido sob medida para clientes vindos do **Instagram** (Bio e Stories).
   - Modal em formato *bottom-sheet* deslizante no celular.
   - Barra flutuante de carrinho no rodapé com atualização em tempo real.
   - Botão para compartilhar link do cardápio direto nas redes sociais.

2. **🏷️ Guia de Preços Transparente e Legível**:
   - Seção destacada logo no topo com os valores detalhados por unidade e por cento.
   - Divisão clara por categorias:
     - **Fritos Tradicionais**: R$ 0,70 / un (50 un: R$ 35,00 | Cento: R$ 70,00)
     - **Assados & Folhados**: R$ 0,80 / un (50 un: R$ 40,00 | Cento: R$ 80,00)
     - **Tortiletes & Especiais**: R$ 0,90 / un (50 un: R$ 45,00 | Cento: R$ 90,00)
   - Dica de cálculo para festas (10 a 15 salgados por convidado).

3. **🔢 Seleção de Quantidades**:
   - Ao clicar no salgado, abre a tela com os botões rápidos de encomenda:
     **50, 100, 150, 200, 250, 300, 350, 400, 450, 500** unidades.
   - Botões de incremento `+` e `-` (passos de 50) e campo para digitar qualquer quantidade.
   - Campo para observações específicas de cada sabor (ex: *"bem fritinho"*, *"embalar separado"*).

4. **🛒 Carrinho de Compras & Resumo**:
   - Permite escolher múltiplos itens (ex: 50 coxinhas + 50 pastéis + 100 esfirras).
   - Resumo com foto, quantidade, subtotal e botões para ajustar ou remover.
   - Calculadora que estima a quantidade de convidados que o pedido atende.
   - Salva o carrinho no navegador (o cliente não perde o pedido se recarregar a página).

5. **📋 Formulário de Encomenda & Entrega**:
   - Nome completo do cliente.
   - Telefone de contato.
   - Escolha entre **Entrega em Casa** ou **Retirada no Local**.
   - Campos completos de endereço (Rua, Número, Bairro, Ponto de Referência).
   - Data desejada e horário estimado da festa/entrega.
   - Forma de pagamento (Pix, Dinheiro com troco, Cartão).

6. **📲 Envio Automático para o WhatsApp (82 99688-6925)**:
   - Ao clicar em **"Finalizar Pedido no WhatsApp"**, valida os campos e abre o WhatsApp com a mensagem formatada:
   ```text
   Oi! Gostaria de fazer o pedido de:

   📋 ITENS DA ENCOMENDA:
   • 50x Coxinha de Frango Cremosa - R$ 35,00
   • 50x Pastelzinho de Carne Moída - R$ 35,00
   • 100x Esfirra de Carne Temperada - R$ 80,00

   🎉 Total de Salgados: 200 unidades
   💰 Valor Total: R$ 150,00

   👤 DADOS PARA O ATENDIMENTO:
   • Nome: Carlos Eduardo
   • Tipo: 🛵 Entrega em Domicílio
   • Endereço: Rua das Flores, Nº 123 - Bairro: Centro (Ponto de Ref: Próximo à praça)
   • Data Desejada: 25/11/2026 às 18:00
   • Forma de Pagamento: Pix

   Obrigado! Aguardo a confirmação da encomenda.
   ```

---

## 📂 Estrutura dos Arquivos

```
salgadospdi/
├── index.html          # Página principal do cardápio online
├── css/
│   └── styles.css      # Estilização visual, animações e responsividade
├── js/
│   ├── products.js     # Configurações, contatos, preços e itens do cardápio
│   └── app.js          # Lógica do carrinho, modal e integração com WhatsApp
└── README.md           # Guia de uso e publicação
```

---

## 🚀 Como Visualizar e Testar no seu Computador

Basta dar **dois cliques no arquivo `index.html`** para abrir no seu navegador (Google Chrome, Edge, Safari, Firefox). Não precisa instalar nenhum programa adicional!

---

## 🌐 Como Colocar o Cardápio na Internet (Gratuito)

Para colocar o link na **Bio do seu Instagram**, você pode usar qualquer uma dessas opções gratuitas e rápidas:

### Opção 1: Netlify Drop (Mais fácil - 1 minuto)
1. Acesse [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arraste a pasta inteira `salgadospdi` para a tela do site.
3. Pronto! Ele gera um link na hora (ex: `salgadospdi.netlify.app`).

### Opção 2: Vercel (Muito rápido)
1. Acesse [vercel.com](https://vercel.com)
2. Importe o projeto ou use a CLI (`vercel`).
3. Seu cardápio fica no ar com certificado SSL gratuito.

### Opção 3: GitHub Pages
1. Crie um repositório no GitHub.
2. Suba os arquivos e ative o **GitHub Pages** nas configurações.
3. O link ficará disponível gratuitamente.

---

## ✏️ Como Alterar Preços, Adicionar Novos Salgados ou Mudar o Telefone

Tudo está organizado de forma simples no arquivo [`js/products.js`](file:///c:/Users/N%C3%BAcleo/Desktop/salgadospdi/js/products.js):

1. **Alterar o WhatsApp**:
   - Abra `js/products.js` e modifique `whatsappNumber: "5582996886925"`.
2. **Alterar Preços por Categoria**:
   - Edite os valores no array `PRICING_TIERS` (preço unitário, 50 un e 100 un).
3. **Adicionar ou Alterar Salgados**:
   - Edite o array `PRODUCTS` para alterar nome, preço, descrição ou imagem de cada salgado.
