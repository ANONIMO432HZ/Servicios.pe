import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

const CSV_PATH = path.join(process.cwd(), 'data', 'consultas_dni.csv');

export const GET: APIRoute = async () => {
  try {
    if (!fs.existsSync(CSV_PATH)) {
      return new Response('ID,DNI,Nombre Completo,Fecha,Estado\n', {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="consultas_dni.csv"',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    const fileBuffer = fs.readFileSync(CSV_PATH);
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="consultas_dni.csv"',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error: any) {
    return new Response(`Error al descargar el archivo: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
