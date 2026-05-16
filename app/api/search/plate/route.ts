import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate');

  if (!plate) {
    return NextResponse.json({ error: 'Placa requerida' }, { status: 400 });
  }

  const token = process.env.JSON_PE_TOKEN;

  if (!token) {
    // Si no hay token, devolvemos un mock pero con la estructura real de json.pe para que el frontend esté listo
    console.warn('JSON_PE_TOKEN no configurado. Usando Mock.');
    return NextResponse.json({
      success: true,
      message: 'Modo Demo (Sin Token)',
      data: {
        placa: plate.toUpperCase(),
        marca: 'TOYOTA',
        modelo: 'HILUX',
        serie: '8HGF92837492834',
        color: 'PLATA METÁLICO',
        motor: '1KD-FTV',
        vin: '8HGF92837492834'
      }
    });
  }

  try {
    const response = await fetch('https://api.json.pe/api/placa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ placa: plate })
    });

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Plate Search Error:', error);
    return NextResponse.json({ error: 'Error al conectar con json.pe' }, { status: 500 });
  }
}
