> **Proyecto:** Simulador de Inversiones

> **Versión del documento:** 1.3

> **Fecha:** 2026-05-04

> **Autor(es):** Alejo Suarez / Matias Fernandez / Pablo Duval / Ramiro Gomez Rivelli / Agustin Begue

> **Estado:** `Borrador`

---

## Índice

1. [Control de Versiones del Documento](#control-de-versiones-del-documento)
2. [Requerimientos Funcionales](#requerimientos-funcionales)
3. [Requerimientos No Funcionales](#requerimientos-no-funcionales)

---

## Control de Versiones del Documento

| Versión | Fecha      | Autor         | Descripción del Cambio          |
|---------|------------|----------------|---------------------------------|
| 1.0     | 2026-05-04 | [Alejo Suarez] | Versión inicial del documento   |
| 1.1     | 2026-05-05 | [Agustin Begue - Matias Fernandez] | Actualización del documento   |
| 1.2     | 2026-05-20 | [Agustin Begue - Matias Fernandez - Alejo Suarez] | Revision y actualizacion del documento   |
| 1.3     | 2026-05-21 | [Agustin Begue]| Ajuste en criterios de autorizacion RF-003 al RF-006 |    

---

## Requerimientos Funcionales

### RF-001 — Registro de Inversor

| Campo         | Detalle        |
|---------------|----------------|
| **ID**        | RF-001         |
| **Nombre**    | Registro de Inversor |
| **Tipo**      | Funcional      |
| **Prioridad** | `Alta`         |
| **Estado**    | `En desarrollo`    |

#### Descripción
> El usuario interesado en operar en la plataforma accederá a la página de registro, donde se le presentará un formulario para ingresar sus datos personales (nombre completo, correo electrónico, contraseña). El sistema contará con un botón para confirmar el registro. 

```
El sistema debe permitir dar de alta a un nuevo inversor siempre y cuando el correo electrónico ingresado no se encuentre registrado previamente y la contraseña cumpla con las políticas de seguridad. En el caso en que esta operación sea exitosa, se creará el perfil del usuario, se le asignará una billetera digital con un saldo inicial de $10000.
```

#### Criterios de Aceptación
- [x] El sistema debe mostrar un mensaje de error claro si alguno de los campos obligatorios del formulario queda vacío.
- [x] El servidor debe validar en tiempo real que el formato del correo electrónico sea válido y que las contraseñas coincidan.
- [x] El servidor retorna el código HTTP `201 Created` en caso de que la operación de registro sea exitosa.
- [x] El servidor retorna el código HTTP `400 Bad Request` en caso de que el correo electrónico ya exista en el sistema o los datos enviados no cumplan con las validaciones de negocio.

---

### RF-002 — Inicio de Sesion

| Campo         | Detalle        |
|---------------|----------------|
| **ID**        | RF-002         |
| **Nombre**    | Inicio de Sesion |
| **Tipo**      | Funcional      |
| **Prioridad** | `Alta`         |
| **Estado**    | `En desarrollo`    |

#### Descripción
> El usuario registrado accederá a la página de inicio de sesión, donde se le presentará un formulario para ingresar sus credenciales (correo electrónico y contraseña).

```
El sistema debe permitir el acceso a la plataforma solo a aquellos usuarios que introduzcan un correo electrónico y una contraseña válidos que coincidan con los registros del sistema. En el caso en que esta operación sea exitosa, se generará una sesión activa (token de autenticación) y se redireccionará al usuario a la pantalla principal o dashboard de activos.
```

#### Criterios de Aceptación
- [x] El sistema debe enmascarar los caracteres de la contraseña a medida que el usuario los introduce por motivos de seguridad.
- [x] El servidor debe validar que el correo electrónico introducido tenga un formato válido antes de procesar la solicitud.
- [x] El servidor retorna el código HTTP `200 OK` junto con el token de acceso en caso de que las credenciales sean correctas.
- [x] El servidor retorna el código HTTP `401 Unauthorized` en caso de que el correo electrónico o la contraseña sean incorrectos, mostrando un mensaje genérico para evitar la exposición de datos.

---

### RF-003 — Compra de Activos

| Campo         | Detalle        |
|---------------|----------------|
| **ID**        | RF-003         |
| **Nombre**    | Compra de Activos |
| **Tipo**      | Funcional      |
| **Prioridad** | `Alta`         |
| **Estado**    | `En desarrollo`    |

#### Descripción
> En el caso de una compra el inversor accedera a la pagina de mercado, seleccionara el activo a comprar, se mostrara una seccion con informacion al detalle donde se le permitira ingresar el monto y tendra un boton para confirmar. 

```
El sistema debe permitir comprar activos cuando el inversor, con una sesion iniciada, tenga el saldo suficiente 
para adquirirlo. En el caso en que esta operacion sea exitosa, se descontara el dinero de la transaccion de
su saldo digital y se asignara el activo a su portafolio como parte de sus tenencias.
```

#### Criterios de Aceptación
- [x] El sistema debe mostrar el saldo disponible del inversor en la pantalla de confirmación de compra.
- [x] El servidor debe validar en tiempo real que el monto de la compra no exceda el saldo digital del usuario.
- [x] El servidor retorna el codigo HTTP `401 Unauthorized` si el usuario no ha iniciado sesion.
- [x] El servidor retorna el codigo HTTP `200 OK` en caso de que la operacion sea exitosa.
- [x] El servidor retorna el codigo HTTP `400 Bad Request` en caso de que el saldo del inversor sea insuficiente para la opeacion que intenta realizar.

---

### RF-004 — Venta de Activos

| Campo         | Detalle        |
|---------------|----------------|
| **ID**        | RF-004         |
| **Nombre**    | Venta de Activos |
| **Tipo**      | Funcional      |
| **Prioridad** | `Alta`         |
| **Estado**    | `En desarrollo`    |

#### Descripción
En caso de una venta el usuario inversor deberá acceder a su portafolio, donde el sistema muestra únicamente los activos con tenencia disponible y muestra la cantidad existente de cada uno de ellos. Se seleccionará el activo, su cantidad y visualizará un boton para proseguir a la venta.

```
Para ejecutar una venta de activos el sistema revisará que exista la tenencia del activo, modificará 
la tenencia segun sea acorde (borrando o modificandola) y agregara dinero al saldo. Las ventas 
se realizaran desde el portafolio lo que imposibilitará al usuario a vender un activo que no posee.

```

#### Criterios de Aceptación
- [x] El servidor debe validar que la cantidad a vender sea mayor a 0 y menor o igual a la tenencia disponible del usuario.
- [x] El servidor debe descontar correctamente la cantidad vendida de la tenencia del activo.
- [x] El servidor debe eliminar el registro de la tenencia en el portafolio si la cantidad resultante es igual a 0.
- [x] El servidor debe acreditar en el saldo del usuario el monto correspondiente a la venta del activo.
- [x] El servidor retorna el codigo HTTP `401 Unauthorized` si el usuario no ha iniciado sesion.
- [x] El servidor retorna el código HTTP `200 OK` en caso de que la operación de venta sea exitosa.
- [x] El servidor retorna el código HTTP `400 Bad Request` si la cantidad ingresada es inválida (menor o igual a 0).
- [x] El servidor retorna el código HTTP `409 Conflict` si la cantidad a vender es mayor a la tenencia disponible.


---

### RF-005 — Creacion de Activos

| Campo         | Detalle        |
|---------------|----------------|
| **ID**        | RF-005         |
| **Nombre**    | Creacion de Activos |
| **Tipo**      | Funcional      |
| **Prioridad** | `Baja`         |
| **Estado**    | `En desarrollo`    |
---

#### Descripción
> El sistema debe permitir a un usuario con rol de Administrador (ADMIN) crear nuevos activos financieros. Esta operación habilitará la disponibilidad del activo para que aparezca listado y esté disponible para operaciones en la página de mercado.

```
El sistema debe proveer una interfaz para ingresar los datos mínimos del activo, validar los datos 
obligatorios y, al confirmar la creación con éxito, guardarlo en la base de datos. Una vez creado con éxito,
el activo debe integrarse y mostrarse dinámicamente en el listado principal de la página de mercado.
```

#### Criterios de Aceptación
- [x] El servidor debe validar que el Símbolo/Ticker no exista previamente en la base de datos antes de confirmar la creación.
- [x] El servidor retorna el codigo HTTP `401 Unauthorized` si el usuario no ha iniciado sesion.
- [x] El servidor retorna el codigo HTTP `403 Forbidden` si el usuario autenticado no posee el rol de Administrador.
- [x] El servidor retorna el código HTTP `201 Created` en caso de que la operación de creación sea exitosa.
- [x] El servidor retorna el código HTTP `409 Conflict` si se intenta crear un activo con un Símbolo/Ticker ya existente.

---

### RF-006 — Modificación de Activos

| Campo         | Detalle        |
|---------------|----------------|
| **ID**        | RF-006         |
| **Nombre**    | Modificación de Activos |
| **Tipo**      | Funcional      |
| **Prioridad** | `Baja`         |
| **Estado**    | `Pendiente`    |
---

#### Descripción
> El sistema debe permitir a un usuario con rol de Administrador modificar los datos identificatorios de un activo existente en la plataforma. Por reglas de integridad de negocio, esta funcionalidad está restringida únicamente a la edición del Nombre y/o el Ticker (Símbolo) del activo

```
El administrador seleccionará un activo del listado y accederá a un formulario de edición donde el campo 
de precio aparecera como "Solo lectura". Una vez realizados los cambios en el 
nombre o ticker, el sistema deberá validar que el nuevo ticker no esté duplicado y actualizar la información
en toda la plataforma, incluyendo el portafolio de los usuarios que ya posean dicho activo.
```

#### Criterios de Aceptación
- [x] El servidor debe validar que el nuevo Ticker, en caso de haber sido modificado, no coincida con uno ya existente en la base de datos (exceptuando el propio ID del activo en edición).
- [x] El servidor retorna el codigo HTTP `401 Unauthorized` si el usuario no ha iniciado sesion.
- [x] El servidor retorna el codigo HTTP `403 Forbidden` si el usuario autenticado no posee el rol de Administrador.
- [x] El servidor retorna el código HTTP `200 OK` en caso de que la actualización sea exitosa.
- [x] El servidor retorna el código HTTP `404 Not Found` si el ID del activo a editar no existe.
- [x] El servidor retorna el código HTTP `409 Conflict` si el nuevo Ticker ingresado ya pertenece a otro activo registrado.

---

### RF-007— Registro de Transacciones del Inversor

| Campo         | Detalle        |
|---------------|----------------|
| **ID**        | RF-007         |
| **Nombre**    | Registro de Transacciones del inversor |
| **Tipo**      | Funcional      |
| **Prioridad** | `Media`         |
| **Estado**    | `Pendiente`    |
---

#### Descripción
> El sistema debe permitir a un inversor acceder a una pantalla de historial de transacciones desde su portafolio donde se visualizarán todas las operaciones de compra y venta realizadas. La información deberá presentarse de forma paginada y permitir su filtrado por activo.

```
El sistema debe proveer un endpoint que retorne las transacciones asociadas al inversor actual, 
ordenadas por fecha de creación en orden descendente. Los resultados deben estar paginados en bloques 
de 10 elementos. El endpoint debe permitir opcionalmente filtrar por activo. 
Cada transacción debe incluir: identificador, tipo de operación, activo involucrado, cantidad,
monto y fecha. La información debe persistirse en la base de datos y recuperarse de forma consistente.
```

#### Criterios de Aceptación
- [x] El servidor debe retornar únicamente las transacciones asociadas al inversor autenticado.
- [x] El servidor debe paginar los resultados en bloques de 10 transacciones por página.
- [x] El servidor debe ordenar las transacciones por fecha de creación en orden descendente (más recientes primero).
- [x] El servidor debe permitir filtrar las transacciones por activo mediante un parámetro opcional.
- [x] El servidor debe garantizar que los datos retornados correspondan a transacciones persistidas en la base de datos.
- [x] El servidor retorna el código HTTP `500 Internal Server` Error en caso de fallas inesperadas al recuperar la información.
- [x] Cada transacción debe incluir los siguientes campos obligatorios: (ID de la transacción, Tipo de operación (compra/venta), Activo, Cantidad, Monto, Fecha de creación)
- [x] El servidor retorna el código HTTP `200 OK` cuando la consulta se realiza correctamente.
- [x] El servidor retorna el código HTTP `401 Unauthorized` si el usuario no está autenticado.
- [x] El servidor debe garantizar que los datos retornados correspondan únicamente a transacciones persistidas y asociadas al inversor.

---


## Requerimientos No Funcionales

### RNF-001 — Seguridad de Datos y Transacciones

| Campo          | Detalle         |
|----------------|-----------------|
| **ID**         | RNF-001         |
| **Nombre**     | Seguridad de Datos y Transacciones |
| **Tipo**       | No Funcional    |
| **Categoría**  | `Seguridad`    |
| **Prioridad**  | `Alta`          |
| **Estado**     | `En desarrollo`     |

#### Descripción
> El sistema debe garantizar la integridad y confidencialidad de la información financiera y personal de los usuarios.

```
Toda comunicación entre el cliente y el servidor debe realizarse sobre protocolos seguros (HTTPS/TLS). 
Además, los saldos y transacciones deben ser inmutables; cualquier operación de compra o venta debe 
quedar registrada en una base de datos centralizada.
```

#### Criterios de Aceptación
- [x] Las contraseñas de los inversores deben ser procesadas con un algoritmo de hashing (bcrypt).
- [x] El tiempo de sesión del usuario debe expirar tras 10 minutos de inactividad para evitar accesos no autorizados. 

---

### RNF-002 — Simulacion de Mercado

| Campo          | Detalle         |
|----------------|-----------------|
| **ID**         | RNF-002         |
| **Nombre**     | Simulacion de Mercado |
| **Tipo**       | No Funcional    |
| **Categoría**  | `Simulacion`    |
| **Prioridad**  | `Alta`          |
| **Estado**     | `Pendiente`     |

#### Descripción
> Para garantizar una experiencia de usuario realista, el sistema debe contar con un motor de simulación que genere operaciones de compra y venta de forma autónoma y continua.

```
Este componente debe actuar "en segundo plano" (background), inyectando órdenes en el sistema para que los activos siempre tengan volumen y movimiento de precio. Esto evita que el simulador quede estático cuando no hay suficientes usuarios reales operando, permitiendo que las estrategias de los inversores se ejecuten contra una liquidez simulada.
```

#### Criterios de Aceptación
- [x] El script debe generar al menos una operación de mercado cada 3 segundos para los activos de mayor volumen.
- [x] La fluctuación de precios generada por el script no debe exceder un +/- 5% para evitar volatilidad irreal.

---

### RNF-003 — Usabilidad y Experiencia de Usuario (UX)

| Campo          | Detalle         |
|----------------|-----------------|
| **ID**         | RNF-003         |
| **Nombre**     | Usabilidad y Experiencia de Usuario (UX) |
| **Tipo**       | No Funcional    |
| **Categoría**  | `Simulacion`    |
| **Prioridad**  | `Alta`          |
| **Estado**     | `Pendiente`     |

#### Descripción
> El sistema debe ser intuitivo para que un inversor novato pueda operar sin necesidad de un manual de usuario externo.

```
La interfaz del simulador debe ser diseñada bajo un enfoque User-Centric, garantizando que la curva de aprendizaje sea mínima para inversores principiantes. Dado que la información financiera puede ser abrumadora, el sistema debe priorizar la jerarquía visual: los saldos y botones de acción (Compra/Venta) deben ser los elementos más destacados.

El sistema debe implementar un diseño Responsive fluido que asegure que las tablas de activos sean operables tanto en pantallas de escritorio y dispositivos moviles. Además, se debe garantizar la consistencia estética; todos los componentes (botones, modales, alertas) deben seguir un mismo sistema de diseño para evitar confusión en el flujo de navegación del usuario.
```

#### Criterios de Aceptación
- [x] El diseño debe ser Responsive, adaptándose correctamente a resoluciones de dispositivos móviles, tablets y escritorio.
- [x] Los mensajes de error deben ser descriptivos y sugerir una acción correctiva (ej: "Saldo insuficiente, actualice su saldo digital").

---

### RNF-004 — Mantenibilidad y Calidad de Código

| Campo          | Detalle         |
|----------------|-----------------|
| **ID**         | RNF-004         |
| **Nombre**     | Mantenibilidad y Calidad de Código |
| **Tipo**       | No Funcional    |
| **Categoría**  | `Simulacion`    |
| **Prioridad**  | `Alta`          |
| **Estado**     | `Pendiente`     |

#### Descripción
> El código fuente debe estar estructurado de forma que sea fácil de entender, testear y extender por otros desarrolladores.

```
El software debe desarrollarse siguiendo patrones de diseño en caso de ser necesario, que desacoplen la lógica de negocio (el motor de inversiones). Esto es vital para que, en el futuro, si se decide cambiar el proveedor de precios en tiempo real, el impacto en el código sea mínimo.

Se exige el uso de estándares de codificación consistentes (Linting) y una estructura de carpetas modular. La mantenibilidad también implica que cualquier lógica compleja, como script de simulación de mercado, debe estar debidamente encapsulada y comentada, facilitando que nuevos desarrolladores se integren al proyecto y realicen cambios sin introducir regresiones en el sistema.
```

#### Criterios de Aceptación
- [x] El proyecto debe contar con una cobertura de pruebas unitarias (Unit Tests) de al menos el 80%.
- [x] El código debe estar documentado siguiendo los estándares del lenguaje utilizado (ej: JSDoc para JS o Swagger para la API).

---
