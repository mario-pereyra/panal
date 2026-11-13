# Propuesta de aplicación: Elay con Toco

Dirección D de las cinco propuestas. Es la versión cruceña y de naturaleza de la plataforma: un tucán llamado Toco, posado en un tajibo, convierte cada actividad cumplida en un tramo pintado de su pico. Este documento describe la aplicación dentro de este mundo; las reglas comunes están en `../00-base-comun/propuesta-base.md` y `../00-base-comun/motor-de-gamificacion.md`.

## Tabla de contenidos

1. [Resumen](#1-resumen)
2. [El mundo y su metáfora](#2-el-mundo-y-su-metáfora)
3. [Propuesta de valor y diferenciadores](#3-propuesta-de-valor-y-diferenciadores)
4. [Un día y una semana de Ana](#4-un-día-y-una-semana-de-ana)
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
| **Nombre** | Elay ("hela ahí": lo que se dice al mostrar algo) |
| **Lema** | Lo que cumplís, florece. |
| **Mascota** | Toco, un tucán con sombrero de saó que vive en una rama de tajibo |
| **Promesa** | Ver el día en el pico de Toco, el equipo en un mapa de anillos y la constancia en un tajibo en flor |
| **Para quién** | Estudiantes y equipos pequeños; primero quienes viven en Santa Cruz, sin excluir a nadie |
| **Énfasis de juego** | Coleccionar y cuidar lo propio (CD4) y la curiosidad por lo que viene (CD7) |
| **Perfiles** | Explorador y socializador |

**Por qué este mundo y no otro.** Abejas, estrellas y montañas podrían ser de cualquier ciudad. Un tucán con sombrero de saó, un tajibo, una comparsa que cruza anillos y puntos que se llaman cuñapés solo pueden ser de Santa Cruz. Esa pertenencia es una razón para volver que ninguna mecánica genérica da. Y la naturaleza del oriente ofrece algo que las otras direcciones no tienen: un monte entero por descubrir, pieza por pieza.

## 2. El mundo y su metáfora

Regla de diseño: en la portada no hay nada decorativo. Cada parte del dibujo de Toco es un dato.

| Elemento del mundo | Dato que muestra | Mecánica del motor |
| :--- | :--- | :--- |
| Tramos del pico de Toco | Actividades cumplidas sobre el objetivo de hoy | Meta diaria (5.6) |
| Pico pintado entero | Día redondo | Bono de +20 (5.4) |
| Rama donde se posa Toco | Nivel personal, de la rama 1 a la 10 | Niveles (5.3) |
| Cuatro botones de la rama | Avance hacia la rama siguiente; se abre una flor cada 25 % | `selectNivel` |
| Postura y gesto de Toco | Estado de la mascota | Seis estados (5.10) |
| Cuñapés | Puntos | Puntos (5.1) |
| Jenecherú, el tizón que guarda el fuego | Racha | Racha (5.4) |
| Hamaca | Protector de racha | Protector (5.5) |
| Siesta | Día de descanso semanal | Descanso (5.5) |
| Viaje con tapeque | Pausa de hasta 14 días | Pausa (5.5) |
| Comparsa | Proyecto en equipo | Proyectos (5.7) |
| Mapa de anillos | Avance del proyecto en cinco hitos | Hitos (5.7) |
| Punto naranja en el mapa | Dónde va la comparsa | `selectAvanceProyecto` |
| Florada del tajibo | Constancia día por día | `selectConstancia` |
| Álbum del monte | Insignias | Insignias (5.8) |
| Visita en la rama | Sorpresa y colección | Colección (5.9) |
| Invitar un somó | Ánimo a otra persona | Ánimos (5.7) |
| Buri | Proyecto cerrado | Cierre (5.7) |

## 3. Propuesta de valor y diferenciadores

**Frente a una lista de tareas común.**

| Lista común | Elay con Toco |
| :--- | :--- |
| Una casilla marcada desaparece | Una casilla marcada pinta un tramo que se queda a la vista todo el día |
| "3 de 5" es un número | "3 de 5" es un pico con dos tramos en crema que piden color |
| El equipo es una lista de nombres | El equipo es un punto que avanza por un mapa que toda la ciudad reconoce |
| El historial es una tabla | El historial es un árbol que florece más donde hubo constancia |
| Nada cambia si se cumple todo | Si el día queda redondo, puede llegar una visita al álbum |

**Frente a las otras cuatro direcciones.**

| Dirección | Qué hace mejor que Elay con Toco | Qué hace mejor Elay con Toco |
| :--- | :--- | :--- |
| A · Panal | Lectura inmediata sin vocabulario nuevo | Identidad local; colección con sentido propio |
| B · Órbita | Ritmo de las recurrentes por semana | Calidez; el día se entiende en un solo dibujo |
| C · Cumbre | Sensación de logro acumulado | Menos presión; descanso integrado al mundo |
| E · Elay con Nando y Mechi | Personajes humanos y habla camba más presente | Mascota única más fácil de dibujar, animar y reconocer en tamaño pequeño; la naturaleza envejece mejor que la moda |

**Fortalezas.**

- El pico es la gráfica de progreso más compacta de las cinco: cabe en un icono de 48 px y se sigue leyendo.
- El Álbum del monte da al perfil explorador un motivo para volver que no depende de puntos.
- El descanso (hamaca y siesta) pertenece al mundo de forma natural, sin parecer un parche.

**Riesgos dichos con franqueza.**

- Hay más palabras nuevas que en A, B o C. Si no se dosifican, estorban.
- Fuera de Santa Cruz parte del encanto se pierde, aunque el diseño funcione.
- El conocimiento cultural de esta propuesta viene de estudio, no de vivencia. Todo lo cruceño debe pasar por alguien que sí lo vive (ver glosario, sección 7).

## 4. Un día y una semana de Ana

**Viernes 13 de noviembre.** Ana abre Elay a las 7:40. Toco está en su rama con el pico en crema, dividido en cinco tramos porque su meta diaria es 5. "¡Elay, Ana! El pico amaneció sin color. ¿Por cuál empezamos?" Repasa sus apuntes de Redux antes de clase y marca la actividad: el primer tramo se pinta de amarillo y suben 10 cuñapés. Al mediodía camina 30 minutos (segundo tramo, ámbar, +10) y por la tarde entrega el informe de avance que vencía hoy (tercer tramo, naranja, +25). Lleva 45 cuñapés y Toco pasa a estar feliz: "Ya van 3 de 5. Dos más y queda entero."

A la noche diseña la pantalla de reportes del Proyecto final (+25; la comparsa pasa de 18 a 19 actividades de 30) y practica inglés (+10). El pico queda pintado hasta la punta, de amarillo a rosado tajibo: día redondo, +20. Ana cierra el día con 100 cuñapés y 695 en total: le faltan 5 para la rama 5. Su jenecherú sigue en 12 días. Y como a veces pasa en los días redondos, hay visita: un picaflor se posa junto a Toco y queda guardado en el álbum.

**La semana.** El lunes la comparsa ve los reconocimientos: Sofía es tiluchi de la semana por aportar cuatro días distintos. El miércoles Diego se traba con "Redactar conclusiones" y pide una mano; Ana la toma, la termina y le invita un somó. El jueves la comparsa llega a 24 de 30 y cruza el 4to anillo: el mapa se pinta, aparecen los banderines y cada comparsero que aportó en ese tramo recibe 30 cuñapés. El domingo es la siesta de Ana, su día de descanso: Toco aparece en la hamaca con el sombrero sobre los ojos y el jenecherú no se toca.

## 5. Las doce pantallas en este mundo

| ID | Nombre en Elay | Qué muestra | Elemento distintivo |
| :--- | :--- | :--- | :--- |
| P01 | Entrar | Formulario de inicio de sesión | Toco con el pico en crema y el lema |
| P02 | Crear cuenta | Formulario corto y tres promesas | "Empezamos con el pico en blanco" |
| P03 | Primeros pasos | Meta diaria, primera actividad, primer tramo | El pico se divide en 3, 5 o 7 tramos según la meta elegida |
| P04 | Hoy | Saludo, pico, fichas, actividades, comparsa y florada | Toco como gráfica del día y del nivel |
| P05 | Actividades | Todas las actividades con pestañas y filtros | Consejo de Toco sobre cuánto vale cada tipo |
| P06 | Nueva actividad | Formulario de única o recurrente | Vista previa: "Pinta un tramo y vale 10 cuñapés cada vez" |
| P07 | Comparsas | Tarjetas de proyectos | Mapa de anillos en miniatura por comparsa |
| P08 | Comparsa | Avance, comparseros y actividades de un proyecto | Mapa de anillos grande con el río y la plaza |
| P09 | Invitar comparseros | Invitación por correo o enlace | "Sumá gente a la comparsa" |
| P10 | Reportes | Constancia, cumplimiento, tendencia y comparsas | Florada de 12 semanas y una rama por actividad |
| P11 | Mi tajibo | Nivel, álbum, visitas y ajustes | El tajibo completo con sus diez ramas |
| P12 | Celebración | Logro, recompensa y siguiente meta | Toco lanza el sombrero; la visita llega a la rama |

## 6. Los cuatro casos de uso en este mundo

**CU-01. Registro e inicio de sesión.** Al registrarse, Toco se presenta y pide una sola decisión: cuántas actividades por día. Lo que la persona elige se ve al instante, porque el pico se divide en 3, 5 o 7 tramos. Crea su primera actividad, la marca y pinta el primer tramo: gana la lámina "El curucusí" y recibe una hamaca de regalo. En menos de dos minutos ya tiene algo suyo.

**CU-02. Actividades únicas y recurrentes.** Las recurrentes valen 10 cuñapés y las únicas 25. Cada una pinta un tramo, sin importar el tipo: el pico premia cerrar el día, los cuñapés premian el esfuerzo. Cada recurrente tiene además su propia rama en los reportes, con una flor por cada vez programada.

**CU-03. Proyectos y vinculación de usuarios.** Un proyecto es una comparsa. Se invita por correo o por enlace y quien acepta se vuelve comparsero. El avance se ve en el mapa de anillos: la comparsa sale de la plaza y cruza un anillo cada 20 %. Al cerrar el 5to se arma el buri. Nadie pierde cuñapés por el retraso de otra persona.

**CU-04. Reporte con gráficas.** Cuatro gráficas del mundo: la florada del tajibo (constancia), una rama por actividad (cumplimiento de cada acción), los cuñapés por semana (tendencia) y el mapa de anillos con el aporte de cada comparsero (proyecto). Todas llevan su cifra escrita y texto alternativo.

## 7. Voz y textos clave

**Principios.** Voseo camba ("tenés", "completá", "te faltan") sin imitar el acento por escrito. Frases cortas. Alegre, nunca burlona. Toco anima y acompaña; no reprocha ni apura. Como máximo siete palabras propias en una misma pantalla, cada una con su explicación al lado.

**Saludo según el estado de Toco.**

| Estado | Texto |
| :--- | :--- |
| Esperando | "¡Elay, Ana! El pico amaneció sin color. ¿Por cuál empezamos?" |
| Animando | "¡Primer tramo pintado! Dale nomás, que ya arrancaste." |
| Feliz | "Ya van 3 de 5. Dos más y queda entero." |
| Celebrando | "¡Pico pintado! Hoy quedó de punta a punta." |
| Preocupada | "El jenecherú sigue encendido. Con una actividad alcanza para que amanezca." |
| Descansando | "Hoy toca siesta. El jenecherú queda bien guardado." |

**Estados vacíos.**

| Dónde | Texto |
| :--- | :--- |
| Hoy, sin actividades | "Hoy no hay nada anotado. Anotá una y le ponemos color al pico." |
| Actividades | "Todavía no anotaste nada. Empezá por algo chico." |
| Comparsas | "No estás en ninguna comparsa. Armá una o pedí que te inviten." |
| Álbum del monte | "El álbum está por estrenar. La primera lámina llega con tu primera actividad." |
| Reportes | "El tajibo todavía no floreció. Volvé después de tu primer día." |

**Errores.**

| Caso | Texto |
| :--- | :--- |
| Credenciales incorrectas | "El correo o la contraseña no coinciden. Probá de nuevo." |
| Correo ya registrado | "Ese correo ya tiene cuenta. ¿Querés entrar?" |
| Sin conexión | "No pudimos guardar. Revisá tu conexión; lo que marcaste no se pierde." |
| Invitación vencida | "Esta invitación ya venció. Pedile a la comparsa una nueva." |

**Racha rota.** "Se apagó el jenecherú, pero la brasa quedó: tu mejor racha es de 12 días. ¿Lo prendemos de nuevo?" Con hamaca usada: "Ayer colgaste la hamaca. El jenecherú siguió encendido. Te queda 1."

**Celebraciones.**

| Momento | Texto |
| :--- | :--- |
| Día redondo | "¡Pico pintado! +20 cuñapés." |
| Sube de rama | "Toco subió a la rama 5. Desde aquí se ve más monte." |
| Siete días | "Jenecherú de 7 días: +50 cuñapés y una hamaca nueva." |
| Visita | "Hoy vino visita: un picaflor se posó en la rama. Ya está en tu álbum." |
| Anillo cruzado | "La comparsa cruzó el 4to anillo. +30 cuñapés para quienes empujaron." |
| Proyecto cerrado | "¡Se armó el buri! La comparsa cerró el 5to anillo." |

### Glosario

Estado **confirmada**: aparece en una de las tres fuentes. Estado **sin confirmar**: viene de conocimiento propio y nadie de Santa Cruz la ha revisado todavía.

| Palabra | Significado | Uso en la aplicación | Estado |
| :--- | :--- | :--- | :--- |
| Elay | "Hela ahí": se dice al mostrar algo | Nombre y saludo | Confirmada (2) |
| Jenecherú | Tizón grueso que conserva el fuego hasta el día siguiente | La racha | Confirmada (1) |
| Tiluchi | Persona hábil para alguna actividad | Reconocimiento semanal a la constancia | Confirmada (1). Su sentido como nombre del ave hornero: sin confirmar |
| Curucusí | Luciérnaga | Primera lámina del álbum | Confirmada (1) |
| Buri | Fiesta | Cierre de la comparsa | Confirmada (2, 3) |
| Saó | Paja de palma con que se tejen sombreros | El sombrero de Toco | Confirmada (2, 3) |
| Tapeque | Provisión de comida para un viaje | La pausa: "armá tu tapeque" | Confirmada (1) |
| Pinchulear | Arreglarse con esmero | Personalizar a Toco | Confirmada (1) |
| Somó | Bebida de maíz | El ánimo entre comparseros | Palabra confirmada (2); la descripción, sin confirmar |
| Tutuma | Vasija hecha de un fruto seco | Icono del somó y lámina del álbum | Palabra confirmada (2); la descripción, sin confirmar |
| Pahuichi | Casa rústica | Lámina del primer proyecto | Palabra confirmada (2); la descripción, sin confirmar |
| Toborochi, motacú, achachairú | Árbol, palma y fruto del oriente | Láminas del álbum | Confirmadas (3) |
| Cuñapé | Pan de queso y almidón de yuca | Los puntos | Sin confirmar |
| Tajibo | Árbol que florece en rosado | Marca, niveles y florada | Sin confirmar |
| Comparsa | Grupo que sale junto en carnaval | El proyecto en equipo | Sin confirmar |
| Anillos | Avenidas circulares de la ciudad | Los cinco hitos del proyecto | Sin confirmar |
| Tamborita | Banda típica | Aparece al cruzar el 4to anillo | Sin confirmar |
| Peta, paraba, piyo, jochi, capiguara, bibosi, matico, sumurucucu, tigre | Nombres locales de fauna y flora | Láminas del álbum | Sin confirmar |
| "Dale nomás" | Expresión de ánimo | Saludo de Toco | Sin confirmar |

Confirmadas y disponibles sin usar: cómper, velatacú, curichi y los sufijos -ingo y -ango.

Fuentes: (1) [11 palabras cambas que deberías conocer](https://eju.tv/?p=602356) · (2) [Español camba](https://es.wikipedia.org/wiki/Español_camba) · (3) [Sobre bolivianismos en la RAE](https://www.andesacd.org/wp-content/uploads/2015/09/Sobre-Bolivianismos-en-la-RAE.pdf)

**Pedido a quien revise esto:** corregí sin miramientos cualquier palabra, nombre de animal o expresión que no suene auténtica. Es preferible quitar una palabra que usarla mal.

## 8. Redux en este mundo

El vocabulario es un objeto que devuelve `selectTextos` cuando `ajustes.mundo === 'elay-toco'`. Cambiar de mundo no toca ningún reducer.

```js
export const textosElayToco = {
  marca: 'Elay',
  mascota: 'Toco',
  saludo: (nombre) => `¡Elay, ${nombre}!`,
  puntos: { uno: 'cuñapé', varios: 'cuñapés' },
  nivel: (n) => `Rama ${n}`,
  racha: { nombre: 'Jenecherú', ayuda: 'Tu racha: el fuego que no se apaga' },
  protector: { uno: 'hamaca', varios: 'hamacas', ayuda: 'Días de descanso que cuidan tu racha' },
  descanso: 'Siesta',
  diaRedondo: 'Pico pintado',
  proyecto: { uno: 'comparsa', varios: 'comparsas' },
  miembros: 'comparseros',
  hito: (n) => `${['1er', '2do', '3er', '4to', '5to'][n - 1]} anillo`,
  cierre: 'Buri',
  constancia: 'Florada del tajibo',
  insignias: 'Álbum del monte',
  sorpresa: 'Visita',
  animo: 'Invitar un somó',
  ayuda: 'Pedir una mano',
};
```

La gráfica propia de este mundo, el pico, es un selector puro. El pico tiene tantos tramos como el objetivo de hoy y sus colores salen de una rampa fija de siete tonos planos.

```js
const RAMPA = ['#FFC533', '#FFB72E', '#FFA928', '#F58A1F', '#F0795C', '#EC6A9A', '#C2255C'];
const colorDeTramo = (i, n) => RAMPA[n === 1 ? 6 : Math.round((i * 6) / (n - 1))];

export const selectPicoDeToco = createSelector([selectProgresoHoy], (hoy) => {
  if (hoy.objetivo === 0) return { tramos: [], entero: false, texto: 'Sin actividades para hoy' };
  const n = Math.min(hoy.objetivo, 7);
  const pintados = Math.min(hoy.completadas, n);
  return {
    tramos: Array.from({ length: n }, (_, i) => ({ pintado: i < pintados, color: colorDeTramo(i, n) })),
    entero: pintados === n,
    texto: `${pintados} de ${n} tramos pintados`,
  };
});

// La rama es el nivel; sus cuatro botones se abren con el avance hacia la rama siguiente.
const UMBRALES = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200];
export const selectRamaDeToco = createSelector([selectPuntos], (puntos) => {
  const { nivel, faltan } = nivelDe(puntos);
  const base = UMBRALES[nivel - 1];
  const avance = nivel < 10 ? (puntos - base) / (UMBRALES[nivel] - base) : 1;
  return { rama: nivel, floresAbiertas: Math.floor(avance * 4), faltan };
});
```

Con los datos de ejemplo: `selectPicoDeToco` devuelve cinco tramos con tres pintados (amarillo, ámbar y naranja) y `selectRamaDeToco` devuelve `{ rama: 4, floresAbiertas: 3, faltan: 60 }`. Toco entero se dibuja con tres selectores: pico, rama y `selectEstadoMascota`.

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
| :--- | :--- |
| Demasiadas palabras nuevas | Tope de siete por pantalla; explicación al lado la primera vez; ajuste "Palabras comunes" que cambia el objeto de textos sin tocar el diseño |
| Palabras o nombres mal usados | Glosario con estado; revisión por personas de Santa Cruz antes de publicar |
| Estereotipo del descanso como flojera | La hamaca se gana con constancia y la siesta se elige; los textos hablan de descanso ganado, nunca de pereza |
| Toco dibujado distinto en cada pantalla por Stitch | Espacio reservado en los prompts y componente SVG propio al implementar |
| Pico de siete tramos demasiado estrecho en tamaños pequeños | Por debajo de 96 px de ancho el pico muestra solo pintado y sin pintar, sin divisiones |
| La sorpresa se percibe como azar que engancha | Solo cosmética, sin pago, con garantía a la octava y sin piezas por tiempo limitado |
| Público de fuera de Santa Cruz | La mecánica se entiende sin el vocabulario; el modo "Palabras comunes" lo cubre |

## 10. Cambios respecto al tablero del lienzo

| En el tablero D | En esta propuesta | Por qué |
| :--- | :--- | :--- |
| "Nivel 4 · 4to anillo" en la barra y en la ficha | "Nivel 4 · Rama 4" y "Rama 4 · Te faltan 60 cuñapés para la rama 5" | "Anillo" nombraba dos cosas. Queda solo para los cinco hitos de la comparsa; el nivel son las ramas del tajibo |
| Tres flores decorativas en la rama | Cuatro botones que se abren con el avance hacia la rama siguiente (hoy, tres abiertos) | Nada en la portada es adorno |
| Tramos 4 y 5 del pico sin color definido | Rampa completa: amarillo, ámbar, naranja, rosado y rosado tajibo | El pico pintado entero necesita su estado final |
| Pico siempre de cinco tramos | Tantos tramos como el objetivo del día | Con meta de 3 o 7, cada actividad sigue pintando exactamente un tramo |
| Florada con cuatro tamaños | Igual, y el día redondo suma un centro amarillo | El dato no depende solo del tono |
| Sin pantalla de perfil | "Mi tajibo" con las diez ramas, el álbum y las visitas | Completa el mundo |

El resto del tablero (portada verde, tres fichas, tres tarjetas, mapa de anillos y datos de ejemplo) se mantiene igual.
