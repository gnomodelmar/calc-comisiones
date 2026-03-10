const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Initial Data
const initialPaymentMethods = [
  {
    id: 1,
    medioCobro: "NAVE",
    medioPago: "Tarjeta de Crédito",
    cuotas: 1,
    banco: "Todos",
    comisionBase: 4.5,
    comisionFinanc: 0,
    incluyeIVABase: false,
    incluyeIVAFinanc: false,
    diasAcreditacion: 0,
    instrucciones: "Link de Pago NAVE",
    fecha_inicio: "",
    fecha_fin: "",
    dias_semana: [0, 1, 2, 3, 4, 5, 6],
    categoriaProducto: "",
    porcentaje_descuento_cliente: 0,
    tope_reintegro: 0,
    tipo_tope: "por_transaccion",
    fecha_ultima_edicion: new Date().toISOString(),
    esPromocion: false,
  },
  {
    id: 2,
    medioCobro: "PayWay",
    medioPago: "Tarjeta de Crédito",
    cuotas: 1,
    banco: "Todos",
    comisionBase: 1.97,
    comisionFinanc: 0,
    incluyeIVABase: false,
    incluyeIVAFinanc: false,
    diasAcreditacion: 0,
    instrucciones: "",
    fecha_inicio: "",
    fecha_fin: "",
    dias_semana: [0, 1, 2, 3, 4, 5, 6],
    categoriaProducto: "",
    porcentaje_descuento_cliente: 0,
    tope_reintegro: 0,
    tipo_tope: "por_transaccion",
    fecha_ultima_edicion: new Date().toISOString(),
    esPromocion: false,
  },
];

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialPaymentMethods, null, 2));
}

// Endpoint to get payment methods
app.get('/api/methods', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading data file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to save payment methods
app.post('/api/methods', (req, res) => {
  try {
    const newData = req.body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error writing data file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Serve the static frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve other files like images
app.use(express.static(__dirname));
