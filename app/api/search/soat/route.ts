import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate');

  if (!plate) {
    return NextResponse.json({ success: false, message: 'Placa requerida' }, { status: 400 });
  }

  const token = process.env.JSON_PE_TOKEN;

  if (!token || token === 'tu_token_aqui') {
    return NextResponse.json({ 
      success: false, 
      message: 'API Token no configurado. Por favor configure JSON_PE_TOKEN en el servidor.' 
    }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.json.pe/api/soat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ placa: plate.toUpperCase() })
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message || 'SOAT no encontrado'
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching SOAT:', error);
    return NextResponse.json({ success: false, message: 'Error de servidor' }, { status: 500 });
  }
}
