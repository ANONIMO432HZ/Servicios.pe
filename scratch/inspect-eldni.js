
async function test() {
  const url = 'https://eldni.com/pe/buscar-datos-por-dni';
  try {
    const response = await fetch(url);
    const html = await response.text();
    console.log("HTML length:", html.length);
    if (html.includes('<form')) {
      console.log("Form found!");
      const formMatch = html.match(/<form[^>]*>([\s\S]*?)<\/form>/i);
      if (formMatch) {
        console.log("Form Content:", formMatch[0]);
      }
    } else {
      console.log("No form found. Might be blocked or different structure.");
    }
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
