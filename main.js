const { useState, useEffect, useMemo } = React;
// lucide is globally available but the structure might be different in UMD build
// We access icons directly from lucide object in the component to be safe

// --- Logic ---
const calculatePrice = (netAmount, method) => {
  if (!netAmount) return 0;

  const base = parseFloat(method.comisionBase) || 0;
  const financ = parseFloat(method.comisionFinanc) || 0;

  // Logic:
  // If incluyeIVA is true: Eff = Base + Financ
  // If incluyeIVA is false: Eff = (Base + Financ) * 1.21
  let effectiveCommission = base + financ;
  if (!method.incluyeIVA) {
    effectiveCommission *= 1.21;
  }

  if (effectiveCommission >= 100) return 0; // Prevent division by zero or negative

  return netAmount / (1 - (effectiveCommission / 100));
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
};

// --- Initial Data ---
const initialPaymentMethods = [
  {
    id: 1,
    medioCobro: 'NAVE',
    medioPago: 'Tarjeta de Crédito',
    cuotas: 1,
    banco: 'Todos',
    comisionBase: 4.5,
    comisionFinanc: 0,
    incluyeIVA: false,
    diasAcreditacion: 0,
    instrucciones: 'Link de Pago NAVE'
  },
  {
    id: 2,
    medioCobro: 'PayWay',
    medioPago: 'Tarjeta de Crédito',
    cuotas: 1,
    banco: 'Todos',
    comisionBase: 1.97,
    comisionFinanc: 0,
    incluyeIVA: false,
    diasAcreditacion: 0,
    instrucciones: ''
  }
];

// --- Components ---

const LucideIcon = ({ name, size = 20, className = "" }) => {
  // Access global lucide object
  // In some UMD builds, it might be lucide.icons[name] or just lucide[name]
  // We check both
  const Icon = window.lucide && (window.lucide.icons ? window.lucide.icons[name] : window.lucide[name]);

  if (!Icon) {
      console.warn(`Icon ${name} not found`);
      return <span className={className}>{name}</span>;
  }

  // In the UMD build, Icon is likely an object with 'toSvg' method or similar,
  // but if we are using lucide-react (which we are not, we are using lucide vanilla script),
  // we need to be careful.

  // Actually, the UMD script https://unpkg.com/lucide@latest provides `lucide` global.
  // It has `createIcons`, `icons` (object with icon definitions).
  // But to use it in React easily without compiling, we might need a different approach
  // OR use `lucide-react` UMD if available.

  // However, simpler approach for vanilla + react:
  // Render an <i data-lucide={name}></i> and run lucide.createIcons() in useEffect.

  const iconRef = React.useRef(null);

  useEffect(() => {
    if (window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons({
        root: iconRef.current ? iconRef.current.parentNode : document,
        nameAttr: 'data-lucide',
        attrs: {
            class: className,
            width: size,
            height: size
        }
      });
    }
  }, [name, size, className]);

  return <i ref={iconRef} data-lucide={name.toLowerCase()} className={className} style={{ width: size, height: size, display: 'inline-block' }}></i>;
};

