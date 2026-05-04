> **Proyecto:** Simulador de Inversiones

> **Versión del documento:** 1.0

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

| Versión | Fecha      | Autor          | Descripción del Cambio          |
|---------|------------|----------------|---------------------------------|
| 1.0     | 2026-05-04 | [Alejo Suarez] | Versión inicial del documento   |

---

## Requerimientos Funcionales

### RF-001 — Compra/Venta de Activos

| Campo         | Detalle        |
|---------------|----------------|
| **ID**        | RF-001         |
| **Nombre**    | Compra/Venta de Activos |
| **Tipo**      | Funcional      |
| **Prioridad** | `Alta`         |
| **Estado**    | `Pendiente`    |

#### Descripción
> En el caso de una compra el inversor accedera a la pagina de mercado, seleccionara el activo a comprar, se mostrara una seccion donde se mostrara informacion a detalle, se permitira ingresar el monto y se mostrara un boton para confiramr la compra. En el caso de una venta el inversor debera acceder a su portafolio, seleccionar el activo a vender, la cantidad y se mostrara un boton para proseguir a la venta. 

```
El sistema debe permitir comprar activos cuando el inversor que esta logueado tenga el saldo suficiente para adquirirlo, si tiene sufuciente, se descontara el monto y se añadira a las tenencias el activo comprado. En el caso de una venta el sistema revisara que exista la tenencia del activo, modificara la tenencia segun sea acorde(borrando o modificandola) y agregara dinero al saldo. En el caso de que no se tenga saldo el sistema informará al usuario, las ventas se realizaran desde el portafolio por lo que para el usuario sera imposible vender un activo que no posee.
```

---

### RF-002 — Creacion y Modificacion

| Campo         | Detalle        |
|---------------|----------------|
| **ID**        | RF-002         |
| **Nombre**    | Creacion y Modificacion de Activos |
| **Tipo**      | Funcional      |
| **Prioridad** | `Baja`         |
| **Estado**    | `Pendiente`    |
---

#### Descripción
> TBD

```
El Administrador podra modificar el nombre y el ticker de un activo elegido fuera del horario de mercado. Ademas el Administrador podra crear activos especificando el nombre, ticker y URL; La URL se utilizara para establecer el precio inicial del activo a travez de una api.
```

---

### RF-003 — Pantalla de Transacciones

| Campo         | Detalle        |
|---------------|----------------|
| **ID**        | RF-003         |
| **Nombre**    | Pantalla de Transacciones |
| **Tipo**      | Funcional      |
| **Prioridad** | `Baja`         |
| **Estado**    | `Pendiente`    |
---

#### Descripción
> Sera posible acceder a una solapa donde se mostratan los ultimos 20 moimientos que hubo en el mercado, los inversores involucrados, la cantidad y el monto.

```
Se mostraran en una solapa las ultimas transacciones hechas tanto por los inversores como por el simulador y se mostrara con el nombre del inversor o "SIMULACION" quien ha sido el responsable.
```

## Requerimientos No Funcionales

### RNF-001 — Creacion de Transacciones

| Campo          | Detalle         |
|----------------|-----------------|
| **ID**         | RNF-001         |
| **Nombre**     | Creacion de Transacciones |
| **Tipo**       | No Funcional    |
| **Categoría**  | `Registro`      |
| **Prioridad**  | `Alta`          |
| **Estado**     | `Pendiente`     |

#### Descripción
> Comprar o vender un activo debera realizarse a travez de un middleware "Sistema" que recibira datos planos para la creacion de una transaccion.

```
El Sistema debe recibir el ID del Usuario, el ID del Activo y la cantidad. Si el POST utilizado es de compra, se encontrara al Usuario, se revisara su saldo, para entonces, encontrar el Activo, y crear la Transaccion. Si el POST es de venta, se traera al Usuario y al Activo necesario para revisar el portafolio y crear la Transaccion.
```

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
> En el Backend habra una instancia de clase "Simulador" que simulará ventas y compras para los activos registrados.

```
El simulador tendra una lista de activos precargados de la BDD y los URL asociados, con esto podra realizar compras y ventas que influiran en el mercado.
```