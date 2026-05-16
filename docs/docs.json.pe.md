> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# APIs | json.pe

> API de consultas peruana más completa y estable del mercado. DNI, RUC, SOAT, placas y más con uptime 99.9%, integración en minutos.

## 🎯 ¿Por qué elegir json.pe?

<Columns cols={2}>
  <Card title="📊 Datos Completos" icon="database">
    Acceso a información exacta: Excelente para validar datos
  </Card>

  <Card title="⚡ Respuesta Rápida" icon="bolt">
    Tiempo de respuesta promedio menor a 200ms para consultas instantáneas.
  </Card>

  <Card title="🔒 Seguro y Confiable" icon="shield-check">
    Autenticación Bearer Token y conexiones HTTPS encriptadas.
  </Card>

  <Card title="📈 99.9% Uptime" icon="chart-line">
    Infraestructura robusta con disponibilidad garantizada las 24/7.
  </Card>
</Columns>

## 🚀 Integración con Sistemas

<Card title="Facturador PRO" icon="laptop-code" href="/api-consulta/facturador-pro">
  Integración con Facturador PRO , Smart, QPOs y más sistemas compatibles
</Card>

## 📊 Estadísticas del Mercado

<Columns cols={3}>
  <Card title="+50,000" icon="users">
    Desarrolladores activos
  </Card>

  <Card title="+1M" icon="database">
    Consultas diarias
  </Card>

  <Card title="99.9%" icon="chart-line">
    Tiempo de actividad
  </Card>
</Columns>

## 🎯 Casos de Uso Principales

* **Sistemas de Facturación:** Validación automática de clientes
* **E-commerce:** Verificación de datos de envío
* **Fintech:** KYC y verificación de identidad
* **Logística:** Validación de datos de entrega
* **Clinicas:** Sistemas de registro y verificación

## 💡 ¿Listo para comenzar?

<Card title="Obtener Token Gratis" icon="key" href="https://app.json.pe/login">
  Regístrate y obtén tu token de acceso en segundos
</Card>

> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# DNI

> Consulta DNI por número.

## OpenAPI

````yaml POST /dni
openapi: 3.0.1
info:
  title: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  description: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  version: 1.0.0
servers:
  - url: https://api.json.pe/api
security:
  - bearerAuth: []
paths:
  /dni:
    post:
      tags:
        - dni
      description: Consulta DNI por número.
      operationId: consultaDni
      requestBody:
        required: true
        description: DNI de 8 dígitos del titular a consultar
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/dni-request'
      responses:
        '200':
          description: Consulta exitosa. Retorna datos completos de la persona.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/dni'
        '404':
          description: >-
            Recurso no encontrado. Puede deberse a DNI inexistente, credenciales
            inválidas o falta de autenticación.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error'
              example:
                success: false
                message: No se encontró DNI
components:
  schemas:
    dni-request:
      type: object
      required:
        - dni
      description: >-
        Request body para consulta de DNI. El DNI debe ser un string de 8
        dígitos numéricos.
      properties:
        dni:
          type: string
          description: >-
            Número de Documento Nacional de Identidad (DNI) de 8 dígitos. Debe
            ser numérico y tener exactamente 8 caracteres.
          example: '27427864'
          pattern: ^[0-9]{8}$
          minLength: 8
          maxLength: 8
      example:
        dni: '27427864'
    dni:
      type: object
      description: Respuesta de consulta DNI con datos personales validados
      required:
        - success
        - message
        - data
      properties:
        success:
          type: boolean
          description: Indica si la consulta fue exitosa (true) o falló (false)
          example: true
        message:
          type: string
          description: Mensaje descriptivo del resultado de la consulta
          example: exito
        data:
          type: object
          description: Datos personales del titular del DNI obtenidos
          required:
            - numero
            - codigo_verificacion
            - nombres
            - apellido_paterno
            - apellido_materno
            - nombre_completo
          properties:
            numero:
              type: string
              description: Número de DNI consultado
              example: '27427864'
            codigo_verificacion:
              type: string
              description: Código de verificación del DNI (dígito verificador)
              example: '7'
            nombres:
              type: string
              description: Nombres de pila de la persona
              example: JOSE PEDRO
            apellido_paterno:
              type: string
              description: Primer apellido (apellido paterno) de la persona
              example: CASTILLO
            apellido_materno:
              type: string
              description: Segundo apellido (apellido materno) de la persona
              example: TERRONES
            nombre_completo:
              type: string
              description: 'Nombre completo formateado: APELLIDOS, NOMBRES'
              example: CASTILLO TERRONES, JOSE PEDRO
            direccion:
              type: string
              description: Dirección de la persona
            direccion_completa:
              type: string
              description: Dirección completa de la persona
            ubigeo_reniec:
              type: string
              description: Ubigeo según RENIEC
            ubigeo_sunat:
              type: string
              description: Ubigeo según SUNAT
      example:
        success: true
        message: exito
        data:
          numero: '27427864'
          nombre_completo: CASTILLO TERRONES, JOSE PEDRO
          nombres: JOSE PEDRO
          apellido_paterno: CASTILLO
          apellido_materno: TERRONES
          codigo_verificacion: 7
          direccion: ''
          direccion_completa: ''
          ubigeo_reniec: ''
          ubigeo_sunat: ''
          ubigeo:
            - null
            - null
            - null
    error:
      required:
        - message
        - success
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
      example:
        success: false
        message: Bad Request
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

````

> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# RUC

> Consulta RUC por número.

## OpenAPI

````yaml POST /ruc
openapi: 3.0.1
info:
  title: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  description: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  version: 1.0.0
servers:
  - url: https://api.json.pe/api
security:
  - bearerAuth: []
paths:
  /ruc:
    post:
      tags:
        - ruc
      description: Consulta RUC por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ruc-request'
      responses:
        '200':
          description: ruc response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ruc'
        '404':
          description: Recurso no encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error'
              example:
                success: false
                message: No se encontró RUC
