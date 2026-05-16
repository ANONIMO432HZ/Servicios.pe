import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ruc = searchParams.get('ruc');

  if (!ruc || ruc.length !== 11) {
    return NextResponse.json({ error: 'RUC inválido (debe tener 11 dígitos)' }, { status: 400 });
  }

  const token = process.env.JSON_PE_TOKEN;

  if (!token) {
    console.warn('JSON_PE_TOKEN no configurado. Usando Mock para RUC.');
    return NextResponse.json({
      success: true,
      message: 'Modo Demo',
      data: {
        ruc: ruc,
        nombre_o_razon_social: 'EMPRESA DE PRUEBA S.A.C.',
        estado: 'ACTIVO',
        condicion: 'HABIDO',
        direccion_completa: 'CALLE LAS EMPRESAS 123, LIMA - LIMA - SANTA ANITA'
      }
    });
  }

  try {
    const response = await fetch('https://api.json.pe/api/ruc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ruc })
    });

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('RUC Search Error:', error);
    return NextResponse.json({ error: 'Error al conectar con json.pe' }, { status: 500 });
  }
}
