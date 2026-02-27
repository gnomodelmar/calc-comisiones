// Mock Data
const initialPaymentMethods = [
  {
    id: 1,
    name: 'NAVE - Tarjeta de Crédito (1 cuotas)',
    bank: 'Todos',
    accreditation: '0 días',
    commission_percent: 4.5,
    commission_fixed: 0,
    commission_extra: '(+ IVA)',
    note: 'Link de Pago NAVE'
  },
  {
    id: 2,
    name: 'PayWay - Tarjeta de Crédito (1 cuotas)',
    bank: 'Todos',
    accreditation: '0 días',
    commission_percent: 1.97,
    commission_fixed: 0,
    commission_extra: '(+ IVA)',
    note: ''
  }
];

class PaymentMethodCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set data(method) {
    this._data = method;
    this.render();
  }

  render() {
    const { id, name, bank, accreditation, commission_percent, commission_fixed, commission_extra, note } = this._data;

    // Injected CSS
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
      }
      .payment-card {
        background-color: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 15px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .card-content {
        flex: 1;
      }
      .card-title {
        font-size: 1.1rem;
        font-weight: bold;
        margin: 0 0 8px 0;
        color: #000;
      }
      .card-detail {
        font-size: 0.95rem;
        color: #666;
        margin: 0 0 4px 0;
        line-height: 1.4;
      }
      .edit-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: background-color 0.2s;
        color: #666;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .edit-btn:hover {
        background-color: #f0f0f0;
        color: #007bff;
      }
      .edit-btn svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
      }
    `;

    const container = document.createElement('div');
    container.className = 'payment-card';

    const content = document.createElement('div');
    content.className = 'card-content';

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = name;

    const details = document.createElement('p');
    details.className = 'card-detail';
    details.textContent = `Banco: ${bank} | Acreditación: ${accreditation}`;

    const commissions = document.createElement('p');
    commissions.className = 'card-detail';
    commissions.textContent = `Comisiones: ${commission_percent}% + ${commission_fixed}% ${commission_extra}`;

    content.appendChild(title);
    content.appendChild(details);
    content.appendChild(commissions);

    if (note) {
      const noteEl = document.createElement('p');
      noteEl.className = 'card-detail';
      noteEl.textContent = `Nota: ${note}`;
      content.appendChild(noteEl);
    }

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.setAttribute('aria-label', 'Editar medio de cobro');
    editBtn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg>
    `;

    editBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('edit-request', {
        detail: { id },
        bubbles: true,
        composed: true
      }));
    });

    container.appendChild(content);
    container.appendChild(editBtn);

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
  }
}

class PaymentMethodList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set methods(data) {
    this._data = data;
    this.render();
  }

  render() {
    const style = document.createElement('style');
    style.textContent = `
      h2 {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 1.5rem;
        margin-bottom: 20px;
        font-weight: 600;
        color: #333;
      }
    `;

    const container = document.createElement('div');

    const title = document.createElement('h2');
    title.textContent = 'Medios de cobro guardados';
    container.appendChild(title);

    this._data.forEach(method => {
      const card = document.createElement('payment-method-card');
      card.data = method;
      container.appendChild(card);
    });

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
  }
}

class PaymentMethodEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set method(data) {
    this._data = data;
    this.render();
  }

  render() {
    if (!this._data) return;

    const style = document.createElement('style');
    style.textContent = `
      .editor-container {
        background-color: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 30px;
        max-width: 600px;
        margin: 0 auto;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      h2 {
        margin-top: 0;
        color: #333;
      }
      .form-group {
        margin-bottom: 20px;
      }
      .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #333;
      }
      .form-group input, .form-group textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-size: 1rem;
        box-sizing: border-box;
      }
      .button-group {
        display: flex;
        gap: 15px;
        margin-top: 30px;
        justify-content: flex-end;
      }
      .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: opacity 0.2s;
      }
      .btn:hover {
        opacity: 0.9;
      }
      .btn-primary {
        background-color: #007bff;
        color: white;
      }
      .btn-danger {
        background-color: #dc3545;
        color: white;
      }
      .btn-secondary {
        background-color: #e0e0e0;
        color: #333;
      }
    `;

    const form = document.createElement('div');
    form.className = 'editor-container';

    const title = document.createElement('h2');
    title.textContent = 'Editar medio de cobro';
    form.appendChild(title);

    const createInput = (label, name, value, type = 'text') => {
      const group = document.createElement('div');
      group.className = 'form-group';

      const labelEl = document.createElement('label');
      labelEl.textContent = label;
      labelEl.htmlFor = name;

      const input = document.createElement(type === 'textarea' ? 'textarea' : 'input');
      if (type !== 'textarea') input.type = type;
      input.id = name;
      input.value = value;
      input.name = name;

      group.appendChild(labelEl);
      group.appendChild(input);
      return group;
    };

    form.appendChild(createInput('Nombre', 'name', this._data.name));
    form.appendChild(createInput('Banco', 'bank', this._data.bank));
    form.appendChild(createInput('Acreditación', 'accreditation', this._data.accreditation));

    // Commission inputs
    const commPercent = createInput('Comisión (%)', 'commission_percent', this._data.commission_percent, 'number');
    form.appendChild(commPercent);

    form.appendChild(createInput('Comisión Fija', 'commission_fixed', this._data.commission_fixed, 'number'));

    form.appendChild(createInput('Nota', 'note', this._data.note || '', 'textarea'));

    const btnGroup = document.createElement('div');
    btnGroup.className = 'button-group';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-primary';
    saveBtn.textContent = 'Guardar modificación';
    saveBtn.onclick = () => {
      const updatedData = {
        ...this._data,
        name: form.querySelector('#name').value,
        bank: form.querySelector('#bank').value,
        accreditation: form.querySelector('#accreditation').value,
        commission_percent: parseFloat(form.querySelector('#commission_percent').value),
        commission_fixed: parseFloat(form.querySelector('#commission_fixed').value),
        note: form.querySelector('#note').value,
      };
      this.dispatchEvent(new CustomEvent('save-request', { detail: updatedData, bubbles: true, composed: true }));
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.textContent = 'Eliminar medio de cobro';
    deleteBtn.onclick = () => {
       this.dispatchEvent(new CustomEvent('delete-request', { detail: { id: this._data.id }, bubbles: true, composed: true }));
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.textContent = 'Cancelar'; // Optional, but good UX
    cancelBtn.onclick = () => {
        // Just reload the list view effectively acting as cancel
         this.dispatchEvent(new CustomEvent('save-request', { detail: null, bubbles: true, composed: true }));
    };


    btnGroup.appendChild(deleteBtn);
    // btnGroup.appendChild(cancelBtn); // Not explicitly asked for but good practice. Sticking to requirements strictly for now.
    btnGroup.appendChild(saveBtn);

    form.appendChild(btnGroup);

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(form);
  }
}

class PaymentMethodsApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      view: 'list', // 'list' or 'edit'
      methods: [...initialPaymentMethods],
      editingId: null
    };
  }

  connectedCallback() {
    this.render();
    this.addEventListener('edit-request', this.handleEditRequest.bind(this));
    this.addEventListener('save-request', this.handleSaveRequest.bind(this));
    this.addEventListener('delete-request', this.handleDeleteRequest.bind(this));
  }

  handleEditRequest(e) {
    this.state.view = 'edit';
    this.state.editingId = e.detail.id;
    this.render();
  }

  handleSaveRequest(e) {
    if (e.detail) {
        const updatedMethod = e.detail;
        this.state.methods = this.state.methods.map(m => m.id === updatedMethod.id ? updatedMethod : m);
    }
    // If detail is null (cancel), we just go back
    this.state.view = 'list';
    this.state.editingId = null;
    this.render();
  }

  handleDeleteRequest(e) {
    const idToDelete = e.detail.id;
    this.state.methods = this.state.methods.filter(m => m.id !== idToDelete);
    this.state.view = 'list';
    this.state.editingId = null;
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = ''; // Clear current view

    if (this.state.view === 'list') {
      const listComponent = document.createElement('payment-method-list');
      listComponent.methods = this.state.methods;
      this.shadowRoot.appendChild(listComponent);
    } else if (this.state.view === 'edit') {
      const editorComponent = document.createElement('payment-method-editor');
      const methodToEdit = this.state.methods.find(m => m.id === this.state.editingId);
      editorComponent.method = methodToEdit;
      this.shadowRoot.appendChild(editorComponent);
    }
  }
}

customElements.define('payment-method-card', PaymentMethodCard);
customElements.define('payment-method-list', PaymentMethodList);
customElements.define('payment-method-editor', PaymentMethodEditor);
customElements.define('payment-methods-app', PaymentMethodsApp);