components:
  schemas:
    ruc-request:
      type: object
      required:
        - ruc
      properties:
        ruc:
          type: string
          description: El RUC a consultar
          example: '20552103816'
      example:
        ruc: '20552103816'
    ruc:
      type: object
      properties:
        success:
          type: boolean
          description: El estado de la respuesta  true o false
        message:
          type: string
          description: Mensaje de la respuesta
        data:
          type: object
          description: Datos detallados de la respuesta
          properties:
            ruc:
              type: string
              description: Número de identificación (RUC)
            nombre_o_razon_social:
              type: string
              description: Nombre o Razon Social de la empresa
            estado:
              type: string
              description: Estado de la empresa
            condicion:
              type: string
              description: Condición de la empresa
            departamento:
              type: string
              description: Departamento de la empresa
            provincia:
              type: string
              description: Provincia de la empresa
            distrito:
              type: string
              description: Distrito de la empresa
            direccion:
              type: string
              description: Dirección específica
            direccion_completa:
              type: string
              description: >-
                Dirección completa, incluyendo distrito, provincia y
                departamento
            ubigeo_sunat:
              type: string
              description: Ubigeo según SUNAT
            ubigeo:
              type: array
              description: Ubigeo desglosado por componentes
              items:
                type: string
            es_agente_de_retencion:
              type: string
              description: Indica si es agente de retención
            es_agente_de_percepcion:
              type: string
              description: Indica si es agente de percepción
            es_agente_de_percepcion_combustible:
              type: string
              description: Indica si es agente de percepción de combustibles
            es_buen_contribuyente:
              type: string
              description: Indica si está catalogado como buen contribuyente
      example:
        success: true
        message: exito
        data:
          ruc: '20552103816'
          nombre_o_razon_social: AGROLIGHT PERU S.A.C.
          estado: SUSPENSION TEMPORAL
          condicion: HABIDO
          departamento: LIMA
          provincia: LIMA
          distrito: SANTA ANITA
          direccion: PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET.
          direccion_completa: >-
            PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET., LIMA -
            LIMA - SANTA ANITA
          ubigeo_sunat: '150137'
          ubigeo:
            - '15'
            - '1501'
            - '150137'
          es_agente_de_retencion: 'NO'
          es_agente_de_percepcion: 'NO'
          es_agente_de_percepcion_combustible: 'NO'
          es_buen_contribuyente: SI
    error:
      required:
        - message
        - success
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
      example:
        success: false
        message: Bad Request
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

````

> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# RUC

> Consulta RUC por número.

## OpenAPI

````yaml POST /ruc
openapi: 3.0.1
info:
  title: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  description: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  version: 1.0.0
servers:
  - url: https://api.json.pe/api
security:
  - bearerAuth: []
paths:
  /ruc:
    post:
      tags:
        - ruc
      description: Consulta RUC por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ruc-request'
      responses:
        '200':
          description: ruc response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ruc'
        '404':
          description: Recurso no encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error'
              example:
                success: false
                message: No se encontró RUC
components:
  schemas:
    ruc-request:
      type: object
      required:
        - ruc
      properties:
        ruc:
          type: string
          description: El RUC a consultar
          example: '20552103816'
      example:
        ruc: '20552103816'
    ruc:
      type: object
      properties:
        success:
          type: boolean
          description: El estado de la respuesta  true o false
        message:
          type: string
          description: Mensaje de la respuesta
        data:
          type: object
          description: Datos detallados de la respuesta
          properties:
            ruc:
              type: string
              description: Número de identificación (RUC)
            nombre_o_razon_social:
              type: string
              description: Nombre o Razon Social de la empresa
            estado:
              type: string
              description: Estado de la empresa
            condicion:
              type: string
              description: Condición de la empresa
            departamento:
              type: string
              description: Departamento de la empresa
            provincia:
              type: string
              description: Provincia de la empresa
            distrito:
              type: string
              description: Distrito de la empresa
            direccion:
              type: string
              description: Dirección específica
            direccion_completa:
              type: string
              description: >-
                Dirección completa, incluyendo distrito, provincia y
                departamento
            ubigeo_sunat:
              type: string
              description: Ubigeo según SUNAT
            ubigeo:
              type: array
              description: Ubigeo desglosado por componentes
              items:
                type: string
            es_agente_de_retencion:
              type: string
              description: Indica si es agente de retención
            es_agente_de_percepcion:
              type: string
              description: Indica si es agente de percepción
            es_agente_de_percepcion_combustible:
              type: string
              description: Indica si es agente de percepción de combustibles
            es_buen_contribuyente:
              type: string
              description: Indica si está catalogado como buen contribuyente
      example:
        success: true
        message: exito
        data:
          ruc: '20552103816'
          nombre_o_razon_social: AGROLIGHT PERU S.A.C.
          estado: SUSPENSION TEMPORAL
          condicion: HABIDO
          departamento: LIMA
          provincia: LIMA
          distrito: SANTA ANITA
          direccion: PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET.
          direccion_completa: >-
            PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET., LIMA -
            LIMA - SANTA ANITA
          ubigeo_sunat: '150137'
          ubigeo:
            - '15'
            - '1501'
            - '150137'
          es_agente_de_retencion: 'NO'
          es_agente_de_percepcion: 'NO'
          es_agente_de_percepcion_combustible: 'NO'
          es_buen_contribuyente: SI
    error:
      required:
        - message
        - success
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
      example:
        success: false
        message: Bad Request
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

````

> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# RUC

> Consulta RUC por número.

## OpenAPI

````yaml POST /ruc
openapi: 3.0.1
info:
  title: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  description: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  version: 1.0.0
servers:
  - url: https://api.json.pe/api
security:
  - bearerAuth: []
paths:
  /ruc:
    post:
      tags:
        - ruc
      description: Consulta RUC por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ruc-request'
      responses:
        '200':
          description: ruc response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ruc'
        '404':
          description: Recurso no encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error'
              example:
                success: false
                message: No se encontró RUC
