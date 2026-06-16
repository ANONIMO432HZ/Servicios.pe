import type { APIRoute } from 'astro';
import { fetchGovData } from '../../../lib/api-client';
import fs from 'fs';
import path from 'path';

const CSV_PATH = path.join(process.cwd(), 'data', 'consultas_dni.csv');

// Helper to parse CSV lines safely accounting for double quotes and semicolon delimiter
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ';' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export const GET: APIRoute = async () => {
  try {
    if (!fs.existsSync(CSV_PATH)) {
      return new Response(JSON.stringify({ success: true, data: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const content = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = content.split('\n');
    const data = [];

    // Skip header line (index 0)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const cleanFields = parseCsvLine(line);
      if (cleanFields.length >= 2) {
        const id = cleanFields[0];
        const datosCompletos = cleanFields[1] || '';
        
        let dni = '';
        let nombreCompleto = '';
        let estado = 'SUCCESS';
        
        // Parse error format: "12345678 - ERROR: ..."
        const errorMatch = datosCompletos.match(/^(\d{8}) - ERROR:\s*(.*)$/);
        // Parse success format: "12345678 - NAME"
        const successMatch = datosCompletos.match(/^(\d{8}) - (.*)$/);
        
        if (errorMatch) {
          dni = errorMatch[1];
          nombreCompleto = '';
          estado = `ERROR: ${errorMatch[2]}`;
        } else if (successMatch) {
          dni = successMatch[1];
          nombreCompleto = successMatch[2];
          estado = 'SUCCESS';
        } else {
          dni = '';
          nombreCompleto = datosCompletos;
          estado = 'SUCCESS';
        }

        data.push({
          id,
          dni,
          nombreCompleto,
          fecha: new Date().toISOString(), // Mock timestamp for UI rendering
          estado
        });
      }
    }

    // Return newest queries first
    return new Response(JSON.stringify({ success: true, data: data.reverse() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json();
    const { id, dni, queries } = body;

    // Support both single queries (id, dni) and bulk queries (queries array)
    const list = queries ? queries : [{ id, dni }];
    const results = [];

    const dir = path.dirname(CSV_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    if (!fs.existsSync(CSV_PATH)) {
      // Semicolon separator for native Excel compatibility in Spanish OS
      fs.writeFileSync(CSV_PATH, 'ID;Datos Completos\n', 'utf-8');
    }

    // Standard CSV escaping, only wrapping in quotes if characters require it
    const escapeCsv = (str: string) => {
      const val = (str || '').trim();
      if (val.includes(';') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const cleanId = (item.id || '').trim();
      const cleanDni = (item.dni || '').trim();
      const timestamp = new Date().toISOString();

      if (!/^\d{8}$/.test(cleanDni)) {
        // Save ID and the error line in Column 2
        const datosCompletosStr = `${cleanDni} - ERROR: DNI inválido (debe tener 8 dígitos)`;
        const row = `${escapeCsv(cleanId)};${escapeCsv(datosCompletosStr)}\n`;
        fs.appendFileSync(CSV_PATH, row, 'utf-8');
        results.push({
          id: cleanId,
          dni: cleanDni,
          nombreCompleto: '',
          fecha: timestamp,
          estado: 'ERROR: DNI inválido (debe tener 8 dígitos)'
        });
        continue;
      }

      // Throttle sequential requests in bulk to respect eldni.com rate limits
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      try {
        const response = await fetchGovData('dni', cleanDni, 'eldni');

        if (response.success && response.data) {
          const data = response.data;
          const rawName = data.nombre_completo || `${data.nombres || ''} ${data.apellido_paterno || ''} ${data.apellido_materno || ''}`;
          // Nombres y apellidos en mayúsculas, combinados sin comas
          const formattedName = rawName.replace(/,/g, '').toUpperCase().trim().replace(/\s+/g, ' ');

          // Save ID in cell 1, DNI + Name in cell 2
          const datosCompletosStr = `${cleanDni} - ${formattedName}`;
          const row = `${escapeCsv(cleanId)};${escapeCsv(datosCompletosStr)}\n`;
          fs.appendFileSync(CSV_PATH, row, 'utf-8');
          results.push({
            id: cleanId,
            dni: cleanDni,
            nombreCompleto: formattedName,
            fecha: timestamp,
            estado: 'SUCCESS'
          });
        } else {
          const errMsg = response.message || 'No se encontraron resultados';
          const datosCompletosStr = `${cleanDni} - ERROR: ${errMsg}`;
          const row = `${escapeCsv(cleanId)};${escapeCsv(datosCompletosStr)}\n`;
          fs.appendFileSync(CSV_PATH, row, 'utf-8');
          results.push({
            id: cleanId,
            dni: cleanDni,
            nombreCompleto: '',
            fecha: timestamp,
            estado: `ERROR: ${errMsg}`
          });
        }
      } catch (error: any) {
        const errMsg = error.message || 'Error de conexión';
        const datosCompletosStr = `${cleanDni} - ERROR: ${errMsg}`;
        const row = `${escapeCsv(cleanId)};${escapeCsv(datosCompletosStr)}\n`;
        fs.appendFileSync(CSV_PATH, row, 'utf-8');
        results.push({
          id: cleanId,
          dni: cleanDni,
          nombreCompleto: '',
          fecha: timestamp,
          estado: `ERROR: ${errMsg}`
        });
      }
    }

    return new Response(JSON.stringify({ success: true, data: results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async () => {
  try {
    if (fs.existsSync(CSV_PATH)) {
      fs.unlinkSync(CSV_PATH);
    }
    return new Response(JSON.stringify({ success: true, message: 'Historial de consultas CSV eliminado' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
