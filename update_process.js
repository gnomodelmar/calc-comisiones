const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const searchString = `            return {
              ...m,
              incluyeIVABase,
              incluyeIVAFinanc,
              fecha_inicio: m.fecha_inicio || "",`;

const replaceString = `            return {
              ...m,
              incluyeIVABase,
              incluyeIVAFinanc,
              baseACargo: m.baseACargo || "nosotros",
              financACargo: m.financACargo || "nosotros",
              fecha_inicio: m.fecha_inicio || "",`;

content = content.replace(searchString, replaceString);

fs.writeFileSync('index.html', content);