components:
  schemas:
    ruc-request:
      type: object
      required:
        - ruc
      properties:
        ruc:
          type: string
          description: El RUC a consultar
          example: '20552103816'
      example:
        ruc: '20552103816'
    ruc:
      type: object
      properties:
        success:
          type: boolean
          description: El estado de la respuesta  true o false
        message:
          type: string
          description: Mensaje de la respuesta
        data:
          type: object
          description: Datos detallados de la respuesta
          properties:
            ruc:
              type: string
              description: Número de identificación (RUC)
            nombre_o_razon_social:
              type: string
              description: Nombre o Razon Social de la empresa
            estado:
              type: string
              description: Estado de la empresa
            condicion:
              type: string
              description: Condición de la empresa
            departamento:
              type: string
              description: Departamento de la empresa
            provincia:
              type: string
              description: Provincia de la empresa
            distrito:
              type: string
              description: Distrito de la empresa
            direccion:
              type: string
              description: Dirección específica
            direccion_completa:
              type: string
              description: >-
                Dirección completa, incluyendo distrito, provincia y
                departamento
            ubigeo_sunat:
              type: string
              description: Ubigeo según SUNAT
            ubigeo:
              type: array
              description: Ubigeo desglosado por componentes
              items:
                type: string
            es_agente_de_retencion:
              type: string
              description: Indica si es agente de retención
            es_agente_de_percepcion:
              type: string
              description: Indica si es agente de percepción
            es_agente_de_percepcion_combustible:
              type: string
              description: Indica si es agente de percepción de combustibles
            es_buen_contribuyente:
              type: string
              description: Indica si está catalogado como buen contribuyente
      example:
        success: true
        message: exito
        data:
          ruc: '20552103816'
          nombre_o_razon_social: AGROLIGHT PERU S.A.C.
          estado: SUSPENSION TEMPORAL
          condicion: HABIDO
          departamento: LIMA
          provincia: LIMA
          distrito: SANTA ANITA
          direccion: PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET.
          direccion_completa: >-
            PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET., LIMA -
            LIMA - SANTA ANITA
          ubigeo_sunat: '150137'
          ubigeo:
            - '15'
            - '1501'
            - '150137'
          es_agente_de_retencion: 'NO'
          es_agente_de_percepcion: 'NO'
          es_agente_de_percepcion_combustible: 'NO'
          es_buen_contribuyente: SI
    error:
      required:
        - message
        - success
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
      example:
        success: false
        message: Bad Request
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

````

> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# RUC

> Consulta RUC por número.

## OpenAPI

````yaml POST /ruc
openapi: 3.0.1
info:
  title: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  description: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  version: 1.0.0
servers:
  - url: https://api.json.pe/api
security:
  - bearerAuth: []
paths:
  /ruc:
    post:
      tags:
        - ruc
      description: Consulta RUC por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ruc-request'
      responses:
        '200':
          description: ruc response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ruc'
        '404':
          description: Recurso no encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error'
              example:
                success: false
                message: No se encontró RUC
components:
  schemas:
    ruc-request:
      type: object
      required:
        - ruc
      properties:
        ruc:
          type: string
          description: El RUC a consultar
          example: '20552103816'
      example:
        ruc: '20552103816'
    ruc:
      type: object
      properties:
        success:
          type: boolean
          description: El estado de la respuesta  true o false
        message:
          type: string
          description: Mensaje de la respuesta
        data:
          type: object
          description: Datos detallados de la respuesta
          properties:
            ruc:
              type: string
              description: Número de identificación (RUC)
            nombre_o_razon_social:
              type: string
              description: Nombre o Razon Social de la empresa
            estado:
              type: string
              description: Estado de la empresa
            condicion:
              type: string
              description: Condición de la empresa
            departamento:
              type: string
              description: Departamento de la empresa
            provincia:
              type: string
              description: Provincia de la empresa
            distrito:
              type: string
              description: Distrito de la empresa
            direccion:
              type: string
              description: Dirección específica
            direccion_completa:
              type: string
              description: >-
                Dirección completa, incluyendo distrito, provincia y
                departamento
            ubigeo_sunat:
              type: string
              description: Ubigeo según SUNAT
            ubigeo:
              type: array
              description: Ubigeo desglosado por componentes
              items:
                type: string
            es_agente_de_retencion:
              type: string
              description: Indica si es agente de retención
            es_agente_de_percepcion:
              type: string
              description: Indica si es agente de percepción
            es_agente_de_percepcion_combustible:
              type: string
              description: Indica si es agente de percepción de combustibles
            es_buen_contribuyente:
              type: string
              description: Indica si está catalogado como buen contribuyente
      example:
        success: true
        message: exito
        data:
          ruc: '20552103816'
          nombre_o_razon_social: AGROLIGHT PERU S.A.C.
          estado: SUSPENSION TEMPORAL
          condicion: HABIDO
          departamento: LIMA
          provincia: LIMA
          distrito: SANTA ANITA
          direccion: PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET.
          direccion_completa: >-
            PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET., LIMA -
            LIMA - SANTA ANITA
          ubigeo_sunat: '150137'
          ubigeo:
            - '15'
            - '1501'
            - '150137'
          es_agente_de_retencion: 'NO'
          es_agente_de_percepcion: 'NO'
          es_agente_de_percepcion_combustible: 'NO'
          es_buen_contribuyente: SI
    error:
      required:
        - message
        - success
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
      example:
        success: false
        message: Bad Request
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

````

> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# RUC

> Consulta RUC por número.

## OpenAPI

````yaml POST /ruc
openapi: 3.0.1
info:
  title: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  description: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  version: 1.0.0
servers:
  - url: https://api.json.pe/api
security:
  - bearerAuth: []
