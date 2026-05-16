# Documentación Oficial de Integración - json.pe

> **Índice de Documentación**: [https://docs.json.pe/llms.txt](https://docs.json.pe/llms.txt)

---

## 1. Consulta DNI

**Endpoint**: `POST /dni`
**Servidor**: `https://api.json.pe/api`

```yaml
openapi: 3.0.1
paths:
  /dni:
    post:
      description: Consulta DNI por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                dni:
                  type: string
                  example: "00000000"
      responses:
        '200':
          description: Datos del ciudadano
```

---

## 2. Consulta RUC

**Endpoint**: `POST /ruc`
**Servidor**: `https://api.json.pe/api`

```yaml
openapi: 3.0.1
paths:
  /ruc:
    post:
      description: Consulta RUC por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [ruc]
              properties:
                ruc:
                  type: string
                  example: "20552103816"
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  data:
                    type: object
                    properties:
                      ruc: { type: string }
                      nombre_o_razon_social: { type: string }
                      estado: { type: string }
                      condicion: { type: string }
                      direccion_completa: { type: string }
```

---

## 3. Consulta Placa de Vehículo

**Endpoint**: `POST /placa`
**Servidor**: `https://api.json.pe/api`

```yaml
openapi: 3.0.1
paths:
  /placa:
    post:
      description: Consulta placa por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [placa]
              properties:
                placa:
                  type: string
                  example: "F3H792"
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  data:
                    type: object
                    properties:
                      placa: { type: string }
                      marca: { type: string }
                      modelo: { type: string }
                      serie: { type: string }
                      color: { type: string }
                      motor: { type: string }
                      vin: { type: string }
```

---

## 4. Configuración de Seguridad

Todas las peticiones requieren autenticación vía Bearer Token en el Header:

```http
Authorization: Bearer TU_TOKEN_AQUI
Content-Type: application/json
```
