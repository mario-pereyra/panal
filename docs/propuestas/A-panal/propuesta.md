# Propuesta de aplicación: Panal

Panal es la dirección A de la plataforma gamificada de actividades. Este documento describe la aplicación completa vista desde ese mundo: qué promete, cómo se traduce cada dato a la metáfora del panal, cómo se ven las doce pantallas y los cuatro casos de uso, cómo habla y cómo se conecta con Redux. Las reglas de juego no se repiten aquí: están en `../00-base-comun/motor-de-gamificacion.md`, y la arquitectura, en `../00-base-comun/propuesta-base.md`.

## Tabla de contenidos

1. [Resumen](#1-resumen)
2. [El mundo y su metáfora](#2-el-mundo-y-su-metáfora)
3. [Propuesta de valor y diferenciadores](#3-propuesta-de-valor-y-diferenciadores)
4. [Un día y una semana de Ana en este mundo](#4-un-día-y-una-semana-de-ana-en-este-mundo)
5. [Las doce pantallas en este mundo](#5-las-doce-pantallas-en-este-mundo)
6. [Los cuatro casos de uso en este mundo](#6-los-cuatro-casos-de-uso-en-este-mundo)
7. [Voz y textos clave](#7-voz-y-textos-clave)
8. [Redux en este mundo](#8-redux-en-este-mundo)
9. [Riesgos y mitigaciones](#9-riesgos-y-mitigaciones)
10. [Cambios respecto al tablero del lienzo](#10-cambios-respecto-al-tablero-del-lienzo)

---

## 1. Resumen

| Aspecto | Definición |
| :--- | :--- |
| **Nombre** | Panal |
| **Lema** | Celda a celda, se llena el panal. |
| **Mascota** | Zum, una abeja redonda y sonriente |
| **Promesa** | Abres la aplicación y en dos segundos sabes cuánto llevas hoy, cuánto le falta a tu equipo y qué celda conviene llenar ahora |
| **Para quién** | Estudiantes que combinan hábitos diarios con entregas y trabajos en grupo |
| **Énfasis estratégico** | Logro (CD2) e influencia social (CD5): construir juntos. Habla sobre todo al triunfador y al socializador |
| **Estilo** | Cuaderno de pegatinas: contornos de tinta, sombras duras, amarillo miel sobre papel crema |

**Por qué este mundo y no otro.** De las cinco direcciones, Panal es la única donde la pieza individual y la obra colectiva son literalmente la misma: la celda que una persona llena en su día es una celda de la colmena de su equipo. Nadie tiene que explicar cómo se relaciona "mi tarea" con "nuestro proyecto"; se ve. Además, una sola forma, el hexágono, resuelve las tres gráficas que pide el enunciado (avance por actividad, avance por proyecto y constancia), lo que hace el sistema fácil de aprender y barato de implementar.

## 2. El mundo y su metáfora

Regla de diseño: ningún elemento del mundo existe si no muestra un dato.

| Elemento del mundo | Dato que muestra | Mecánica del motor |
| :--- | :--- | :--- |
| **Celda hexagonal** | Una actividad: vacía si está pendiente, llena si está hecha | Completar actividad |
| **Celda de ronda** | Una actividad recurrente | Recurrencia |
| **Panal de hoy** (3, 5 o 7 celdas) | Completadas sobre la meta diaria | Meta diaria y progreso del día |
| **Panal cerrado** (celdas selladas con cera) | La meta diaria se cumplió | Día redondo |
| **Gota de miel** | Un punto | Puntos |
| **Oficio de la abeja** | Nivel alcanzado | Niveles |
| **Zum** | Estado del día en seis posturas | `selectEstadoMascota` |
| **La danza de Zum** | La siguiente actividad que conviene y por qué | Mecánica insignia del mundo |
| **Racha de vuelo** | Días activos consecutivos | Racha |
| **Reserva de miel** (tarro) | Protector de racha disponible | Protector |
| **Día sin flores** | Día de descanso fijado por la persona | Descanso |
| **Colmena** | Un proyecto; cada celda llena lleva el color y la inicial de quien la completó | Avance y aporte por miembro |
| **Cuadro de la colmena** (cada fila) | Un hito: 20, 40, 60, 80 y 100 % | Hitos de proyecto |
| **Enjambre** | Los miembros del proyecto | Vinculación de usuarios |
| **Zumbido** | Un ánimo enviado a otra persona | Ánimos |
| **Llamar al enjambre** | Una celda con pedido de ayuda | Pedido de ayuda |
| **Enjambrazón y colmenar** | Proyecto al 100 %: la colmena se sella, pasa a la galería de colmenas cerradas y nace una nueva | Proyecto cerrado |
| **Panal de constancia** | Un día por celda, cinco semanas, cuatro intensidades | Mapa de constancia |
| **Sello de cera** | Una insignia ganada | Insignias |
| **Alacena de mieles** | Colección: una miel por cada flor encontrada | Colección |
| **Flor rara** | Sorpresa en un día redondo | Recompensa variable |

Detalle que sostiene la metáfora: las abejas guardan miel para los días sin flores. Por eso el protector de racha es una **reserva** y el descanso es un **día sin flores**: descansar no es fallar, es parte de cómo funciona la colmena.

## 3. Propuesta de valor y diferenciadores

**Frente a una lista de tareas común.**

| Una lista de tareas | Panal |
| :--- | :--- |
| La tarea hecha desaparece | La celda llena se queda y se suma a algo que crece |
| El avance del equipo es un porcentaje | El avance es una colmena donde se ve quién llenó cada celda |
| Mañana empieza de cero | El panal de constancia muestra cinco semanas de historia |
| Decidir por dónde empezar corre por tu cuenta | Zum señala una celda y dice por qué |
| Fallar un día no tiene respuesta | Una reserva de miel cubre el día y la racha sigue |

**Frente a las otras cuatro direcciones.**

| Dirección | Dónde gana Panal | Dónde gana la otra |
| :--- | :--- | :--- |
| B · Órbita | Lectura inmediata del equipo; tono más cálido | Mejor para quien valora el ritmo propio y la calma nocturna |
| C · Cumbre | El avance del día y el del equipo usan la misma pieza | La sensación de viaje y de altura ganada es más épica |
| D · Elay con Toco | Metáfora universal, sin vocabulario que aprender | Identidad cruceña y colección de fauna y flora |
| E · Elay con Nando y Mechi | Sistema visual más simple de construir | Personajes humanos, pertenencia e idioma propio |

**Fortalezas.**

1. Coherencia total: una forma, tres gráficas.
2. El aporte de cada persona se ve sin convertirlo en competencia.
3. Es la más directa de implementar (todo se dibuja con una función que coloca hexágonos) y su metáfora ya trae consigo el descanso: reserva y día sin flores.

**Riesgos, dichos con franqueza.**

1. Es la menos original: abejas y productividad ya van juntas en la cultura popular. Lo que la distingue es la ejecución, no la idea.
2. Puede leerse como infantil si la mascota se usa de más.
3. "Abeja obrera" puede sugerir que trabajar sin parar es lo deseable. Hay que cuidar cada texto.
4. No tiene identidad local: podría ser de cualquier parte.

## 4. Un día y una semana de Ana en este mundo

**El viernes 13 de noviembre.** Ana abre Panal a las 7:40. Zum está posada en el borde de un panal de cinco celdas vacías: "Aquí estoy cuando quieras. ¿Qué celda llenamos primero?". Repasa sus apuntes de Redux y marca la celda: se llena de miel, suben 10 gotas y Zum despega. Antes del almuerzo camina 30 minutos (otras 10) y entrega su informe de avance, una actividad única que vencía hoy (25). El saludo cambia: "Llevas 3 de 5 celdas llenas. Dos más y cerramos el panal de hoy". Lleva 45 gotas en el día, 640 en total, y es Exploradora, el cuarto oficio.

Por la tarde Zum hace su danza y señala "Diseñar pantalla de reportes". El motivo aparece escrito: "Es de tu colmena. Faltan 6 celdas para el cuarto cuadro de Proyecto final". Ana la completa (25) y la colmena del equipo gana una celda amarilla, su color, con una A. Cierra con sus 15 minutos de inglés (10). El panal de hoy se sella con cera: panal cerrado, 20 gotas más. Termina el día con 695 gotas, a 5 de ser Recolectora, y Zum encuentra una flor rara: en su alacena aparece el primer tarro, miel de azahar.

**La semana.** El sábado Ana llena una sola celda de ronda. Es un día activo, así que la racha sigue (13 días), y con esas 10 gotas pasa las 700: ya es Recolectora, el quinto oficio. El domingo su racha de vuelo llega a 14 días y recibe 50 gotas por el segundo tramo de siete. Como ya guarda dos reservas de miel, no se acumula una tercera. El lunes la colmena reparte sus reconocimientos: Ana es la abeja constante por haber aportado más días, aunque Luis llenó más celdas. El miércoles Diego se traba con una actividad y llama al enjambre; Sofía la toma, la completa y recibe el reconocimiento "Ala amiga". El viernes siguiente la colmena cierra su cuarto cuadro: 30 gotas para cada persona que aportó en ese tramo, y el dibujo de la colmena empieza a gotear miel.

## 5. Las doce pantallas en este mundo

| ID | Nombre en Panal | Qué muestra | Elemento distintivo |
| :--- | :--- | :--- | :--- |
| P01 | Entrar al panal | Inicio de sesión | Zum saluda desde la entrada de una colmena |
| P02 | Crear mi panal | Registro | La fuerza de la contraseña son tres celdas que se llenan |
| P03 | Primer vuelo | Recorrido inicial en tres pasos | Se elige el tamaño del panal (3, 5 o 7) y se llena la primera celda |
| P04 | Hoy | Saludo, panal del día, celdas de hoy, colmena y constancia | Zum, el panal de hoy y la danza que sugiere la siguiente celda |
| P05 | Celdas | Todas las actividades con pestañas y filtros | Las celdas de ronda muestran su cuota semanal con celdas pequeñas |
| P06 | Nueva actividad | Crear o editar | Vista previa: "Esta celda vale +10 gotas de miel" |
| P07 | Colmenas | Proyectos propios | Cada tarjeta es una colmena en miniatura; abajo, el colmenar |
| P08 | Colmena: Proyecto final | Detalle del proyecto | Colmena grande por cuadros, enjambre, zumbidos y llamadas |
| P09 | Invitar al enjambre | Vincular usuarios | Enlace para copiar e invitaciones pendientes |
| P10 | Reportes | Constancia, cumplimiento y tendencia | Panal de constancia grande, tiras de celdas y tarros |
| P11 | Mi vuelo | Nivel, sellos de cera, alacena de mieles y ajustes | Escalera de diez oficios y estante de tarros |
| P12 | Celebración | Reconocimiento de un logro | Zum celebra; panal sellado, flor rara y siguiente meta |

## 6. Los cuatro casos de uso en este mundo

**CU-01. Registro e inicio de sesión.** La persona crea su cuenta ("Crear mi panal") y entra al "Primer vuelo": elige cuántas celdas tendrá su panal diario, crea su primera celda y la llena en ese momento. Sale con el sello de cera "Primera celda" y una reserva de miel de regalo. La victoria temprana ocurre antes de ver la pantalla principal.

**CU-02. Actividades únicas y recurrentes.** Toda actividad es una celda. Las únicas valen 25 gotas y las de ronda, 10. Se completan tocando el hexágono de la fila: se llena de miel y la celda correspondiente del panal de hoy cambia al instante. Las celdas de ronda con cuota semanal muestran su avance como tres o cuatro celdas pequeñas ("2 de 3 esta semana").

**CU-03. Proyectos y vinculación de usuarios.** Un proyecto es una colmena y sus miembros, un enjambre. Se invita por correo o con un enlace. Cada actividad del proyecto es una celda de la colmena; al completarse toma el color y la inicial de quien la hizo. Las celdas se llenan en orden, fila por fila, y cada fila completa es un cuadro: un hito. Al quinto cuadro llega la enjambrazón.

**CU-04. Reporte con gráficas.** El reporte está hecho de celdas: el panal de constancia (cinco semanas), una tira de siete celdas por actividad para ver su cumplimiento, columnas con contorno para la tendencia semanal y, por colmena, el aporte de cada miembro con su color. Cada gráfica lleva una frase que la resume y una tabla equivalente.

## 7. Voz y textos clave

**Principios.**

1. Zum habla en segunda persona y se incluye: "llenamos", "cerramos".
2. Frases cortas y en positivo. El dato primero, el ánimo después.
3. Cada palabra propia va junto a su traducción la primera vez: "Reserva de miel: protege tu racha un día".
4. Nunca se usa "trabajar más", "no pares" ni comparaciones con otras personas.

**Saludo según el estado de Zum.**

| Estado | Título | Frase |
| :--- | :--- | :--- |
| Esperando | ¡Buen vuelo, Ana! | Aquí estoy cuando quieras. ¿Qué celda llenamos primero? |
| Animando | ¡Buen vuelo, Ana! | Ya llenaste la primera. La siguiente está cerca. |
| Feliz | ¡Buen vuelo, Ana! | Llevas 3 de 5 celdas llenas. Dos más y cerramos el panal de hoy. |
| Celebrando | ¡Panal cerrado, Ana! | Cinco de cinco. Hoy la colmena tiene más miel gracias a ti. |
| Preocupada | Todavía hay luz, Ana | Con una celda basta para que tu racha de vuelo siga mañana. |
| Descansando | Hoy es día sin flores | Zum descansa y tu racha también. Nos vemos mañana. |

**Estados vacíos.**

| Pantalla | Texto |
| :--- | :--- |
| Hoy sin actividades | Tu panal de hoy está por estrenar. Crea tu primera celda. |
| Celdas, pestaña Próximas | No hay nada en el horizonte. Buen momento para planear la semana. |
| Colmenas sin proyectos | Todavía no tienes colmena. Funda una e invita a tu enjambre. |
| Reportes sin datos | Aquí aparecerá tu panal de constancia cuando llenes tu primera celda. |

**Errores.**

| Situación | Texto |
| :--- | :--- |
| Credenciales incorrectas | El correo o la contraseña no coinciden. Prueba otra vez. |
| Correo ya registrado | Ese correo ya tiene un panal. ¿Quieres entrar? |
| Sin conexión | No pudimos guardar esta celda. La intentaremos de nuevo en cuanto vuelva la conexión. |
| Invitación vencida | Esta invitación ya no está activa. Pide a tu enjambre un enlace nuevo. |

**Racha rota.** "Tu racha de vuelo se detuvo. Tu mejor vuelo fue de 12 días y tu panal de constancia sigue aquí. ¿Empezamos otro?"

**Reserva usada.** "Ayer no hubo celdas, así que usamos una reserva de miel. Tu racha de 12 días sigue en vuelo. Te queda 1 reserva."

**Celebraciones.**

| Intensidad | Momento | Texto |
| :--- | :--- | :--- |
| Pequeña | Celda llena | +10 gotas de miel |
| Mediana | Panal cerrado | ¡Panal cerrado! +20 gotas de miel por cerrar el día. |
| Mediana | Flor rara | Zum encontró una flor rara: miel de azahar. Ya está en tu alacena. |
| Grande | Nuevo oficio | ¡Nuevo oficio: Recolectora! Ya juntaste 700 gotas de miel. |
| Grande | Cuadro cerrado | ¡La colmena cerró su cuarto cuadro! +30 gotas para quienes aportaron. |
| Grande | Enjambrazón | ¡Enjambrazón! Proyecto final llegó al 100 %. La colmena queda sellada en el colmenar y nace una nueva. |

## 8. Redux en este mundo

El mundo aporta dos cosas al store: su diccionario de textos y los selectores que convierten el estado en celdas. Ninguno guarda datos nuevos; todo es derivado.

```js
// Lo que devuelve selectTextos cuando ajustes.mundo === 'panal'
export const textosPanal = {
  marca: 'Panal',
  mascota: 'Zum',
  saludo: (nombre) => `¡Buen vuelo, ${nombre}!`,
  actividad: { uno: 'celda', varios: 'celdas' },
  recurrente: 'celda de ronda',
  puntos: { uno: 'gota de miel', varios: 'gotas de miel' },
  niveles: ['Novata', 'Nodriza', 'Cerera', 'Exploradora', 'Recolectora',
            'Almacenera', 'Guardiana', 'Danzante', 'Arquitecta', 'Maestra del panal'],
  racha: 'racha de vuelo',
  protector: { uno: 'reserva de miel', varios: 'reservas de miel' },
  descanso: 'día sin flores',
  diaRedondo: 'panal cerrado',
  proyecto: { uno: 'colmena', varios: 'colmenas' },
  miembros: 'enjambre',
  hito: { uno: 'cuadro', varios: 'cuadros' },
  cierre: 'enjambrazón',
  constancia: 'panal de constancia',
  reportes: 'Reportes',
  insignias: 'sellos de cera',
  coleccion: 'mieles',
  sorpresa: 'flor rara',
  constante: 'abeja constante',
  animo: 'zumbido',
  ayuda: 'llamar al enjambre',
};
```

```js
// Geometría pura: dónde va cada celda de un panal de 3, 5 o 7.
const FORMAS = { 3: [1, 2], 5: [2, 3], 7: [2, 3, 2] };

export const posicionesDelPanal = (total, radio = 38, separacion = 10) => {
  const ancho = Math.sqrt(3) * radio + separacion;
  const filas = FORMAS[total];
  const maximo = Math.max(...filas);
  return filas.flatMap((celdas, fila) =>
    Array.from({ length: celdas }, (_, columna) => ({
      x: (columna + (maximo - celdas) / 2) * ancho,
      y: fila * (1.5 * radio + separacion),
    }))
  );
};

// El panal de hoy: una celda por cada actividad de la meta.
export const selectPanalDeHoy = createSelector([selectProgresoHoy], (hoy) =>
  posicionesDelPanal(hoy.objetivo).map((posicion, i) => ({
    ...posicion,
    llena: i < hoy.completadas,
    sellada: hoy.completadas >= hoy.objetivo,
  }))
);

// La colmena: celdas llenas en orden de llegada, pintadas por quien las completó.
export const selectColmena = createSelector(
  [selectActividadesDelProyecto, selectOcurrencias],
  (actividades, ocurrencias) => {
    const llenas = actividades
      .filter((a) => ocurrencias[a.id])
      .toSorted((a, b) => ocurrencias[a.id].completadaEn.localeCompare(ocurrencias[b.id].completadaEn))
      .map((a) => ({ llena: true, miembro: ocurrencias[a.id].completadaPor }));
    const total = actividades.length;
    const celdas = [...llenas, ...Array.from({ length: total - llenas.length }, () => ({ llena: false }))];
    const porCuadro = Math.ceil(total / 5);
    const cuadroActual = Math.floor((llenas.length * 5) / Math.max(total, 1));
    const metaSiguiente = Math.ceil((Math.min(cuadroActual + 1, 5) * total) / 5);
    return {
      cuadros: Array.from({ length: 5 }, (_, i) => celdas.slice(i * porCuadro, (i + 1) * porCuadro)),
      cuadroActual,
      faltanParaCuadro: metaSiguiente - llenas.length,
    };
  }
);
```

Con los datos de ejemplo (18 de 30), `selectColmena` devuelve `cuadroActual: 3` y `faltanParaCuadro: 6`.

```js
// La danza de Zum: una sugerencia con su motivo. Reglas en orden; gana la primera que aplica.
const REGLAS = [
  { aplica: (a, c) => a.tipo === 'unica' && a.venceEn === c.hoy, motivo: () => 'Vence hoy.' },
  { aplica: (a) => a.proyectoId !== null,
    motivo: (a, c) => `Es de tu colmena. Faltan ${c.faltanParaCuadro[a.proyectoId]} celdas para el siguiente cuadro.` },
  { aplica: (a) => a.cuotaEnRiesgo, motivo: () => 'Tu ronda de esta semana todavía se puede cumplir.' },
  { aplica: () => true, motivo: () => 'Es una buena celda para arrancar.' },
];

export const selectDanzaDeZum = createSelector(
  [selectPendientesHoy, selectContextoDeDanza, selectSugerenciasDescartadas, selectAjustes],
  (pendientes, contexto, descartadas, ajustes) => {
    if (!ajustes.sugerenciasDeZum || descartadas.length >= 2) return null;
    const candidatas = pendientes.filter((a) => !descartadas.includes(a.id));
    const regla = REGLAS.find((r) => candidatas.some((a) => r.aplica(a, contexto)));
    const elegida = regla && candidatas.find((a) => regla.aplica(a, contexto));
    return elegida ? { actividadId: elegida.id, motivo: regla.motivo(elegida, contexto) } : null;
  }
);
```

Acciones propias del mundo (todas con su trazabilidad en `meta`): `danza/sugerenciaAceptada`, `danza/sugerenciaDescartada` y `ajustes/sugerenciasCambiadas`. El resto son las acciones comunes de `propuesta-base.md`.

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
| :--- | :--- |
| Se percibe infantil | Zum aparece una sola vez por pantalla; reportes sobrios; textos de tono adulto |
| Refuerza la idea de producir sin parar | El descanso es parte de la metáfora (reserva, día sin flores); lista de frases prohibidas en la guía de voz |
| El color por miembro expone a quien aporta menos | Leyenda en orden alfabético, sin resaltar mínimos; se muestran también los días con aporte |
| El amarillo cansa, pierde contraste o es el único medio para leer la colmena | El texto siempre va en tinta y la miel se reserva para fondos y rellenos; cada celda llena lleva la inicial, con leyenda y tabla equivalente |
| La danza se siente como una orden | Muestra su motivo, se puede pedir otra sugerencia, se puede apagar y no da puntos |
| A algunas personas les incomodan los insectos | Zum es redonda y amable; el aguijón es mínimo y nunca se usa como gesto |
| Poca originalidad del tema | Se compensa con la calidad del sistema: una forma, tres gráficas, y el aporte visible por celda |

## 10. Cambios respecto al tablero del lienzo

El tablero "A · Panal" fue la primera exploración. Al pasar a documento se ajustó lo siguiente:

| En el tablero | En esta propuesta | Motivo |
| :--- | :--- | :--- |
| "2 escudos" con icono de escudo | "2 reservas de miel" con icono de tarro | El protector toma el nombre del mundo |
| "Racha de 12 días" | "Racha de vuelo: 12 días" | Nombre del diccionario de pieles |
| Puntos sin unidad ("+10") | "+10" en la fila y "45 gotas de miel hoy" al pie de la tarjeta | Los puntos tienen nombre |
| Celdas de la colmena solo con color | Color más la inicial de la persona | El color no puede ser el único medio |
| "18 de 30 celdas llenas entre 4 abejas" | "Cuadro 3 de 5 · 18 de 30 celdas llenas" | Se hacen visibles los cinco hitos |
| Leyenda ordenada por cantidad | Leyenda en orden alfabético | No convertir el aporte en clasificación |
| Zum solo saluda ("Dos más y Zum cierra el panal de hoy") | Zum saluda, se incluye ("Dos más y cerramos el panal de hoy") y con su danza señala la siguiente celda | Mecánica insignia del mundo |
| Mapa con cuatro tonos por cantidad | Cuatro tonos por proporción de la meta, más día sin flores y reserva usada | Coherencia con día activo y día redondo |