paths:
  /ruc:
    post:
      tags:
        - ruc
      description: Consulta RUC por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ruc-request'
      responses:
        '200':
          description: ruc response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ruc'
        '404':
          description: Recurso no encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error'
              example:
                success: false
                message: No se encontró RUC
components:
  schemas:
    ruc-request:
      type: object
      required:
        - ruc
      properties:
        ruc:
          type: string
          description: El RUC a consultar
          example: '20552103816'
      example:
        ruc: '20552103816'
    ruc:
      type: object
      properties:
        success:
          type: boolean
          description: El estado de la respuesta  true o false
        message:
          type: string
          description: Mensaje de la respuesta
        data:
          type: object
          description: Datos detallados de la respuesta
          properties:
            ruc:
              type: string
              description: Número de identificación (RUC)
            nombre_o_razon_social:
              type: string
              description: Nombre o Razon Social de la empresa
            estado:
              type: string
              description: Estado de la empresa
            condicion:
              type: string
              description: Condición de la empresa
            departamento:
              type: string
              description: Departamento de la empresa
            provincia:
              type: string
              description: Provincia de la empresa
            distrito:
              type: string
              description: Distrito de la empresa
            direccion:
              type: string
              description: Dirección específica
            direccion_completa:
              type: string
              description: >-
                Dirección completa, incluyendo distrito, provincia y
                departamento
            ubigeo_sunat:
              type: string
              description: Ubigeo según SUNAT
            ubigeo:
              type: array
              description: Ubigeo desglosado por componentes
              items:
                type: string
            es_agente_de_retencion:
              type: string
              description: Indica si es agente de retención
            es_agente_de_percepcion:
              type: string
              description: Indica si es agente de percepción
            es_agente_de_percepcion_combustible:
              type: string
              description: Indica si es agente de percepción de combustibles
            es_buen_contribuyente:
              type: string
              description: Indica si está catalogado como buen contribuyente
      example:
        success: true
        message: exito
        data:
          ruc: '20552103816'
          nombre_o_razon_social: AGROLIGHT PERU S.A.C.
          estado: SUSPENSION TEMPORAL
          condicion: HABIDO
          departamento: LIMA
          provincia: LIMA
          distrito: SANTA ANITA
          direccion: PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET.
          direccion_completa: >-
            PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET., LIMA -
            LIMA - SANTA ANITA
          ubigeo_sunat: '150137'
          ubigeo:
            - '15'
            - '1501'
            - '150137'
          es_agente_de_retencion: 'NO'
          es_agente_de_percepcion: 'NO'
          es_agente_de_percepcion_combustible: 'NO'
          es_buen_contribuyente: SI
    error:
      required:
        - message
        - success
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
      example:
        success: false
        message: Bad Request
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

````

> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# RUC

> Consulta RUC por número.

## OpenAPI

````yaml POST /ruc
openapi: 3.0.1
info:
  title: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  description: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  version: 1.0.0
servers:
  - url: https://api.json.pe/api
security:
  - bearerAuth: []
paths:
  /ruc:
    post:
      tags:
        - ruc
      description: Consulta RUC por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ruc-request'
      responses:
        '200':
          description: ruc response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ruc'
        '404':
          description: Recurso no encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error'
              example:
                success: false
                message: No se encontró RUC
components:
  schemas:
    ruc-request:
      type: object
      required:
        - ruc
      properties:
        ruc:
          type: string
          description: El RUC a consultar
          example: '20552103816'
      example:
        ruc: '20552103816'
    ruc:
      type: object
      properties:
        success:
          type: boolean
          description: El estado de la respuesta  true o false
        message:
          type: string
          description: Mensaje de la respuesta
        data:
          type: object
          description: Datos detallados de la respuesta
          properties:
            ruc:
              type: string
              description: Número de identificación (RUC)
            nombre_o_razon_social:
              type: string
              description: Nombre o Razon Social de la empresa
            estado:
              type: string
              description: Estado de la empresa
            condicion:
              type: string
              description: Condición de la empresa
            departamento:
              type: string
              description: Departamento de la empresa
            provincia:
              type: string
              description: Provincia de la empresa
            distrito:
              type: string
              description: Distrito de la empresa
            direccion:
              type: string
              description: Dirección específica
            direccion_completa:
              type: string
              description: >-
                Dirección completa, incluyendo distrito, provincia y
                departamento
            ubigeo_sunat:
              type: string
              description: Ubigeo según SUNAT
            ubigeo:
              type: array
              description: Ubigeo desglosado por componentes
              items:
                type: string
            es_agente_de_retencion:
              type: string
              description: Indica si es agente de retención
            es_agente_de_percepcion:
              type: string
              description: Indica si es agente de percepción
            es_agente_de_percepcion_combustible:
              type: string
              description: Indica si es agente de percepción de combustibles
            es_buen_contribuyente:
              type: string
              description: Indica si está catalogado como buen contribuyente
      example:
        success: true
        message: exito
        data:
          ruc: '20552103816'
          nombre_o_razon_social: AGROLIGHT PERU S.A.C.
          estado: SUSPENSION TEMPORAL
          condicion: HABIDO
          departamento: LIMA
          provincia: LIMA
          distrito: SANTA ANITA
          direccion: PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET.
          direccion_completa: >-
            PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET., LIMA -
            LIMA - SANTA ANITA
          ubigeo_sunat: '150137'
          ubigeo:
            - '15'
            - '1501'
            - '150137'
          es_agente_de_retencion: 'NO'
          es_agente_de_percepcion: 'NO'
          es_agente_de_percepcion_combustible: 'NO'
          es_buen_contribuyente: SI
    error:
      required:
        - message
        - success
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
      example:
        success: false
        message: Bad Request
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

````

> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# RUC

> Consulta RUC por número.

## OpenAPI

````yaml POST /ruc
openapi: 3.0.1
info:
  title: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  description: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  version: 1.0.0
servers:
  - url: https://api.json.pe/api
