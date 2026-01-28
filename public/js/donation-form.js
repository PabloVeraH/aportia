
document.addEventListener('DOMContentLoaded', () => {
  const addItemBtn = document.getElementById('addItemBtn');
  const itemsContainer = document.getElementById('itemsContainer');
  const itemsTable = document.getElementById('itemsTable');
  const emptyState = document.getElementById('emptyState');
  const template = document.getElementById('itemRowTemplate');
  let rowIndex = 0;

  // --- Dynamic Rows ---
  addItemBtn.addEventListener('click', () => {
    const clone = template.content.cloneNode(true);
    const tr = clone.querySelector('tr');

    // Update Attributes with unique index
    tr.innerHTML = tr.innerHTML.replace(/INDEX/g, rowIndex);

    // Attach logic to new row
    setupRow(tr);

    itemsContainer.appendChild(tr);
    rowIndex++;
    updateEmptyState();
  });

  itemsContainer.addEventListener('click', (e) => {
    if (e.target.closest('.remove-row')) {
      e.target.closest('tr').remove();
      updateEmptyState();
    }
  });

  function updateEmptyState() {
    const hasRows = itemsContainer.children.length > 0;
    emptyState.style.display = hasRows ? 'none' : 'block';
    itemsTable.style.display = hasRows ? 'table' : 'none';

    // Hide table header if no rows (optional, keeping it simple)
  }

  // --- Autocomplete Logic ---
  function setupRow(row) {
    const input = row.querySelector('.product-search');
    const hiddenId = row.querySelector('.product-id');
    const unitInput = row.querySelector('input[name*="[unit]"]');
    const suggestionsBox = row.querySelector('.suggestions-box');
    let debounceTimer;

    input.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      clearTimeout(debounceTimer);

      if (query.length < 3) {
        suggestionsBox.classList.add('hidden');
        return;
      }

      debounceTimer = setTimeout(async () => {
        try {
          const res = await fetch(`/donations/api/products?q=${encodeURIComponent(query)}`);
          const products = await res.json();
          renderSuggestions(products, suggestionsBox, (product) => {
            input.value = product.name;
            hiddenId.value = product.id;
            unitInput.value = product.unit;
            suggestionsBox.classList.add('hidden');
          });
        } catch (err) {
          console.error('Error fetching products', err);
        }
      }, 300);
    });

    // Hide on click outside
    document.addEventListener('click', (e) => {
      if (!row.contains(e.target)) {
        suggestionsBox.classList.add('hidden');
      }
    });
  }

  function renderSuggestions(products, box, onSelect) {
    box.innerHTML = '';
    if (products.length === 0) {
      box.classList.add('hidden');
      return;
    }

    products.forEach(p => {
      const div = document.createElement('div');
      div.className = 'p-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-sm';
      div.textContent = `${p.name} (${p.unit})`;
      div.addEventListener('click', () => onSelect(p));
      box.appendChild(div);
    });

    box.classList.remove('hidden');
  }
});
