const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// Replace setFormData initial state
content = content.replace(
  /comisionBase: 0,\n\s*comisionFinanc: 0,\n\s*incluyeIVABase: false,\n\s*incluyeIVAFinanc: false,\n\s*diasAcreditacion: 0,/,
  'comisionBase: 0,\n          comisionFinanc: 0,\n          incluyeIVABase: false,\n          incluyeIVAFinanc: false,\n          baseACargo: "nosotros",\n          financACargo: "nosotros",\n          diasAcreditacion: 0,'
);

// Add fields to handleDuplicateClick
content = content.replace(
  /marketingNotes: "",\n\s*marketingImages: \[\],/,
  'marketingNotes: "",\n            marketingImages: [],\n            baseACargo: method.baseACargo || "nosotros",\n            financACargo: method.financACargo || "nosotros",'
);

// Update UI
const searchString = `                      <input
                        type="checkbox"
                        className="mr-2 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={formData.incluyeIVABase}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            incluyeIVABase: e.target.checked,
                          })
                        }
                      />
                      Incluye IVA
                    </label>
                  </div>`;

const replaceString = `                      <input
                        type="checkbox"
                        className="mr-2 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={formData.incluyeIVABase}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            incluyeIVABase: e.target.checked,
                          })
                        }
                      />
                      Incluye IVA
                    </label>
                    <label className="flex items-center text-sm text-gray-700 mt-2">
                      <select
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={formData.baseACargo || "nosotros"}
                        onChange={(e) =>
                          setFormData({ ...formData, baseACargo: e.target.value })
                        }
                      >
                        <option value="nosotros">Nosotros</option>
                        <option value="cliente">Cliente</option>
                      </select>
                    </label>
                  </div>`;

content = content.replace(searchString, replaceString);

const searchString2 = `                      <input
                        type="checkbox"
                        className="mr-2 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={formData.incluyeIVAFinanc}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            incluyeIVAFinanc: e.target.checked,
                          })
                        }
                      />
                      Incluye IVA
                    </label>
                  </div>`;

const replaceString2 = `                      <input
                        type="checkbox"
                        className="mr-2 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        checked={formData.incluyeIVAFinanc}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            incluyeIVAFinanc: e.target.checked,
                          })
                        }
                      />
                      Incluye IVA
                    </label>
                    <label className="flex items-center text-sm text-gray-700 mt-2">
                      <select
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={formData.financACargo || "nosotros"}
                        onChange={(e) =>
                          setFormData({ ...formData, financACargo: e.target.value })
                        }
                      >
                        <option value="nosotros">Nosotros</option>
                        <option value="cliente">Cliente</option>
                      </select>
                    </label>
                  </div>`;

content = content.replace(searchString2, replaceString2);

fs.writeFileSync('index.html', content);