security:
  - bearerAuth: []
paths:
  /ruc:
    post:
      tags:
        - ruc
      description: Consulta RUC por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ruc-request'
      responses:
        '200':
          description: ruc response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ruc'
        '404':
          description: Recurso no encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error'
              example:
                success: false
                message: No se encontró RUC
components:
  schemas:
    ruc-request:
      type: object
      required:
        - ruc
      properties:
        ruc:
          type: string
          description: El RUC a consultar
          example: '20552103816'
      example:
        ruc: '20552103816'
    ruc:
      type: object
      properties:
        success:
          type: boolean
          description: El estado de la respuesta  true o false
        message:
          type: string
          description: Mensaje de la respuesta
        data:
          type: object
          description: Datos detallados de la respuesta
          properties:
            ruc:
              type: string
              description: Número de identificación (RUC)
            nombre_o_razon_social:
              type: string
              description: Nombre o Razon Social de la empresa
            estado:
              type: string
              description: Estado de la empresa
            condicion:
              type: string
              description: Condición de la empresa
            departamento:
              type: string
              description: Departamento de la empresa
            provincia:
              type: string
              description: Provincia de la empresa
            distrito:
              type: string
              description: Distrito de la empresa
            direccion:
              type: string
              description: Dirección específica
            direccion_completa:
              type: string
              description: >-
                Dirección completa, incluyendo distrito, provincia y
                departamento
            ubigeo_sunat:
              type: string
              description: Ubigeo según SUNAT
            ubigeo:
              type: array
              description: Ubigeo desglosado por componentes
              items:
                type: string
            es_agente_de_retencion:
              type: string
              description: Indica si es agente de retención
            es_agente_de_percepcion:
              type: string
              description: Indica si es agente de percepción
            es_agente_de_percepcion_combustible:
              type: string
              description: Indica si es agente de percepción de combustibles
            es_buen_contribuyente:
              type: string
              description: Indica si está catalogado como buen contribuyente
      example:
        success: true
        message: exito
        data:
          ruc: '20552103816'
          nombre_o_razon_social: AGROLIGHT PERU S.A.C.
          estado: SUSPENSION TEMPORAL
          condicion: HABIDO
          departamento: LIMA
          provincia: LIMA
          distrito: SANTA ANITA
          direccion: PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET.
          direccion_completa: >-
            PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET., LIMA -
            LIMA - SANTA ANITA
          ubigeo_sunat: '150137'
          ubigeo:
            - '15'
            - '1501'
            - '150137'
          es_agente_de_retencion: 'NO'
          es_agente_de_percepcion: 'NO'
          es_agente_de_percepcion_combustible: 'NO'
          es_buen_contribuyente: SI
    error:
      required:
        - message
        - success
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
      example:
        success: false
        message: Bad Request
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

````

> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# RUC

> Consulta RUC por número.

## OpenAPI

````yaml POST /ruc
openapi: 3.0.1
info:
  title: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  description: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  version: 1.0.0
servers:
  - url: https://api.json.pe/api
security:
  - bearerAuth: []
paths:
  /ruc:
    post:
      tags:
        - ruc
      description: Consulta RUC por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ruc-request'
      responses:
        '200':
          description: ruc response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ruc'
        '404':
          description: Recurso no encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error'
              example:
                success: false
                message: No se encontró RUC
components:
  schemas:
    ruc-request:
      type: object
      required:
        - ruc
      properties:
        ruc:
          type: string
          description: El RUC a consultar
          example: '20552103816'
      example:
        ruc: '20552103816'
    ruc:
      type: object
      properties:
        success:
          type: boolean
          description: El estado de la respuesta  true o false
        message:
          type: string
          description: Mensaje de la respuesta
        data:
          type: object
          description: Datos detallados de la respuesta
          properties:
            ruc:
              type: string
              description: Número de identificación (RUC)
            nombre_o_razon_social:
              type: string
              description: Nombre o Razon Social de la empresa
            estado:
              type: string
              description: Estado de la empresa
            condicion:
              type: string
              description: Condición de la empresa
            departamento:
              type: string
              description: Departamento de la empresa
            provincia:
              type: string
              description: Provincia de la empresa
            distrito:
              type: string
              description: Distrito de la empresa
            direccion:
              type: string
              description: Dirección específica
            direccion_completa:
              type: string
              description: >-
                Dirección completa, incluyendo distrito, provincia y
                departamento
            ubigeo_sunat:
              type: string
              description: Ubigeo según SUNAT
            ubigeo:
              type: array
              description: Ubigeo desglosado por componentes
              items:
                type: string
            es_agente_de_retencion:
              type: string
              description: Indica si es agente de retención
            es_agente_de_percepcion:
              type: string
              description: Indica si es agente de percepción
            es_agente_de_percepcion_combustible:
              type: string
              description: Indica si es agente de percepción de combustibles
            es_buen_contribuyente:
              type: string
              description: Indica si está catalogado como buen contribuyente
      example:
        success: true
        message: exito
        data:
          ruc: '20552103816'
          nombre_o_razon_social: AGROLIGHT PERU S.A.C.
          estado: SUSPENSION TEMPORAL
          condicion: HABIDO
          departamento: LIMA
          provincia: LIMA
          distrito: SANTA ANITA
          direccion: PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET.
          direccion_completa: >-
            PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET., LIMA -
            LIMA - SANTA ANITA
          ubigeo_sunat: '150137'
          ubigeo:
            - '15'
            - '1501'
            - '150137'
          es_agente_de_retencion: 'NO'
          es_agente_de_percepcion: 'NO'
          es_agente_de_percepcion_combustible: 'NO'
          es_buen_contribuyente: SI
    error:
      required:
        - message
        - success
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
      example:
        success: false
        message: Bad Request
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

````

> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# RUC

> Consulta RUC por número.

## OpenAPI

````yaml POST /ruc
openapi: 3.0.1
info:
  title: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  description: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  version: 1.0.0
