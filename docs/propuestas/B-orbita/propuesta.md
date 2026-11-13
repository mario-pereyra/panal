# Propuesta de aplicación: Órbita

Este documento describe la plataforma gamificada del proyecto final vestida con el mundo **B · Órbita**: qué promete, cómo se ve cada pantalla, cómo habla y qué cambia en el código. Las reglas del juego (puntos, niveles, rachas) no se repiten aquí: están en `../00-base-comun/motor-de-gamificacion.md` y son las mismas para los cinco mundos. La arquitectura común está en `../00-base-comun/propuesta-base.md`.

## Tabla de contenidos

1. [Resumen](#1-resumen)
2. [El mundo y su metáfora](#2-el-mundo-y-su-metáfora)
3. [Propuesta de valor y diferenciadores](#3-propuesta-de-valor-y-diferenciadores)
4. [Un día y una semana de Ana en Órbita](#4-un-día-y-una-semana-de-ana-en-órbita)
5. [Las doce pantallas en este mundo](#5-las-doce-pantallas-en-este-mundo)
6. [Los cuatro casos de uso en este mundo](#6-los-cuatro-casos-de-uso-en-este-mundo)
7. [Voz y textos clave](#7-voz-y-textos-clave)
8. [Redux en este mundo](#8-redux-en-este-mundo)
9. [Riesgos y mitigaciones](#9-riesgos-y-mitigaciones)
10. [Cambios respecto al tablero del lienzo](#10-cambios-respecto-al-tablero-del-lienzo)

---

## 1. Resumen

| | |
| :--- | :--- |
| **Nombre** | Órbita |
| **Lema** | Encuentra tu ritmo. Enciende tu cielo. |
| **Mascota** | Nova, una estrella. Su brillo es el progreso del día |
| **Promesa** | Ver lo que repites como órbitas que mantienes en marcha y lo que haces en equipo como una constelación que se enciende estrella por estrella |
| **Para quién** | Personas que combinan hábitos con entregas, estudian o trabajan de noche y prefieren una herramienta tranquila antes que una ruidosa |
| **Mecánica propia** | El ritmo de órbita: cada actividad recurrente tiene su anillo, su planeta y su propio compás |
| **Impulsos que acentúa** | CD3 (elección y respuesta) y CD7 (curiosidad). Perfil explorador |

**Por qué este mundo y no otro.** El enunciado pide actividades únicas y recurrentes. En casi todas las aplicaciones la recurrencia es invisible: una casilla que reaparece cada mañana. Una órbita es la imagen más directa de "esto se repite": un círculo que se recorre una y otra vez. Órbita es el único de los cinco mundos que **dibuja la repetición misma**, y por eso es el que mejor responde a la pregunta "¿qué hábitos estoy sosteniendo y cuáles no?".

## 2. El mundo y su metáfora

Cada elemento del mundo muestra un dato real del store. Ninguno es adorno.

| Elemento del mundo | Dato que muestra | Mecánica del motor |
| :--- | :--- | :--- |
| Brillo de Nova (tamaño del halo) | Completadas sobre el objetivo de hoy | Meta diaria y estados de la mascota (5.6, 5.10) |
| Misión | Una actividad | Actividad |
| Misión única | Una actividad con fecha | 25 destellos |
| Órbita (pista y arco) | Una actividad recurrente y sus vueltas de la semana, hechas sobre planeadas | Recurrencia; 10 destellos por vuelta |
| Planeta, lunas y anillo | Semanas en que esa órbita cumplió su ritmo | Mecánica propia del mundo (sin puntos) |
| Destellos | Puntos | 5.1 |
| Rango (Cadete a Leyenda estelar) | Nivel | 5.3 |
| Racha en órbita | Días activos consecutivos | 5.4 |
| Escudo | Protector de racha | 5.5 |
| Día en crucero | Día de descanso | 5.5 |
| Cielo encendido | Día redondo | 5.4, bono de +20 |
| Constelación (diez estrellas) | Avance de un proyecto, en décimas | 5.7 |
| Estrellas guía (cinco, más grandes) | Hitos del 20, 40, 60, 80 y 100 % | 5.7 |
| Tripulación | Miembros y su aporte | 5.7 |
| Señal | Ánimo entre miembros | 5.7 |
| Pedir relevo | Pedido de ayuda | 5.7 |
| Bitácora | Reportes | CU-04 |
| Cielo del mes | Mapa de constancia | 5.4 |
| Parches de misión | Insignias | 5.8 |
| Cometas | Colección y sorpresa | 5.9 |

## 3. Propuesta de valor y diferenciadores

**Frente a una lista de tareas común.**

| Lista común | Órbita |
| :--- | :--- |
| La recurrente es una casilla que vuelve a aparecer | La recurrente es un anillo: se ve cuántas vueltas lleva esta semana y cuántas le faltan |
| El día termina cuando la lista queda vacía | El día tiene brillo: Nova se enciende por pasos y "cielo encendido" es una meta alcanzable que la persona eligió |
| El proyecto es una barra | El proyecto es una figura que no existía y que el equipo termina poniéndole nombre |
| Fallar un día no deja rastro o lo borra todo | Hay escudos, días en crucero y un parche que premia volver |

**Frente a las otras cuatro direcciones.**

| Dirección | En qué gana ella | En qué gana Órbita |
| :--- | :--- | :--- |
| A · Panal | Calidez, sensación de construir, equipo como colmena | Muestra el ritmo de cada hábito por separado; más sobria para sesiones largas |
| C · Cumbre | Épica y sentido de avance lineal | No castiga el estancamiento: una órbita no "se queda abajo", solo cambia de ritmo |
| D y E · Elay | Identidad cruceña: no podría ser de otro lugar | Vocabulario que se entiende sin explicación y sin riesgo de caricatura |

**Fortalezas.**

- Es la metáfora más exacta para el caso de uso de actividades recurrentes.
- El tema oscuro descansa la vista en uso nocturno y hace que el progreso literalmente brille.
- Casi no exige vocabulario nuevo: misión, órbita y constelación se entienden a la primera.
- Las gráficas del mundo (anillos, puntos y líneas) son las más fáciles de implementar en SVG.

**Riesgos dichos con franqueza.**

- **El espacio es terreno común.** Muchas aplicaciones usan estrellas y planetas. Sin la mecánica de ritmo, Órbita sería un tema oscuro más.
- **Nova tiene menos carisma que un animal o un personaje humano.** Una estrella con cara es simpática, pero difícilmente será recordada como un tucán con sombrero.
- **Es el mundo menos cálido.** Para el trabajo en equipo transmite menos compañía que Panal o Elay.
- **No tiene identidad local.** Si lo que se busca es algo propio de Santa Cruz, este no es el camino.
- **El sistema de órbitas no crece bien.** Con más de cuatro anillos se vuelve ilegible; hay que limitarlo.

## 4. Un día y una semana de Ana en Órbita

**Viernes 13 de noviembre.** Ana abre la aplicación antes de clases. Nova está en el centro con un halo pequeño: "Buen despegue, Ana. Hoy tienes 5 misiones." Marca *Repasar apuntes de Redux*: la casilla se vuelve amarilla, aparece "+10", el planeta aguamarina avanza un paso por su anillo y el halo de Nova crece. Después *Caminar 30 minutos* (+10) y, al mediodía, *Entregar informe de avance* (+25). Lleva 45 destellos y 3 de 5: "Nova brilla al 60 %. Dos misiones más y enciendes todo el cielo de hoy."

Por la tarde completa *Diseñar pantalla de reportes* (+25), que además es la misión 19 de 30 de la constelación Proyecto final. Luis recibe el aviso y le envía una señal: "Buen ritmo". Al cerrar *Practicar inglés 15 minutos* (+10) llega el **cielo encendido**: las estrellas del fondo se encienden en cadena, Nova celebra y suma el bono de +20. El día termina con 100 destellos; el total pasa de 640 a 695. Le faltan 5 para el rango Especialista, que llegará con la primera vuelta de mañana.

**La semana.** El lunes a las 03:00 se cierra la semana y cada órbita se evalúa por separado:

| Órbita | Vueltas | Mínimo para ser estable | Resultado |
| :--- | :---: | :---: | :--- |
| Repasar apuntes de Redux (diaria) | 7 de 7 | 5 | Estable: su planeta gana una luna |
| Caminar 30 minutos (diaria) | 5 de 7 | 5 | Estable: gana una luna |
| Practicar inglés (lunes, miércoles y viernes) | 2 de 3 | 3 | En curso: ni premio ni pérdida |

Si *Practicar inglés* hubiera quedado en 1 de 3, Nova propondría el lunes: "Esta órbita va lenta. ¿Probamos con 2 vueltas por semana?". No quita nada; ofrece cambiar el compás. Ese mismo lunes la tripulación de Proyecto final ve sus reconocimientos: Estrella polar para quien aportó más días, Ignición para quien encendió la tercera estrella guía.

El domingo la racha en órbita llega a 14 días: +50 destellos. Como Ana ya guarda dos escudos, que es el máximo, no recibe otro.

## 5. Las doce pantallas en este mundo

| ID | Nombre en Órbita | Qué muestra | Elemento distintivo |
| :--- | :--- | :--- | :--- |
| P01 | Entrar a Órbita | Formulario de correo y contraseña | Nova esperando en el centro de un anillo vacío: "Tu cielo te espera" |
| P02 | Crear cuenta | Nombre, correo y contraseña | Un cielo apagado con una sola estrella encendida: "Tu cielo empieza oscuro. Lo enciendes tú" |
| P03 | Preparar el despegue | Tres pasos: elegir ritmo (3, 5 o 7), crear la primera misión y cumplirla | Cuenta de tres pasos como secuencia de lanzamiento; termina con el parche "Despegue" y un escudo de regalo |
| P04 | Hoy | Saludo, órbitas de la semana, misiones de hoy, constelación y bitácora semanal | Sistema de órbitas con Nova en el centro |
| P05 | Misiones | Pestañas Hoy, Próximas, Órbitas y Archivadas | En la pestaña Órbitas cada fila lleva su anillo en miniatura y sus lunas |
| P06 | Nueva misión | Título, tipo, ritmo, prioridad y constelación | Selector "Misión única" u "Órbita"; al elegir órbita, vista previa del anillo con sus vueltas por semana |
| P07 | Constelaciones | Tarjetas de proyectos | Cada tarjeta muestra la figura en miniatura con sus estrellas encendidas |
| P08 | Detalle de constelación | Figura grande, estrellas guía, tripulación y misiones | Cada estrella encendida guarda la inicial de quien la encendió; señales y pedidos de relevo |
| P09 | Sumar a la tripulación | Invitar por correo o enlace | Asientos de la tripulación: ocupados, pendientes y libres |
| P10 | Bitácora | Cielo del mes, ritmo por órbita, barras semanales y únicas frente a órbitas | Cielo del mes: un punto por día cuya forma indica cómo fue |
| P11 | Perfil | Rango, parches, cometas y ajustes | Catálogo de cometas con los no descubiertos en contorno punteado |
| P12 | Celebración | Recompensa y siguiente meta | Nova con rayos; ejemplo: "Tercera estrella guía encendida" |

## 6. Los cuatro casos de uso en este mundo

**CU-01. Registro e inicio de sesión.** El registro pide tres datos y lleva directo a "Preparar el despegue". En el paso 1 la persona elige su ritmo: órbita tranquila (3 misiones al día), constante (5) o intensa (7). En el paso 2 crea su primera misión con un solo campo obligatorio. En el paso 3 la cumple ahí mismo: Nova se enciende por primera vez, se entrega el parche "Despegue" y un escudo de regalo. La cuenta nueva nunca ve un cielo vacío.

**CU-02. Actividades únicas y recurrentes.** Al crear, el primer control pregunta "¿Se hace una vez o se repite?". Si se repite, es una órbita y se elige su ritmo: todos los días, ciertos días, N veces por semana o un día del mes. La vista previa dibuja el anillo con sus marcas. En Hoy, completar una órbita mueve su planeta; completar una misión única solo enciende a Nova. Desmarcar deshace ambas cosas.

**CU-03. Proyectos y vinculación de usuarios.** Un proyecto es una constelación. Al crearla se ofrecen tres figuras generadas a partir del identificador del proyecto y quien la crea elige una. Se suma tripulación por correo o enlace. Cada 10 % de avance enciende una estrella; cada 20 %, una estrella guía, que se celebra en grupo. Al llegar al 100 % la tripulación vota el nombre de la constelación, que queda para siempre en el perfil de cada integrante.

**CU-04. Reporte con gráficas.** La Bitácora responde cuatro preguntas con cuatro gráficas: ¿qué tan constante fui? (cielo del mes), ¿qué hábitos sostengo? (ritmo por órbita), ¿cómo fue mi semana? (barras por día) y ¿en qué se me va el esfuerzo? (únicas frente a órbitas). Por proyecto: la constelación y el aporte de cada integrante.

## 7. Voz y textos clave

Nova habla en segunda persona, con frases cortas y tranquilas. Informa primero y anima después. Usa punto final; como mucho una exclamación por mensaje. Nunca reprocha.

**Saludo según el estado de Nova.**

| Estado | Texto |
| :--- | :--- |
| Esperando | "Buen despegue, Ana. Hoy tienes 5 misiones." |
| Animando | "Primera misión cumplida. Ya estamos en el aire." |
| Feliz | "Nova brilla al 60 %. Dos misiones más y enciendes todo el cielo de hoy." |
| Celebrando | "¡Cielo encendido! Hoy brilló todo." |
| Preocupada | "Todavía queda noche. Con una misión seguimos en órbita." |
| Descansando | "Día en crucero. Hoy no se espera nada de ti." |

**Estados vacíos.**

| Pantalla | Texto |
| :--- | :--- |
| Hoy sin misiones | "Cielo despejado. No hay misiones para hoy. ¿Creamos una?" |
| Sin órbitas | "Todavía no hay nada girando. Una órbita es algo que quieres repetir." |
| Sin constelaciones | "Una constelación se dibuja entre varios. Crea una y suma a tu tripulación." |
| Bitácora sin datos | "La bitácora se escribe sola. Vuelve después de tu primera misión." |
| Sin cometas | "Los cometas pasan en los días de cielo encendido. Aún no ha pasado ninguno." |

**Errores.**

| Caso | Texto |
| :--- | :--- |
| Credenciales incorrectas | "El correo o la contraseña no coinciden. Revisa e intenta de nuevo." |
| Correo ya registrado | "Ese correo ya tiene un cielo. ¿Quieres entrar?" |
| Campo obligatorio vacío | "A esta misión le falta un nombre." |
| Sin conexión | "Perdimos la señal. Tus cambios se guardarán cuando vuelva." |

**Racha rota.** "Tu racha en órbita se interrumpió en 12 días. Es tu mejor marca y queda guardada. Hoy empieza una nueva." Botón: "Volver a despegar".

**Escudo usado.** "Ayer un escudo cuidó tu racha. Te queda 1."

**Celebraciones.**

| Momento | Texto |
| :--- | :--- |
| Completar una misión | "+10 destellos" |
| Órbita estable | "Repasar apuntes de Redux mantuvo su ritmo. Su planeta gana una luna." |
| Subir de rango | "Nuevo rango: Especialista. Llevas 700 destellos." |
| Estrella guía | "Tercera estrella guía encendida. Proyecto final llegó al 60 %." |
| Constelación completa | "La constelación está completa. Es hora de ponerle nombre." |
| Cometa | "Pasó un cometa: Centella. Ya está en tu catálogo." |

## 8. Redux en este mundo

El mundo aporta dos cosas al código: un diccionario de textos y los selectores de sus gráficas. El motor y los reducers no cambian.

```js
// textos/orbita.js: lo que devuelve selectTextos cuando ajustes.mundo === 'orbita'
export const textosOrbita = {
  marca: 'Órbita',
  mascota: 'Nova',
  actividad: { singular: 'misión', plural: 'misiones' },
  unica: 'misión única',
  recurrente: { singular: 'órbita', plural: 'órbitas', repeticion: 'vuelta' },
  puntos: 'destellos',
  niveles: ['Cadete', 'Tripulante', 'Piloto', 'Navegante', 'Especialista',
            'Comandante', 'Cosmonauta', 'Guía estelar', 'Vigía del cielo', 'Leyenda estelar'],
  racha: 'racha en órbita',
  protector: { singular: 'escudo', plural: 'escudos' },
  descanso: 'día en crucero',
  diaRedondo: 'cielo encendido',
  proyecto: { singular: 'constelación', plural: 'constelaciones' },
  miembros: 'tripulación',
  hito: 'estrella guía',
  reportes: 'bitácora',
  insignia: 'parche de misión',
  sorpresa: 'cometa',
  animo: 'señal',
  ayuda: 'pedir relevo',
  saludo: {
    esperando: (n, total) => `Buen despegue, ${n}. Hoy tienes ${total} misiones.`,
    feliz: (pct, faltan) => `Nova brilla al ${pct} %. ${faltan} misiones más y enciendes todo el cielo de hoy.`,
    descansando: () => 'Día en crucero. Hoy no se espera nada de ti.',
  },
};
```

```js
// selectores/orbita.js: la gráfica propia del mundo, derivada del store
const minimoEstable = (planeadas) => Math.ceil(planeadas * 0.7);

export const selectOrbitas = createSelector(
  [selectRecurrentesActivas, selectOcurrenciasDeLaSemana, selectSemanaActual],
  (recurrentes, ocurrencias, semana) =>
    recurrentes.map((actividad, indice) => {
      const planeadas = vueltasPlaneadas(actividad.regla, semana); // función pura
      const hechas = ocurrencias.filter((o) => o.actividadId === actividad.id).length;
      return {
        id: actividad.id,
        titulo: actividad.titulo,
        anillo: indice,                                   // 0 es el más cercano a Nova
        hechas,
        planeadas,
        fraccion: planeadas === 0 ? 0 : Math.min(hechas / planeadas, 1),
        estable: planeadas > 0 && hechas >= minimoEstable(planeadas),
      };
    })
);

// Diez estrellas por constelación; las pares son estrellas guía.
export const selectConstelacion = createSelector([selectAvanceProyecto], (avance) =>
  Array.from({ length: 10 }, (_, i) => ({
    numero: i + 1,
    encendida: avance.porcentaje >= (i + 1) * 10,
    guia: (i + 1) % 2 === 0,
  }))
);
```

Con los datos de ejemplo, `selectOrbitas` devuelve fracciones de 5/7, 4/7 y 1/3, y `selectConstelacion` devuelve seis estrellas encendidas, tres de ellas guía. El brillo de Nova sale de `selectProgresoHoy` (3 de 5, 60 %) y su expresión de `selectEstadoMascota`.

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
| :--- | :--- |
| Parecer un tema espacial genérico | La identidad está en la mecánica de ritmo y en el dibujo de carta celeste (líneas finas, colores planos), no en imágenes del espacio. Sin naves ni galaxias |
| Mascota con poca personalidad | Seis estados bien diferenciados, una voz reconocible y el brillo como dato. Nova aparece en todas las pantallas, siempre con algo que decir |
| Tema oscuro con texto poco legible | Todas las combinaciones están calculadas: el texto más tenue llega a 8,5:1 sobre las tarjetas. Tamaño mínimo de 14 px |
| Más de cuatro órbitas vuelven ilegible el sistema | Hoy muestra como máximo cuatro, las que elija la persona; el resto vive en Misiones, pestaña Órbitas |
| Distinguir órbitas solo por color | Cada órbita tiene posición fija (de dentro hacia fuera), nombre y cifra en la leyenda, y su planeta lleva lunas distintas |
| "En deriva" leído como fracaso | La palabra no aparece en la interfaz. El mensaje es una propuesta de cambio de ritmo y no quita nada |
| Frialdad en el trabajo en equipo | Señales entre integrantes, iniciales en cada estrella y el nombre de la constelación elegido por votación |
| Invitar al uso nocturno excesivo | No hay parches por trasnochar. El día cambia a las 03:00 solo para no castigar; la mascota "preocupada" aparece desde las 18:00, no a medianoche |

## 10. Cambios respecto al tablero del lienzo

| En el tablero | En esta propuesta | Motivo |
| :--- | :--- | :--- |
| "Repasar apuntes de Redux: 6 de 7 vueltas" un viernes | "5 de 7 vueltas" | Con semana de lunes a domingo, el viernes hay como máximo cinco vueltas posibles |
| Puntos sin nombre ("+10") | "+10 destellos" la primera vez; después solo "+10" | El diccionario de pieles fija "destellos" |
| "Racha de 12 días" | "12 días en órbita" con la etiqueta "Racha" | Nombre del mundo junto a la palabra común |
| Metadatos de 13 px | 14 px | Mejor lectura sobre fondo oscuro |
| Título de misión hecha igual que el de una pendiente | Un tono más suave (#D5DAF5) | Lo pendiente destaca a primera vista |
| Planetas con luna y anillo sin regla | Lunas y anillo como mecánica: una luna por semana estable, anillo a la cuarta | Convertir un detalle decorativo en dato |
| Tres colores de órbita | Se añade lila (#B9A8FF) para una cuarta | Límite de cuatro órbitas visibles |
| Sin color de error | Rosa señal (#FF7A90) | Formularios de registro y de actividad |
| Solo bitácora semanal | Se añade el cielo del mes en la pantalla Bitácora | El motor pide un mapa de constancia |
