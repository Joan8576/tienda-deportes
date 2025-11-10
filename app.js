// --- 1. DATOS DE PRODUCTOS (Insertados directamente) ---
// Aquí hemos movido los datos de productos.json a una variable
const data = {
  "productos": [
    {
      "nombre": "Balón de fútbol Adidas Pro",
      "categoria": "Fútbol",
      "precio": 35000,
      "imagen": "balon-adidas.png"
    },
    {
      "nombre": "Tacos Nike Phantom GX",
      "categoria": "Fútbol",
      "precio": 72000,
      "imagen": "tacos-nike-phantom.png"
    },
    {
      "nombre": "Camiseta deportiva Dry-Fit",
      "categoria": "Fútbol",
      "precio": 25000,
      "imagen": "camiseta-dryfit.png"
    },
    {
      "nombre": "Balón Spalding TF-1000",
      "categoria": "Basketball",
      "precio": 44000,
      "imagen": "Balón.png"
    },
    {
      "nombre": "Rodilleras deportivas",
      "categoria": "Voleibol",
      "precio": 18000,
      "imagen": "rodilleras.png"
    },
    {
      "nombre": "Zapatos Asics Court",
      "categoria": "Voleibol",
      "precio": 61000,
      "imagen": "tenis.png"
    },
    {
      "nombre": "Kelme Nebula",
      "categoria": "Fútbol",
      "precio": 33420,
      "imagen": "kelme-nebula.png"
    },
    {
      "nombre": "Adidas FIFA world cup 26",
      "categoria": "Fútbol",
      "precio": 18658,
      "imagen": "adidas-worldcup26.png"
    },
    {
      "nombre": "Adidas kits shin guards",
      "categoria": "Fútbol",
      "precio": 12138,
      "imagen": "adidas-shinguards.png"
    },
    {
      "nombre": "Adidas starlancer soccer ball",
      "categoria": "Fútbol",
      "precio": 14828,
      "imagen": "adidas-starlancer.png"
    }
  ]
};


// --- 2. SELECTORES DEL DOM ---
const lista = document.getElementById('lista');
const filtro = document.getElementById('filtro');
const orden = document.getElementById('orden');
const treeContainer = document.getElementById('tree');
const treeError = document.getElementById('tree-error');

let productos = []; // Esta variable se llenará desde 'data'