servers:
  - url: https://api.json.pe/api
security:
  - bearerAuth: []
paths:
  /ruc:
    post:
      tags:
        - ruc
      description: Consulta RUC por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ruc-request'
      responses:
        '200':
          description: ruc response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ruc'
        '404':
          description: Recurso no encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error'
              example:
                success: false
                message: No se encontró RUC
components:
  schemas:
    ruc-request:
      type: object
      required:
        - ruc
      properties:
        ruc:
          type: string
          description: El RUC a consultar
          example: '20552103816'
      example:
        ruc: '20552103816'
    ruc:
      type: object
      properties:
        success:
          type: boolean
          description: El estado de la respuesta  true o false
        message:
          type: string
          description: Mensaje de la respuesta
        data:
          type: object
          description: Datos detallados de la respuesta
          properties:
            ruc:
              type: string
              description: Número de identificación (RUC)
            nombre_o_razon_social:
              type: string
              description: Nombre o Razon Social de la empresa
            estado:
              type: string
              description: Estado de la empresa
            condicion:
              type: string
              description: Condición de la empresa
            departamento:
              type: string
              description: Departamento de la empresa
            provincia:
              type: string
              description: Provincia de la empresa
            distrito:
              type: string
              description: Distrito de la empresa
            direccion:
              type: string
              description: Dirección específica
            direccion_completa:
              type: string
              description: >-
                Dirección completa, incluyendo distrito, provincia y
                departamento
            ubigeo_sunat:
              type: string
              description: Ubigeo según SUNAT
            ubigeo:
              type: array
              description: Ubigeo desglosado por componentes
              items:
                type: string
            es_agente_de_retencion:
              type: string
              description: Indica si es agente de retención
            es_agente_de_percepcion:
              type: string
              description: Indica si es agente de percepción
            es_agente_de_percepcion_combustible:
              type: string
              description: Indica si es agente de percepción de combustibles
            es_buen_contribuyente:
              type: string
              description: Indica si está catalogado como buen contribuyente
      example:
        success: true
        message: exito
        data:
          ruc: '20552103816'
          nombre_o_razon_social: AGROLIGHT PERU S.A.C.
          estado: SUSPENSION TEMPORAL
          condicion: HABIDO
          departamento: LIMA
          provincia: LIMA
          distrito: SANTA ANITA
          direccion: PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET.
          direccion_completa: >-
            PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET., LIMA -
            LIMA - SANTA ANITA
          ubigeo_sunat: '150137'
          ubigeo:
            - '15'
            - '1501'
            - '150137'
          es_agente_de_retencion: 'NO'
          es_agente_de_percepcion: 'NO'
          es_agente_de_percepcion_combustible: 'NO'
          es_buen_contribuyente: SI
    error:
      required:
        - message
        - success
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
      example:
        success: false
        message: Bad Request
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

````

> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# RUC

> Consulta RUC por número.

## OpenAPI

````yaml POST /ruc
openapi: 3.0.1
info:
  title: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  description: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  version: 1.0.0
servers:
  - url: https://api.json.pe/api
security:
  - bearerAuth: []
paths:
  /ruc:
    post:
      tags:
        - ruc
      description: Consulta RUC por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ruc-request'
      responses:
        '200':
          description: ruc response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ruc'
        '404':
          description: Recurso no encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error'
              example:
                success: false
                message: No se encontró RUC
components:
  schemas:
    ruc-request:
      type: object
      required:
        - ruc
      properties:
        ruc:
          type: string
          description: El RUC a consultar
          example: '20552103816'
      example:
        ruc: '20552103816'
    ruc:
      type: object
      properties:
        success:
          type: boolean
          description: El estado de la respuesta  true o false
        message:
          type: string
          description: Mensaje de la respuesta
        data:
          type: object
          description: Datos detallados de la respuesta
          properties:
            ruc:
              type: string
              description: Número de identificación (RUC)
            nombre_o_razon_social:
              type: string
              description: Nombre o Razon Social de la empresa
            estado:
              type: string
              description: Estado de la empresa
            condicion:
              type: string
              description: Condición de la empresa
            departamento:
              type: string
              description: Departamento de la empresa
            provincia:
              type: string
              description: Provincia de la empresa
            distrito:
              type: string
              description: Distrito de la empresa
            direccion:
              type: string
              description: Dirección específica
            direccion_completa:
              type: string
              description: >-
                Dirección completa, incluyendo distrito, provincia y
                departamento
            ubigeo_sunat:
              type: string
              description: Ubigeo según SUNAT
            ubigeo:
              type: array
              description: Ubigeo desglosado por componentes
              items:
                type: string
            es_agente_de_retencion:
              type: string
              description: Indica si es agente de retención
            es_agente_de_percepcion:
              type: string
              description: Indica si es agente de percepción
            es_agente_de_percepcion_combustible:
              type: string
              description: Indica si es agente de percepción de combustibles
            es_buen_contribuyente:
              type: string
              description: Indica si está catalogado como buen contribuyente
      example:
        success: true
        message: exito
        data:
          ruc: '20552103816'
          nombre_o_razon_social: AGROLIGHT PERU S.A.C.
          estado: SUSPENSION TEMPORAL
          condicion: HABIDO
          departamento: LIMA
          provincia: LIMA
          distrito: SANTA ANITA
          direccion: PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET.
          direccion_completa: >-
            PJ. JORGE BASADRE NRO. 158 URB. POP LA UNIVERSAL 2DA ET., LIMA -
            LIMA - SANTA ANITA
          ubigeo_sunat: '150137'
          ubigeo:
            - '15'
            - '1501'
            - '150137'
          es_agente_de_retencion: 'NO'
          es_agente_de_percepcion: 'NO'
          es_agente_de_percepcion_combustible: 'NO'
          es_buen_contribuyente: SI
    error:
      required:
        - message
        - success
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
      example:
        success: false
        message: Bad Request
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

