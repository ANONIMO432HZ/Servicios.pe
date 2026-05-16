
async function getDniData(dni) {
  const url = 'https://eldni.com/pe/buscar-datos-por-dni';
  try {
    // 1. Get the token and cookie
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await response.text();
    const cookies = response.headers.getSetCookie().map(c => c.split(';')[0]).join('; ');
    console.log("Cookies combined:", cookies);


    
    const tokenMatch = html.match(/name="_token" value="([^"]+)"/);
    if (!tokenMatch) throw new Error("No token found");
    const token = tokenMatch[1];
    
    console.log("Token found:", token);


    // 2. Perform the POST request
    const formData = new URLSearchParams();
    formData.append('_token', token);
    formData.append('dni', dni);

    const postResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookies,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': url
      },
      body: formData.toString()
    });


    const resultHtml = await postResponse.text();
    console.log("Result HTML length:", resultHtml.length);
    console.log("Result HTML snippet:", resultHtml.substring(0, 1000));

    
    // 3. Extract data (names) - Looking for the result inputs
    const nombresMatch = resultHtml.match(/id="nombres" value="([^"]+)"/);
    const apPaternoMatch = resultHtml.match(/id="apellidop" value="([^"]+)"/);
    const apMaternoMatch = resultHtml.match(/id="apellidom" value="([^"]+)"/);
    
    if (nombresMatch) {
      console.log("SUCCESS!");
      console.log("Nombres:", nombresMatch[1]);
      console.log("Apellido P:", apPaternoMatch ? apPaternoMatch[1] : "N/A");
      console.log("Apellido M:", apMaternoMatch ? apMaternoMatch[1] : "N/A");
    } else {
      console.log("Data not found in response. Check if DNI is valid or if blocked.");
      // Check if there's an error message in HTML
      if (resultHtml.includes('No se encontraron resultados')) {
        console.log("Reason: No results found.");
      }
    }
  } catch (e) {
    console.error("Error:", e);
  }
}

getDniData('72403666'); // Usando un DNI de prueba
