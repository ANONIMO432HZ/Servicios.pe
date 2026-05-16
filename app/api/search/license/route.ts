import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dni = searchParams.get('dni');

  if (!dni) {
    return NextResponse.json({ success: false, message: 'DNI requerido' }, { status: 400 });
  }

  const token = process.env.JSON_PE_TOKEN;

  if (!token || token === 'tu_token_aqui') {
    return NextResponse.json({ 
      success: false, 
      message: 'API Token no configurado.' 
    }, { status: 500 });
  }

  try {
    const response = await fetch('https://api.json.pe/api/licencia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ dni: dni })
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
        message: result.message || 'Licencia no encontrada'
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching License:', error);
    return NextResponse.json({ success: false, message: 'Error de servidor' }, { status: 500 });
  }
}