````

> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# Placa de vehiculo

> Consulta placa por número.

## OpenAPI

````yaml POST /placa
openapi: 3.0.1
info:
  title: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  description: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  version: 1.0.0
servers:
  - url: https://api.json.pe/api
security:
  - bearerAuth: []
paths:
  /placa:
    post:
      tags:
        - placa
      description: Consulta placa por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/placa-request'
      responses:
        '200':
          description: placa response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/placa'
        '400':
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error'
components:
  schemas:
    placa-request:
      type: object
      required:
        - placa
      properties:
        placa:
          type: string
          description: La placa a consultar
          example: F3H792
      example:
        placa: F3H792
    placa:
      type: object
      properties:
        success:
          type: boolean
          description: El estado de la respuesta  true o false
        message:
          type: string
          description: Mensaje de la respuesta
        data:
          type: object
          description: Datos detallados de la respuesta
          properties:
            placa:
              type: string
              description: Placa del vehiculo
            marca:
              type: string
              description: Marca del vehiculo
            modelo:
              type: string
              description: Modelo del vehiculo
            serie:
              type: string
              description: Serie del vehiculo
            color:
              type: string
              description: Color del vehiculo
            motor:
              type: string
              description: Motor del vehiculo
            vin:
              type: string
              description: VIN del vehiculo
      example:
        success: true
        message: exito
        data:
          placa: F3H792
          marca: FIAT
          modelo: FIORINO
          serie: 9BD25521A98854312
          color: BLANCO BANCHISA
          motor: '8632404'
          vin: 9BD25521A98854312
    error:
      required:
        - message
        - success
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
      example:
        success: false
        message: Bad Request
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

````

> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# Placa de vehiculo

> Consulta placa por número.

## OpenAPI

````yaml POST /placa
openapi: 3.0.1
info:
  title: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  description: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  version: 1.0.0
servers:
  - url: https://api.json.pe/api
security:
  - bearerAuth: []
paths:
  /placa:
    post:
      tags:
        - placa
      description: Consulta placa por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/placa-request'
      responses:
        '200':
          description: placa response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/placa'
        '400':
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error'
components:
  schemas:
    placa-request:
      type: object
      required:
        - placa
      properties:
        placa:
          type: string
          description: La placa a consultar
          example: F3H792
      example:
        placa: F3H792
    placa:
      type: object
      properties:
        success:
          type: boolean
          description: El estado de la respuesta  true o false
        message:
          type: string
          description: Mensaje de la respuesta
        data:
          type: object
          description: Datos detallados de la respuesta
          properties:
            placa:
              type: string
              description: Placa del vehiculo
            marca:
              type: string
              description: Marca del vehiculo
            modelo:
              type: string
              description: Modelo del vehiculo
            serie:
              type: string
              description: Serie del vehiculo
            color:
              type: string
              description: Color del vehiculo
            motor:
              type: string
              description: Motor del vehiculo
            vin:
              type: string
              description: VIN del vehiculo
      example:
        success: true
        message: exito
        data:
          placa: F3H792
          marca: FIAT
          modelo: FIORINO
          serie: 9BD25521A98854312
          color: BLANCO BANCHISA
          motor: '8632404'
          vin: 9BD25521A98854312
    error:
      required:
        - message
        - success
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
      example:
        success: false
        message: Bad Request
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

````

> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# Placa de vehiculo

> Consulta placa por número.

## OpenAPI

````yaml POST /placa
openapi: 3.0.1
info:
  title: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  description: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  version: 1.0.0
servers:
  - url: https://api.json.pe/api
security:
  - bearerAuth: []
paths:
  /placa:
    post:
      tags:
        - placa
      description: Consulta placa por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/placa-request'
      responses:
        '200':
          description: placa response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/placa'
        '400':
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error'
components:
  schemas:
    placa-request:
      type: object
      required:
        - placa
      properties:
        placa:
          type: string
          description: La placa a consultar
          example: F3H792
      example:
        placa: F3H792
    placa:
      type: object
      properties:
        success:
          type: boolean
          description: El estado de la respuesta  true o false
        message:
          type: string
          description: Mensaje de la respuesta
        data:
          type: object
          description: Datos detallados de la respuesta
          properties:
            placa:
              type: string
              description: Placa del vehiculo
            marca:
              type: string
              description: Marca del vehiculo
            modelo:
              type: string
              description: Modelo del vehiculo
            serie:
              type: string
              description: Serie del vehiculo
            color:
              type: string
              description: Color del vehiculo
            motor:
              type: string
              description: Motor del vehiculo
            vin:
              type: string
              description: VIN del vehiculo
      example:
        success: true
        message: exito
        data:
          placa: F3H792
          marca: FIAT
          modelo: FIORINO
          serie: 9BD25521A98854312
          color: BLANCO BANCHISA
          motor: '8632404'
          vin: 9BD25521A98854312
    error:
      required:
        - message
        - success
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
      example:
        success: false
        message: Bad Request
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

````

> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# Placa de vehiculo

> Consulta placa por número.

## OpenAPI

````yaml POST /placa
openapi: 3.0.1
info:
  title: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  description: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  version: 1.0.0
servers:
  - url: https://api.json.pe/api
security:
  - bearerAuth: []
