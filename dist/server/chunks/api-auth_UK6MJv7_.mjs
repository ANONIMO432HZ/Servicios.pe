async function fetchGovData(type, identifier, provider) {
  const resolvedProvider = provider || "eldni";
  const elDniOnlyTypes = ["ruc10-names", "ruc10-by-dni", "dni-verification-digit", "how-many-same-name"];
  if (resolvedProvider === "json_pe" && elDniOnlyTypes.includes(type)) {
    return fetchElDni(type, identifier);
  }
  if (resolvedProvider === "json_pe") {
    return fetchJsonPe(type, identifier);
  } else if (resolvedProvider === "eldni") {
    return fetchElDni(type, identifier);
  }
  return { success: false, data: null, message: "Proveedor no soportado", provider: resolvedProvider };
}
async function fetchJsonPe(type, id) {
  const token = "d8f3c67c45c23ea9d3628c36b59e9229d4d7c6657d06e85fa22e1a433023";
  const endpoints = {
    dni: "dni",
    ruc: "ruc",
    plate: "placa",
    license: "licencia",
    soat: "soat",
    "ruc-debt": "deuda-coactiva"
  };
  const endpoint = endpoints[type] || "dni";
  try {
    const response = await fetch(`https://api.json.pe/api/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ [type === "plate" || type === "soat" ? "placa" : "dni"]: id })
    });
    const result = await response.json();
    return {
      success: result.success,
      data: result.data,
      message: result.message,
      provider: "json_pe"
    };
  } catch {
    return { success: false, data: null, message: "Error en json.pe", provider: "json_pe" };
  }
}
async function fetchElDni(type, id) {
  const isDni = type === "dni";
  const isRuc = type === "ruc";
  const isRuc10Names = type === "ruc10-names";
  const isRuc10ByDni = type === "ruc10-by-dni";
  const isDniVerification = type === "dni-verification-digit";
  const isSameName = type === "how-many-same-name";
  let url = "https://eldni.com/pe/buscar-datos-por-dni";
  if (isRuc) url = "https://eldni.com/pe/buscar-datos-por-ruc";
  else if (isRuc10Names) url = "https://eldni.com/pe/buscar-nombres-y-apellidos-por-ruc-10";
  else if (isRuc10ByDni) url = "https://eldni.com/pe/obtener-ruc-10-por-dni";
  else if (isDniVerification) url = "https://eldni.com/pe/obtener-digito-de-verificacion-del-dni";
  else if (isSameName) url = "https://eldni.com/pe/cuantos-se-llaman-como-yo";
  const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
  try {
    const initialRes = await fetch(url, { headers: { "User-Agent": userAgent } });
    const html = await initialRes.text();
    const cookies = initialRes.headers.getSetCookie?.().map((c) => c.split(";")[0]).join("; ") || "";
    const tokenMatch = html.match(/name="_token" value="([^"]+)"/);
    if (!tokenMatch) throw new Error(`No se pudo obtener el token de sesión de eldni para ${type}`);
    const token = tokenMatch[1];
    const formData = new URLSearchParams();
    formData.append("_token", token);
    if (isDni || isRuc10ByDni || isDniVerification) {
      formData.append("dni", id);
    } else if (isRuc || isRuc10Names) {
      formData.append("ruc", id);
    } else if (isSameName) {
      formData.append("nombres", id.trim());
    }
    const postRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": cookies,
        "User-Agent": userAgent,
        "Referer": url
      },
      body: formData.toString()
    });
    const resultHtml = await postRes.text();
    if (isDni || isRuc10Names) {
      const nombres = resultHtml.match(/id="nombres" value="([^"]+)"/)?.[1] || resultHtml.match(/id="nombre" value="([^"]+)"/)?.[1];
      const apPaterno = resultHtml.match(/id="apellidop" value="([^"]+)"/)?.[1] || resultHtml.match(/id="apellidopaterno" value="([^"]+)"/)?.[1];
      const apMaterno = resultHtml.match(/id="apellidom" value="([^"]+)"/)?.[1] || resultHtml.match(/id="apellidomaterno" value="([^"]+)"/)?.[1];
      if (!nombres) {
        return { success: false, data: null, message: "No se encontraron resultados en eldni", provider: "eldni" };
      }
      return {
        success: true,
        data: {
          numero: id,
          nombre_completo: `${apPaterno || ""} ${apMaterno || ""}, ${nombres}`.trim().replace(/\s+/g, " "),
          nombres,
          apellido_paterno: apPaterno || "",
          apellido_materno: apMaterno || "",
          proveedor: "eldni.com (Public)"
        },
        provider: "eldni"
      };
    } else if (isRuc) {
      const razonSocial = resultHtml.match(/id="razon_social" value="([^"]+)"/)?.[1] || resultHtml.match(/id="razonsocial" value="([^"]+)"/)?.[1] || resultHtml.match(/id="nombre" value="([^"]+)"/)?.[1];
      const estado = resultHtml.match(/id="estado" value="([^"]+)"/)?.[1] || "ACTIVO";
      const condicion = resultHtml.match(/id="condicion" value="([^"]+)"/)?.[1] || "HABIDO";
      const direccion = resultHtml.match(/id="direccion" value="([^"]+)"/)?.[1] || "ZONA INDUSTRIAL MOCK 456";
      if (!razonSocial) {
        return { success: false, data: null, message: "No se encontraron resultados en eldni para este RUC", provider: "eldni" };
      }
      return {
        success: true,
        data: {
          ruc: id,
          nombre_o_razon_social: razonSocial,
          estado,
          condicion,
          direccion_completa: direccion,
          proveedor: "eldni.com (Public)"
        },
        provider: "eldni"
      };
    } else if (isRuc10ByDni) {
      const ruc = resultHtml.match(/id="ruc" value="([^"]+)"/)?.[1] || resultHtml.match(/id="ruc10" value="([^"]+)"/)?.[1] || resultHtml.match(/value="(10\d{9})"/)?.[1];
      if (!ruc) {
        return { success: false, data: null, message: "No se pudo obtener el RUC para este DNI en eldni", provider: "eldni" };
      }
      return {
        success: true,
        data: {
          dni: id,
          ruc,
          proveedor: "eldni.com (Public)"
        },
        provider: "eldni"
      };
    } else if (isDniVerification) {
      const digito = resultHtml.match(/id="digito" value="([^"]+)"/)?.[1] || resultHtml.match(/id="digito_verificador" value="([^"]+)"/)?.[1] || resultHtml.match(/value="(\d)"/)?.[1];
      if (!digito) {
        return { success: false, data: null, message: "No se pudo obtener el dígito de verificación en eldni", provider: "eldni" };
      }
      return {
        success: true,
        data: {
          dni: id,
          digito_verificador: digito,
          proveedor: "eldni.com (Public)"
        },
        provider: "eldni"
      };
    } else if (isSameName) {
      const htmlLower = resultHtml.toLowerCase();
      if (htmlLower.includes("no se debe colocar apellidos") || htmlLower.includes("no se encontraron personas") || htmlLower.includes("no hay resultado")) {
        return {
          success: false,
          data: null,
          message: "No se encontraron personas con el nombre que indicaste. Recuerda que no se debe colocar apellidos para esta consulta.",
          provider: "eldni"
        };
      }
      const cantidad = resultHtml.match(/<mark>(\d+)<\/mark>\s*personas/i)?.[1] || resultHtml.match(/Se encontrat?on\s*<mark>(\d+)<\/mark>/i)?.[1] || resultHtml.match(/id="cantidad" value="([^"]+)"/)?.[1] || resultHtml.match(/id="total" value="([^"]+)"/)?.[1] || resultHtml.match(/(\d+[,.]?\d*)\s*personas/i)?.[1];
      if (!cantidad) {
        return {
          success: false,
          data: null,
          message: "No se encontraron personas con el nombre que indicaste. Recuerda que no se debe colocar apellidos para esta consulta.",
          provider: "eldni"
        };
      }
      return {
        success: true,
        data: {
          nombre: id,
          cantidad: `${cantidad} personas`,
          proveedor: "eldni.com (Public)"
        },
        provider: "eldni"
      };
    }
  } catch {
    return { success: false, data: null, message: "Error al conectar con eldni.com", provider: "eldni" };
  }
  return { success: false, data: null, message: "Operación no soportada", provider: "eldni" };
}

function validateAndDeductSearch(cookies, type, requestedProvider) {
  const authCookie = cookies.get("auth_token")?.value;
  const isGuest = authCookie === "guest-session-token";
  const isLoggedIn = authCookie === "valid-session-token";
  let provider = "eldni";
  if (requestedProvider === "json_pe") {
    provider = "json_pe";
  } else if (requestedProvider === "mock") {
    provider = "mock";
  } else if (requestedProvider === "eldni") {
    provider = "eldni";
  } else {
    provider = "eldni";
  }
  if (isGuest) {
    if (provider === "json_pe") {
      return {
        allowed: false,
        statusCode: 403,
        message: "Acceso Denegado: Las consultas premium a json.pe requieren iniciar sesión y créditos.",
        provider
      };
    }
    const freeTypes = ["dni", "ruc", "ruc10-names", "ruc10-by-dni", "dni-verification-digit", "how-many-same-name"];
    if (!freeTypes.includes(type)) {
      return {
        allowed: false,
        statusCode: 400,
        message: "Límite de Invitado: Esta consulta requiere iniciar sesión y créditos premium.",
        provider
      };
    }
    const now = Date.now();
    const rateLimitCookie = cookies.get("guest_rate_limit")?.value;
    let limitData = { lastQuery: 0, count: 0, resetTime: now + 36e5 };
    if (rateLimitCookie) {
      try {
        limitData = JSON.parse(rateLimitCookie);
      } catch (e) {
      }
    }
    const secondsPassed = (now - limitData.lastQuery) / 1e3;
    if (secondsPassed < 10) {
      const waitTime = Math.ceil(10 - secondsPassed);
      return {
        allowed: false,
        statusCode: 429,
        message: `Rate Limit: Por favor, esperá ${waitTime} segundos antes de realizar otra consulta.`,
        provider
      };
    }
    if (now > limitData.resetTime) {
      limitData.count = 0;
      limitData.resetTime = now + 36e5;
    }
    if (limitData.count >= 5) {
      const minutesLeft = Math.ceil((limitData.resetTime - now) / 6e4);
      return {
        allowed: false,
        statusCode: 429,
        message: `Límite Excedido: Has alcanzado el límite de 5 consultas por hora para invitados. Intentá de nuevo en ${minutesLeft} minutos o iniciá sesión para consultas ilimitadas.`,
        provider
      };
    }
    limitData.lastQuery = now;
    limitData.count += 1;
    cookies.set("guest_rate_limit", JSON.stringify(limitData), {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24
    });
    return { allowed: true, provider };
  }
  if (isLoggedIn) {
    let credits = 50;
    const creditsCookie = cookies.get("user_credits")?.value;
    if (creditsCookie !== void 0) {
      credits = parseInt(creditsCookie, 10);
    } else {
      cookies.set("user_credits", "50", {
        path: "/",
        httpOnly: false,
        // Permitir leer en cliente
        secure: true,
        maxAge: 60 * 60 * 24 * 30
      });
    }
    const costs = {
      dni: 1,
      license: 1,
      ruc: 1,
      "ruc-debt": 1,
      plate: 2,
      soat: 1,
      "ruc10-names": 1,
      "ruc10-by-dni": 1,
      "dni-verification-digit": 1,
      "how-many-same-name": 1
    };
    const cost = costs[type] || 1;
    if (credits < cost) {
      return {
        allowed: false,
        statusCode: 402,
        message: `Créditos Insuficientes: Esta consulta requiere ${cost} créditos. Tu saldo actual es de ${credits} créditos. ¡Recargá saldo desde tu consola!`,
        provider
      };
    }
    const newCredits = credits - cost;
    cookies.set("user_credits", newCredits.toString(), {
      path: "/",
      httpOnly: false,
      secure: true,
      maxAge: 60 * 60 * 24 * 30
    });
    return { allowed: true, provider, newCredits };
  }
  return {
    allowed: false,
    statusCode: 401,
    message: "Sesión Requerida: Por favor, iniciá sesión o accedé como invitado para usar esta API.",
    provider: "mock"
  };
}

export { fetchGovData as f, validateAndDeductSearch as v };
