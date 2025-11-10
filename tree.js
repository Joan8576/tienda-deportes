// 🌳 --- ÁRBOL DE CATEGORÍAS ---
const treeContainer = document.getElementById('tree');
const treeError = document.getElementById('tree-error');

if (treeContainer) {
  fetch('data/productos.json')
    .then(res => res.json())
    .then(data => {
      const categorias = {};

      // agrupar productos por categoría
      data.productos.forEach(p => {
        if (!categorias[p.categoria]) categorias[p.categoria] = [];
        categorias[p.categoria].push(p.nombre);
      });

      // crear el árbol visual
      const ul = document.createElement('ul');
      ul.className = 'tree';

      for (const categoria in categorias) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = categoria;
        button.classList.add('categoria-btn');

        // al hacer clic en la categoría, filtra el catálogo
        button.addEventListener('click', () => {
          const filtrados = productos.filter(p => p.categoria === categoria);
          render(filtrados);
        });

        // lista de productos dentro de la categoría (opcional visualmente)
        const sublista = document.createElement('ul');
        sublista.hidden = true;
        categorias[categoria].forEach(prod => {
          const subLi = document.createElement('li');
          subLi.textContent = prod;
          sublista.appendChild(subLi);
        });

        // alternar visibilidad
        button.addEventListener('dblclick', () => {
          sublista.hidden = !sublista.hidden;
        });

        li.appendChild(button);
        li.appendChild(sublista);
        ul.appendChild(li);
      }

      treeContainer.appendChild(ul);
    })
    .catch(() => {
      treeError.hidden = false;
    });
}