paths:
  /placa:
    post:
      tags:
        - placa
      description: Consulta placa por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/placa-request'
      responses:
        '200':
          description: placa response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/placa'
        '400':
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error'
components:
  schemas:
    placa-request:
      type: object
      required:
        - placa
      properties:
        placa:
          type: string
          description: La placa a consultar
          example: F3H792
      example:
        placa: F3H792
    placa:
      type: object
      properties:
        success:
          type: boolean
          description: El estado de la respuesta  true o false
        message:
          type: string
          description: Mensaje de la respuesta
        data:
          type: object
          description: Datos detallados de la respuesta
          properties:
            placa:
              type: string
              description: Placa del vehiculo
            marca:
              type: string
              description: Marca del vehiculo
            modelo:
              type: string
              description: Modelo del vehiculo
            serie:
              type: string
              description: Serie del vehiculo
            color:
              type: string
              description: Color del vehiculo
            motor:
              type: string
              description: Motor del vehiculo
            vin:
              type: string
              description: VIN del vehiculo
      example:
        success: true
        message: exito
        data:
          placa: F3H792
          marca: FIAT
          modelo: FIORINO
          serie: 9BD25521A98854312
          color: BLANCO BANCHISA
          motor: '8632404'
          vin: 9BD25521A98854312
    error:
      required:
        - message
        - success
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
      example:
        success: false
        message: Bad Request
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

````

> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# Placa de vehiculo

> Consulta placa por número.

## OpenAPI

````yaml POST /placa
openapi: 3.0.1
info:
  title: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  description: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  version: 1.0.0
servers:
  - url: https://api.json.pe/api
security:
  - bearerAuth: []
paths:
  /placa:
    post:
      tags:
        - placa
      description: Consulta placa por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/placa-request'
      responses:
        '200':
          description: placa response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/placa'
        '400':
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error'
components:
  schemas:
    placa-request:
      type: object
      required:
        - placa
      properties:
        placa:
          type: string
          description: La placa a consultar
          example: F3H792
      example:
        placa: F3H792
    placa:
      type: object
      properties:
        success:
          type: boolean
          description: El estado de la respuesta  true o false
        message:
          type: string
          description: Mensaje de la respuesta
        data:
          type: object
          description: Datos detallados de la respuesta
          properties:
            placa:
              type: string
              description: Placa del vehiculo
            marca:
              type: string
              description: Marca del vehiculo
            modelo:
              type: string
              description: Modelo del vehiculo
            serie:
              type: string
              description: Serie del vehiculo
            color:
              type: string
              description: Color del vehiculo
            motor:
              type: string
              description: Motor del vehiculo
            vin:
              type: string
              description: VIN del vehiculo
      example:
        success: true
        message: exito
        data:
          placa: F3H792
          marca: FIAT
          modelo: FIORINO
          serie: 9BD25521A98854312
          color: BLANCO BANCHISA
          motor: '8632404'
          vin: 9BD25521A98854312
    error:
      required:
        - message
        - success
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
      example:
        success: false
        message: Bad Request
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

````

> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# Placa de vehiculo

> Consulta placa por número.

## OpenAPI

````yaml POST /placa
openapi: 3.0.1
info:
  title: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  description: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  version: 1.0.0
servers:
  - url: https://api.json.pe/api
security:
  - bearerAuth: []
paths:
  /placa:
    post:
      tags:
        - placa
      description: Consulta placa por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/placa-request'
      responses:
        '200':
          description: placa response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/placa'
        '400':
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error'
components:
  schemas:
    placa-request:
      type: object
      required:
        - placa
      properties:
        placa:
          type: string
          description: La placa a consultar
          example: F3H792
      example:
        placa: F3H792
    placa:
      type: object
      properties:
        success:
          type: boolean
          description: El estado de la respuesta  true o false
        message:
          type: string
          description: Mensaje de la respuesta
        data:
          type: object
          description: Datos detallados de la respuesta
          properties:
            placa:
              type: string
              description: Placa del vehiculo
            marca:
              type: string
              description: Marca del vehiculo
            modelo:
              type: string
              description: Modelo del vehiculo
            serie:
              type: string
              description: Serie del vehiculo
            color:
              type: string
              description: Color del vehiculo
            motor:
              type: string
              description: Motor del vehiculo
            vin:
              type: string
              description: VIN del vehiculo
      example:
        success: true
        message: exito
        data:
          placa: F3H792
          marca: FIAT
          modelo: FIORINO
          serie: 9BD25521A98854312
          color: BLANCO BANCHISA
          motor: '8632404'
          vin: 9BD25521A98854312
    error:
      required:
        - message
        - success
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
      example:
        success: false
        message: Bad Request
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

````

> ## Documentation Index
>
> Fetch the complete documentation index at: <https://docs.json.pe/llms.txt>
> Use this file to discover all available pages before exploring further.

# Placa de vehiculo

> Consulta placa por número.

## OpenAPI

````yaml POST /placa
openapi: 3.0.1
info:
  title: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  description: json.pe - API Consulta RUC, DNI, Placa, SOAT, Licencia de Conducir y más
  version: 1.0.0
servers:
  - url: https://api.json.pe/api
security:
  - bearerAuth: []
paths:
  /placa:
    post:
      tags:
        - placa
      description: Consulta placa por número.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/placa-request'
      responses:
        '200':
          description: placa response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/placa'
        '400':
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/error'
components:
  schemas:
    placa-request:
      type: object
      required:
        - placa
      properties:
        placa:
          type: string
          description: La placa a consultar
          example: F3H792
      example:
        placa: F3H792
    placa:
      type: object
      properties:
        success:
          type: boolean
          description: El estado de la respuesta  true o false
        message:
          type: string
          description: Mensaje de la respuesta
        data:
          type: object
          description: Datos detallados de la respuesta
          properties:
            placa:
              type: string
              description: Placa del vehiculo
            marca:
              type: string
              description: Marca del vehiculo
            modelo:
              type: string
              description: Modelo del vehiculo
            serie:
              type: string
              description: Serie del vehiculo
            color:
              type: string
              description: Color del vehiculo
            motor:
              type: string
              description: Motor del vehiculo
            vin:
              type: string
              description: VIN del vehiculo
      example:
        success: true
        message: exito
        data:
          placa: F3H792
          marca: FIAT
          modelo: FIORINO
          serie: 9BD25521A98854312
          color: BLANCO BANCHISA
          motor: '8632404'
          vin: 9BD25521A98854312
    error:
      required:
        - message
        - success
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
      example:
        success: false
        message: Bad Request
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer

````