const Header = ({ currentView, onViewChange }) => (
  <header className="flex justify-center border-b bg-white py-4 shadow-sm mb-6">
    <nav className="flex space-x-8">
      <button
        onClick={() => onViewChange('calculator')}
        className={`flex items-center space-x-2 pb-2 px-2 text-lg font-medium transition-colors ${
          currentView === 'calculator'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <LucideIcon name="Calculator" size={20} />
        <span>Calculadora</span>
      </button>
      <button
        onClick={() => onViewChange('config')}
        className={`flex items-center space-x-2 pb-2 px-2 text-lg font-medium transition-colors ${
          currentView === 'config'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <LucideIcon name="Settings" size={20} />
        <span>Configuración</span>
      </button>
    </nav>
  </header>
);

const ResultCard = ({ method, price, isBest }) => (
  <div className={`relative p-5 rounded-lg border transition-shadow hover:shadow-md bg-white ${isBest ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
    {isBest && (
      <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
        Opción más económica
      </span>
    )}
    <h3 className="font-bold text-gray-900 text-lg mb-1 flex items-center">
        {method.medioCobro} <span className="text-sm font-normal text-gray-500 ml-2">({method.medioPago})</span>
    </h3>
    <div className="text-3xl font-bold text-gray-800 mb-2">
      {price > 0 ? formatCurrency(price) : '$0.00'}
    </div>
    <div className="text-sm text-gray-600 flex items-center gap-1">
       <LucideIcon name="Calendar" size={14} className="text-gray-400" />
       <span>Días para cobrar: {method.diasAcreditacion}</span>
    </div>
    {method.instrucciones && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
            {method.instrucciones}
        </div>
    )}
  </div>
);

const CalculatorView = ({ methods }) => {
  const [amount, setAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('Todos');

  // Get unique banks
  const banks = useMemo(() => {
    const allBanks = methods.map(m => m.banco || 'Todos');
    return ['Todos', ...new Set(allBanks.filter(b => b !== 'Todos'))];
  }, [methods]);

  // Group and calculate results
  const resultsByInstallments = useMemo(() => {
    if (!amount) return {};

    const netAmount = parseFloat(amount);

    // Filter by bank (include 'Todos' and specific bank matches)
    // Logic: If user selects 'Todos', show everything. If specific bank, show 'Todos' + specific bank.
    const filteredMethods = methods.filter(m =>
        selectedBank === 'Todos' ? true : (m.banco === 'Todos' || m.banco === selectedBank)
    );

    const grouped = {};

    filteredMethods.forEach(method => {
      const price = calculatePrice(netAmount, method);
      if (!grouped[method.cuotas]) {
        grouped[method.cuotas] = [];
      }
      grouped[method.cuotas].push({ method, price });
    });

    // Sort each group by price
    Object.keys(grouped).forEach(cuota => {
      grouped[cuota].sort((a, b) => a.price - b.price);
    });

    return grouped;
  }, [amount, methods, selectedBank]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Calculadora de Precio de Venta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monto neto a recibir</label>
            <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">$</span>
                <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ej: 15000"
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-lg"
                />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por banco</label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-lg appearance-none"
            >
              {banks.map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {Object.keys(resultsByInstallments).sort((a,b) => Number(a) - Number(b)).map(cuota => {
             const group = resultsByInstallments[cuota];
             const bestPrice = group[0].price; // First is lowest because we sorted

             return (
                <div key={cuota}>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        En {cuota} cuota(s)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.map((item, idx) => (
                            <ResultCard
                                key={item.method.id}
                                method={item.method}
                                price={item.price}
                                isBest={Math.abs(item.price - bestPrice) < 0.01}
                            />
                        ))}
                    </div>
                </div>
             )
        })}
        {amount && Object.keys(resultsByInstallments).length === 0 && (
            <div className="text-center text-gray-500 py-10">
                No se encontraron opciones para este filtro.
            </div>
        )}
      </div>
    </div>
  );
};

const ConfigView = ({ methods, onAdd, onEdit, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    medioCobro: '', medioPago: '', cuotas: 1, banco: 'Todos',
    comisionBase: 0, comisionFinanc: 0, incluyeIVA: false, diasAcreditacion: 0, instrucciones: ''
  });

  const resetForm = () => {
    setFormData({
        medioCobro: '', medioPago: '', cuotas: 1, banco: 'Todos',
        comisionBase: 0, comisionFinanc: 0, incluyeIVA: false, diasAcreditacion: 0, instrucciones: ''
    });
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
        onEdit({ ...formData, id: editingId });
    } else {
        onAdd({ ...formData, id: Date.now() });
    }
    resetForm();
  };

  const handleEditClick = (method) => {
    setFormData(method);
    setEditingId(method.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
                {editingId ? 'Editar Medio de Cobro' : 'Agregar Nuevo Medio de Cobro'}
            </h2>
            {editingId && (
                <button onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-700 underline">
                    Cancelar edición
                </button>
            )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Medio de Cobro</label>
                <input required type="text" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.medioCobro} onChange={e => setFormData({...formData, medioCobro: e.target.value})} />
            </div>
            <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Medio de Pago</label>
                <input required type="text" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.medioPago} onChange={e => setFormData({...formData, medioPago: e.target.value})} />
            </div>
            <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuotas</label>
                <input required type="number" min="1" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.cuotas} onChange={e => setFormData({...formData, cuotas: parseInt(e.target.value)})} />
            </div>
            <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Banco</label>
                <input required type="text" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.banco} onChange={e => setFormData({...formData, banco: e.target.value})} />
            </div>
            <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Comisión Base (%)</label>
                <input required type="number" step="0.01" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.comisionBase} onChange={e => setFormData({...formData, comisionBase: parseFloat(e.target.value)})} />
            </div>
            <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Comisión Financ. (%)</label>
                <input required type="number" step="0.01" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.comisionFinanc} onChange={e => setFormData({...formData, comisionFinanc: parseFloat(e.target.value)})} />
            </div>
            <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Días de Acreditación</label>
                <input required type="number" min="0" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.diasAcreditacion} onChange={e => setFormData({...formData, diasAcreditacion: parseInt(e.target.value)})} />
            </div>
            <div className="col-span-1 flex items-center pt-6">
                <input type="checkbox" id="iva" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    checked={formData.incluyeIVA} onChange={e => setFormData({...formData, incluyeIVA: e.target.checked})} />
                <label htmlFor="iva" className="ml-2 text-sm text-gray-700">Incluye IVA</label>
            </div>
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Instrucciones (opcional)</label>
                <input type="text" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.instrucciones} onChange={e => setFormData({...formData, instrucciones: e.target.value})} />
            </div>
            <div className="col-span-2">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors">
                    {editingId ? 'Guardar Cambios' : 'Agregar Medio de Pago'}
                </button>
            </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <h3 className="text-lg font-bold text-gray-800 p-6 border-b">Medios Guardados</h3>
        <div className="divide-y divide-gray-100">
            {methods.map(method => (
                <div key={method.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div>
                        <h4 className="font-bold text-gray-800">{method.medioCobro} - {method.medioPago}</h4>
                        <p className="text-sm text-gray-500">
                            Banco: {method.banco} | {method.cuotas} cuota(s) | Com: {method.comisionBase}% + {method.comisionFinanc}%
                            {method.incluyeIVA ? ' (Inc. IVA)' : ' (+ IVA)'}
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => handleEditClick(method)} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                            <LucideIcon name="Edit" size={18} />
                        </button>
                        <button onClick={() => onDelete(method.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors">
                            <LucideIcon name="Trash2" size={18} />
                        </button>
                    </div>
                </div>
            ))}
            {methods.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                    No hay medios de cobro configurados.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState('calculator');
  const [methods, setMethods] = useState(() => {
    const saved = localStorage.getItem('paymentMethods');
    return saved ? JSON.parse(saved) : initialPaymentMethods;
  });

  useEffect(() => {
    localStorage.setItem('paymentMethods', JSON.stringify(methods));
  }, [methods]);

  const addMethod = (method) => {
    setMethods([...methods, method]);
  };

  const editMethod = (updatedMethod) => {
    setMethods(methods.map(m => m.id === updatedMethod.id ? updatedMethod : m));
  };

  const deleteMethod = (id) => {
    if (confirm('¿Estás seguro de eliminar este medio de cobro?')) {
        setMethods(methods.filter(m => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      <Header currentView={view} onViewChange={setView} />

      {view === 'calculator' ? (
        <CalculatorView methods={methods} />
      ) : (
        <ConfigView
            methods={methods}
            onAdd={addMethod}
            onEdit={editMethod}
            onDelete={deleteMethod}
        />
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);