import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dni = searchParams.get('dni');

  if (!dni || dni.length !== 8) {
    return NextResponse.json({ error: 'DNI inválido' }, { status: 400 });
  }

  const url = 'https://eldni.com/pe/buscar-datos-por-dni';
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  try {
    // 1. Obtener Token y Cookies de sesión
    const initialRes = await fetch(url, {
      headers: { 'User-Agent': userAgent }
    });
    const html = await initialRes.text();
    const cookies = initialRes.headers.getSetCookie().map(c => c.split(';')[0]).join('; ');
    
    const tokenMatch = html.match(/name="_token" value="([^"]+)"/);
    if (!tokenMatch) throw new Error("No se pudo obtener el token de seguridad");
    const token = tokenMatch[1];

    // 2. Ejecutar la consulta real vía POST
    const formData = new URLSearchParams();
    formData.append('_token', token);
    formData.append('dni', dni);

    const postRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookies,
        'User-Agent': userAgent,
        'Referer': url
      },
      body: formData.toString()
    });

    const resultHtml = await postRes.text();

    // 3. Extraer datos con Regex (evitando dependencias pesadas como cheerio)
    const nombresMatch = resultHtml.match(/id="nombres" value="([^"]+)"/);
    const apPaternoMatch = resultHtml.match(/id="apellidop" value="([^"]+)"/);
    const apMaternoMatch = resultHtml.match(/id="apellidom" value="([^"]+)"/);

    if (nombresMatch) {
      return NextResponse.json({
        success: true,
        data: {
          dni,
          nombres: nombresMatch[1],
          apellidoPaterno: apPaternoMatch ? apPaternoMatch[1] : '',
          apellidoMaterno: apMaternoMatch ? apMaternoMatch[1] : '',
          nombreCompleto: `${nombresMatch[1]} ${apPaternoMatch ? apPaternoMatch[1] : ''} ${apMaternoMatch ? apMaternoMatch[1] : ''}`.trim()
        }
      });
    }

    if (resultHtml.includes('No se encontraron resultados')) {
      return NextResponse.json({ success: false, message: 'DNI no encontrado' }, { status: 404 });
    }

    throw new Error("Estructura de respuesta inesperada");

  } catch (error) {
    console.error('DNI Search Error:', error);
    return NextResponse.json({ 
      error: 'Error al consultar el servicio', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