// --- 3. RENDERIZADO Y FILTROS DE PRODUCTOS ---
if (lista) {
  // ⚙️ Cargar productos (¡AHORA DESDE LA VARIABLE LOCAL!)
  // Ya no usamos fetch aquí.
  try {
    productos = data.productos;
    render(productos);
  } catch (err) {
    lista.innerHTML = `<li>Error cargando productos 😢</li>`;
    console.error(err);
  }


  // 🔹 Renderizar productos (¡MODIFICADA PARA MOSTRAR IMAGEN!)
  function render(items) {
    lista.innerHTML = '';
    items.forEach(p => {
      const li = document.createElement('li');
      li.className = 'item fade-in';
      
      // Añadimos clases CSS para controlar el layout con la imagen
      li.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}" class="item-imagen">
        <div class="item-info">
          <strong>${p.nombre}</strong><br>
          <small>${p.categoria}</small>
        </div>
        <div class="item-accion">
          <span>₡${p.precio.toLocaleString()}</span>
          <button class="btn add" data-nombre="${p.nombre}" data-precio="${p.precio}" aria-label="Agregar ${p.nombre}">🛒</button>
        </div>
      `;
      lista.appendChild(li);
    });

    // Asignar eventos a los botones de agregar
    // (Esto debe correr CADA VEZ que se renderiza)
    document.querySelectorAll('.add').forEach(btn => {
      btn.addEventListener('click', e => {
        const nombre = e.target.dataset.nombre;
        const precio = parseFloat(e.target.dataset.precio);
        agregarAlCarrito(nombre, precio);
      });
    });
  }

  // 🔹 Filtrar productos
  if (filtro) {
    filtro.addEventListener('input', () => {
      const texto = filtro.value.toLowerCase();
      // Usamos la variable global 'productos' que ya cargamos
      const filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(texto)
      );
      render(filtrados);
    });
  }

  // 🔹 Ordenar productos
  if (orden) {
    orden.addEventListener('change', () => {
      // Obtenemos los productos actualmente filtrados (o todos)
      const texto = filtro.value.toLowerCase();
      let itemsActuales = productos.filter(p =>
        p.nombre.toLowerCase().includes(texto)
      );
      
      let ordenado = [...itemsActuales]; // Copiamos los items actuales

      switch (orden.value) {
        case 'az':
          ordenado.sort((a, b) => a.nombre.localeCompare(b.nombre)); break;
        case 'za':
          ordenado.sort((a, b) => b.nombre.localeCompare(a.nombre)); break;
        case 'precio-asc':
          ordenado.sort((a, b) => a.precio - b.precio); break;
        case 'precio-desc':
          ordenado.sort((a, b) => b.precio - a.precio); break;
      }
      render(ordenado);
    });
  }
}

// --- 4. CARRITO DE COMPRAS (Sin cambios) ---
const carritoListaEl = document.getElementById('lista-carrito');
const totalElCarrito = document.getElementById('total');
const vaciarBtnCarrito = document.getElementById('vaciar');
let carritoData = []; // Estado del carrito

// Agregar al carrito
function agregarAlCarrito(nombre, precio) {
  const existente = carritoData.find(item => item.nombre === nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    carritoData.push({ nombre, precio, cantidad: 1 });
  }
  renderCarrito();
  animarCarrito();
}

// Renderiza lista del carrito
function renderCarrito() {
  carritoListaEl.innerHTML = '';
  let total = 0;

  carritoData.forEach((item, i) => {
    const li = document.createElement('li');
    const subtotal = item.precio * item.cantidad;
    li.innerHTML = `
      <span>${item.nombre} (x${item.cantidad})</span>
      <span>₡${subtotal.toLocaleString()}</span>
      <button class="remove" data-index="${i}" aria-label="Quitar ${item.nombre}">❌</button>
    `;
    carritoListaEl.appendChild(li);
    total += subtotal;
  });

  totalElCarrito.innerHTML = `<strong>Total:</strong> ₡${total.toLocaleString()}`;

  // Evento para quitar productos
  document.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', e => {
      const index = e.target.dataset.index;
      carritoData.splice(index, 1);
      renderCarrito();
    });
  });
}

// Vaciar todo el carrito
if (vaciarBtnCarrito) {
  vaciarBtnCarrito.addEventListener('click', () => {
    carritoData = [];
    renderCarrito();
  });
}

// Animación del carrito
function animarCarrito() {
  const carritoEl = document.querySelector('.carrito');
  carritoEl.style.boxShadow = '0 0 20px var(--clr-accent)';
  carritoEl.style.transform = 'scale(1.02)';
  setTimeout(() => {
    carritoEl.style.boxShadow = '';
    carritoEl.style.transform = '';
  }, 400);
}

// --- 5. LÓGICA DE PEDIDO (Sin cambios) ---
const btnPedido = document.createElement('button');
btnPedido.textContent = '✅ Confirmar Pedido';
btnPedido.className = 'btn';
btnPedido.style.marginTop = '1rem'; // Pequeño ajuste estético
document.querySelector('#carrito').appendChild(btnPedido);

btnPedido.addEventListener('click', () => {
  if (carritoData.length === 0) {
    alert('Tu carrito está vacío 🛒');
    return;
  }
  mostrarVentanaPedido();
});

// Ventana de confirmación
function mostrarVentanaPedido() {
  const popup = document.createElement('div');
  popup.className = 'popup';
  const contenido = document.createElement('div');
  contenido.className = 'popup-content';
  
  let html = `<h3>Confirmar Pedido</h3><ul>`;
  carritoData.forEach(item => {
    html += `<li>${item.nombre} (x${item.cantidad}) — ₡${(item.precio * item.cantidad).toLocaleString()}</li>`;
  });
  html += `</ul><p><strong>Total:</strong> ${totalElCarrito.textContent.split(':')[1]}</p>`;
  html += `<button id="confirmarPedido" class="btn">Confirmar</button>
           <button id="cancelarPedido" class="btn" style="background:#777;margin-left:.5rem;">Cancelar</button>`;

  contenido.innerHTML = html;
  popup.appendChild(contenido);
  document.body.appendChild(popup);

  document.getElementById('cancelarPedido').addEventListener('click', () => popup.remove());
  document.getElementById('confirmarPedido').addEventListener('click', () => {
    popup.remove();
    mostrarVentanaFinal();
    carritoData = [];
    renderCarrito();
  });
}

// Ventana final de confirmación
function mostrarVentanaFinal() {
  const popup = document.createElement('div');
  popup.className = 'popup';
  const contenido = document.createElement('div');
  contenido.className = 'popup-content';
  contenido.innerHTML = `
    <h3>🎉 Pedido confirmado</h3>
    <p>Tu pedido se ha realizado con éxito.</p>
    <button id="cerrarPopup" class="btn">Cerrar</button>
  `;
  popup.appendChild(contenido);
  document.body.appendChild(popup);
  document.getElementById('cerrarPopup').addEventListener('click', () => popup.remove());
}


// --- 6. ÁRBOL DE CATEGORÍAS (Actualizado) ---
// Esta sección también usaba fetch. Ahora usa la variable 'data' local.
if (treeContainer) {
  try {
    const categorias = {};

    // Agrupar productos por categoría usando la variable local
    data.productos.forEach(p => {
      if (!categorias[p.categoria]) categorias[p.categoria] = [];
      categorias[p.categoria].push(p.nombre);
    });

    // Crear el árbol visual
    const ul = document.createElement('ul');
    ul.className = 'tree';

    for (const categoria in categorias) {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.textContent = categoria;
      button.classList.add('categoria-btn');

      // Al hacer clic en la categoría, filtra el catálogo
      button.addEventListener('click', () => {
        // Usamos la variable global 'productos'
        const filtrados = productos.filter(p => p.categoria === categoria);
        render(filtrados);
        // Opcional: Limpiar el filtro de texto
        if (filtro) filtro.value = '';
      });

      // (Tu lógica de sublista original - la mantengo)
      const sublista = document.createElement('ul');
      sublista.hidden = true;
      categorias[categoria].forEach(prod => {
        const subLi = document.createElement('li');
        subLi.textContent = prod;
        sublista.appendChild(subLi);
      });
      button.addEventListener('dblclick', () => {
        sublista.hidden = !sublista.hidden;
      });

      li.appendChild(button);
      li.appendChild(sublista);
      ul.appendChild(li);
    }
    treeContainer.appendChild(ul);

  } catch (err) {
    treeError.hidden = false;
    console.error("Error al construir árbol de categorías:", err);
  }
}
