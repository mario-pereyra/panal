# Propuesta de aplicación: Elay con Nando y Mechi

Esta es la propuesta completa de la dirección E: la plataforma gamificada contada desde Santa Cruz de la Sierra, con dos personajes que acompañan a la persona, hablan en camba y convierten cada proyecto en una fiesta que se prepara entre todos. Parte de la base común (`../00-base-comun/propuesta-base.md`) y describe solo lo que este mundo agrega.

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
| **Nombre** | Elay |
| **Lema** | Lo dijiste, lo hiciste. ¡Elay! |
| **Personajes** | Nando y Mechi, con traje típico cruceño |
| **Promesa** | Organizar tu día y tus proyectos con dos compañeros que te animan en tu propio idioma |
| **Para quién** | Estudiantes y equipos de Santa Cruz que quieren cumplir sin sentirse vigilados |
| **Por qué este mundo** | Es el único de los cinco que no podría ser de otro lugar. La pertenencia es su mecánica principal |

"Elay" es lo que se dice en Santa Cruz al mostrar algo: "hela ahí". La plataforma lo usa en ese sentido exacto: cada actividad cumplida es algo que se puede mostrar.

A diferencia de las otras direcciones, aquí la mascota son **dos personas**, no un animal ni un objeto. Eso cambia el tipo de vínculo: no se cuida a una criatura, se está acompañado.

- **Nando** anima. Empuja a empezar, celebra cada avance y cuida la racha.
- **Mechi** ordena. Ayuda a planificar, avisa cuánto falta, defiende el descanso y lee los reportes.

## 2. El mundo y su metáfora

Cada elemento del mundo muestra un dato. Nada es adorno.

| Elemento del mundo | Dato que muestra | Mecánica del motor |
| :--- | :--- | :--- |
| **Tapeque** (la provisión que se lleva para el viaje) | Las actividades de hoy y cuántas van | Progreso del día |
| **Cuñapés** | Puntos ganados | Puntos |
| **Jenecherú** (el tizón que guarda el fuego hasta mañana) | Días seguidos con actividad | Racha |
| **Cómper** (pedir pausa en el juego) | Protectores disponibles | Protector de racha |
| **Anillos** de la ciudad | Nivel personal: cada nivel es un anillo más lejos | Niveles |
| **Comparsa** | El equipo de un proyecto | Proyecto y miembros |
| **Las cinco etapas del buri** | Avance del proyecto: la fiesta se va armando | Hitos de proyecto |
| **Florada del tajibo** | Constancia de las últimas semanas: cada día cumplido es una flor | Mapa de constancia |
| **Palabra del día y diccionario camba** | Días activos convertidos en colección | Mecánica insignia y colección |
| **Yapa** | La sorpresa ocasional de un día redondo | Sorpresa |
| **La mesa de horneados** | Insignias ganadas | Insignias |
| **Nando y Mechi** | Estado del día, con seis ánimos | Estado de la mascota |

## 3. Propuesta de valor y diferenciadores

**Frente a una lista de tareas común.** Una lista dice qué falta. Elay dice qué falta, cuánto llevas, quién te acompaña y qué se está construyendo con tu equipo. El progreso se ve en una fiesta que se arma, un tajibo que florece y un fuego que no se apaga.

**Frente a las otras cuatro direcciones.**

| Dirección | Su fuerza | Lo que Elay con Nando y Mechi hace distinto |
| :--- | :--- | :--- |
| A · Panal | La gráfica más limpia: todo es una celda | Cambia claridad geométrica por calidez humana |
| B · Órbita | Calma y ritmo; ideal para concentrarse | Es luminosa y sociable, no introspectiva |
| C · Cumbre | Épica del esfuerzo individual | La meta no es llegar más alto, es llegar juntos a la fiesta |
| D · Elay con Toco | El mismo territorio, contado desde la naturaleza | Aquí hablan personas: hay diálogo, idioma y costumbres |

**Fortalezas.**

- Identidad inconfundible. Una persona cruceña la reconoce como propia en dos segundos.
- Dos voces permiten dos tonos: el que empuja y la que cuida. Un solo personaje tiene que hacer ambas cosas y suele quedar plano.
- La palabra del día da un motivo para abrir la aplicación que no depende de tener tareas pendientes.
- El proyecto como fiesta es la metáfora de equipo más cálida de las cinco: nadie compite, todos traen algo.

**Riesgos, dichos con franqueza.**

- Es la dirección con más vocabulario nuevo. Si no se dosifica, confunde.
- Representar personas exige más cuidado que representar una abeja: un rasgo mal resuelto se lee como caricatura.
- Fuera de Santa Cruz pierde parte de su gracia. Es una decisión, no un defecto: el proyecto es local.
- Conozco Santa Cruz por estudio, no por haberla vivido. El vocabulario y los detalles culturales necesitan la revisión de alguien de allá. El glosario de `estrategia-gamificacion.md` marca qué está confirmado por fuente y qué no.

## 4. Un día y una semana de Ana

**Viernes 13 de noviembre.** Ana abre Elay después de clases. Nando la recibe tocándose el ala del sombrero: "¡Elay, Ana! Tu tapeque de hoy trae 5 actividades y ya cumpliste 3. ¿Le metemos a las que faltan?". Al lado, Mechi precisa: "Te falta poquingo: dos más y cerrás el día". La palabra de hoy es justamente *poquingo*.

Ana marca "Diseñar pantalla de reportes". La casilla se llena, suben 25 cuñapés y en la tarjeta de la comparsa aparece su aporte: Proyecto final pasa a 19 de 30. Marca "Practicar inglés 15 minutos": tapeque completo. Mechi levanta la mano, Nando lanza el sombrero, suman 20 cuñapés de bono y hoy toca yapa: un dicho nuevo para el diccionario. El jenecherú llega a 13 días.

**La semana.** El lunes, la comparsa recibe los reconocimientos: Sofía es la tiluchi de la semana porque aportó cinco días seguidos, aunque Ana hizo más actividades. El miércoles Diego se traba con una entrega y pide una mano; Luis la toma. El jueves Ana tiene parcial y usa su día de descanso: Nando y Mechi aparecen sentados a la sombra con un somó, y nadie le reclama nada. El sábado la comparsa cruza el 80 %: en la escena del proyecto llega la tamborita. Falta una etapa para el buri.

## 5. Las doce pantallas en este mundo

| ID | Nombre en Elay | Qué muestra | Elemento distintivo |
| :--- | :--- | :--- | :--- |
| P01 | Entrá | Inicio de sesión | Nando y Mechi saludan desde sus arcos; saludo "¡Elay! Qué bueno verte" |
| P02 | Sumate | Registro | La promesa en una línea y tres ventajas dichas en camba |
| P03 | Armemos tu tapeque | Recorrido inicial de tres pasos | Elegir meta diaria, elegir quién te acompaña y crear la primera actividad; termina con la insignia Velatacú y un cómper de regalo |
| P04 | Hoy | Tapeque del día, fichas de jenecherú, cómper, anillo y palabra del día; comparsa y florada | Los dos personajes en sus arcos con la tarjeta "Mechi dice" |
| P05 | Actividades | Todas las actividades con pestañas Hoy, Próximas, Costumbres y Archivadas | Las recurrentes se llaman costumbres |
| P06 | Nueva actividad | Formulario corto: única o costumbre | Vista previa de cuñapés y consejo de Mechi |
| P07 | Comparsas | Los proyectos propios | Cada tarjeta muestra la etapa del buri con cinco marcas |
| P08 | La comparsa | Detalle del proyecto | Escena del patio donde se arma el buri en cinco etapas; aporte por comparsero |
| P09 | Sumá gente | Invitar personas | Enlace para copiar y mensaje ya redactado en camba |
| P10 | Reportes | Constancia, cumplimiento por actividad, tendencia | Florada del tajibo grande y lectura de Mechi en una frase |
| P11 | Mi mesa | Perfil y logros | Mesa de horneados (insignias), diccionario camba, anillo actual y "pinchulear" |
| P12 | ¡Elay! | Celebración | Nando y Mechi bailando; recompensa y siguiente meta |

## 6. Los cuatro casos de uso en este mundo

**CU-01. Registro e inicio de sesión.** La primera pantalla ya presenta a los personajes. El recorrido inicial se llama "Armemos tu tapeque" y hace tres preguntas: cuánto le metemos por día (3 Tranquilo, 5 Constante, 7 Con todo), quién te acompaña (Nando, Mechi o los dos) y cuál es tu primera actividad. Al completarla llega la primera insignia, Velatacú, y un cómper de regalo. La persona termina su primer minuto con algo ganado y con una decisión propia tomada.

**CU-02. Actividades únicas y recurrentes.** Una actividad única es una entrega; una recurrente es una **costumbre**. El conjunto del día es el tapeque. Completar suma cuñapés (25 las únicas, 10 las costumbres) y llena un tramo de la barra del tapeque. La racha es el jenecherú: el tizón que se guarda encendido para el día siguiente. Si un día no se puede, se pide cómper.

**CU-03. Proyectos y vinculación de usuarios.** Un proyecto es una comparsa y sus miembros son comparseros. Se invita con un enlace y un mensaje ya escrito. El avance no es una barra: es un patio donde se va armando el buri en cinco etapas. Cada comparsero ve su aporte, y el lunes se reconoce a quien fue más constante, no a quien hizo más.

**CU-04. Reporte con gráficas.** La constancia se lee en la florada del tajibo: una flor por día, más grande cuanto más se cumplió, con centro amarillo en los días redondos. El cumplimiento por actividad se muestra en barras con el nombre de cada costumbre. Mechi resume el reporte en una frase ("Los jueves son tu mejor día; los lunes te cuestan"). Cada gráfica tiene su tabla equivalente.

## 7. Voz y textos clave

Reglas de voz: voseo camba (tenés, querés, cerrás, metele), frases cortas, una sola palabra propia por frase y nunca un reproche. Nando exclama; Mechi afirma.

**Saludo según el estado del día.**

| Estado | Quién habla | Texto |
| :--- | :--- | :--- |
| Esperando | Nando | "¡Elay, Ana! Tu tapeque de hoy trae 5 actividades. ¿Por cuál arrancamos?" |
| Animando | Nando | "¡Ya arrancaste! Una hecha, faltan cuatro. Metele." |
| Feliz | Mechi | "Te falta poquingo: dos más y cerrás el día." |
| Celebrando | Los dos | "¡Tapeque completo! Hoy sí que la hiciste buenango." |
| Preocupada | Mechi | "El jenecherú sigue prendido. Con una actividad lo guardamos hasta mañana." |
| Descansando | Mechi | "Hoy toca cómper. Mañana seguimos donde quedamos." |

**Otros textos.**

| Situación | Texto |
| :--- | :--- |
| Lista vacía | "Tu tapeque está vacío. ¿Qué querés lograr hoy?" |
| Sin proyectos | "Todavía no tenés comparsa. Armá una y sumá a tu gente." |
| Error de conexión | "No pudimos guardar. Probá otra vez; lo que escribiste sigue aquí." |
| Contraseña incorrecta | "El correo o la contraseña no coinciden. Revisalos y probá de nuevo." |
| Racha rota | "El jenecherú se apagó, pero tu mejor marca sigue siendo 12 días. Hoy lo prendemos otra vez." |
| Protector usado | "Ayer usaste un cómper. Tu jenecherú sigue en 12 días." |
| Subir de nivel | "¡Llegaste al 5to anillo! Tu ciudad se agranda." |
| Hito de comparsa | "La comparsa cruzó el 60 %. Ya llegaron los horneados." |
| Proyecto cerrado | "¡Se armó el buri! Proyecto final, cumplido entre cuatro." |
| Yapa | "Hoy hay yapa: una entrada nueva para tu diccionario." |

La primera vez que aparece una palabra propia va con su explicación al lado ("Jenecherú: tu racha"). Después de siete días de uso, la explicación pasa a mostrarse solo al tocar la palabra.

## 8. Redux en este mundo

El mundo es un diccionario que `selectTextos` devuelve cuando `ajustes.mundo` vale `'elay-pareja'`. Ningún reducer cambia.

```js
export const textosElayPareja = {
  marca: 'Elay',
  saludo: (nombre) => `¡Elay, ${nombre}!`,
  actividad: { una: 'actividad', varias: 'actividades' },
  recurrente: { una: 'costumbre', varias: 'costumbres' },
  progresoHoy: 'Tapeque de hoy',
  puntos: { una: 'cuñapé', varias: 'cuñapés' },
  nivel: (n) => `${ordinal(n)} anillo`,
  racha: { nombre: 'Jenecherú', ayuda: 'El tizón que guarda tu fuego hasta mañana' },
  protector: { nombre: 'Cómper', ayuda: 'Pedí pausa un día sin perder la racha' },
  diaRedondo: 'Tapeque completo',
  proyecto: { una: 'comparsa', varias: 'comparsas' },
  miembros: 'comparseros',
  hitos: ['Se corre la voz', 'Se arma el pahuichi', 'Llegan los horneados', 'Afina la tamborita', '¡Buri!'],
  constancia: 'Florada del tajibo',
  insignias: 'Horneados',
  coleccion: 'Diccionario camba',
  sorpresa: 'Yapa',
};
```

**Quién habla.** La voz se decide con un selector puro a partir del estado de la mascota y de la preferencia elegida en el recorrido inicial.

```js
const VOZ_POR_ESTADO = {
  esperando: 'nando', animando: 'nando', feliz: 'mechi',
  celebrando: 'ambos', preocupada: 'mechi', descansando: 'mechi',
};

export const selectVoz = createSelector(
  [selectEstadoMascota, (state) => state.ajustes.acompanante],
  (estado, acompanante) => (acompanante === 'ambos' ? VOZ_POR_ESTADO[estado] : acompanante)
);
```

**La gráfica propia: las etapas del buri.** La escena del proyecto es una función del avance.

```js
export const selectEtapasBuri = createSelector([selectAvanceProyecto], (avance) => {
  const etapa = Math.min(5, Math.floor(avance.porcentaje / 20));
  const siguiente = (etapa + 1) * 20;
  return {
    etapa,                                    // 3 con el 60 %
    capasVisibles: textosElayPareja.hitos.slice(0, etapa),
    faltanParaLaSiguiente: etapa === 5 ? 0 : Math.ceil((siguiente / 100) * avance.total) - avance.completadas,
  };
});
```

Con los datos de ejemplo (18 de 30) devuelve etapa 3 y 6 actividades para la cuarta.

**Palabra del día.** Es una función pura de la fecha, sin azar: `palabraDelDia(fecha) = DICCIONARIO[diaDelAnio(fecha) % DICCIONARIO.length]`. Se guarda en el diccionario de la persona cuando ese día fue activo, lo cual ya está en `eventos`. No hace falta estado nuevo.

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
| :--- | :--- |
| Demasiadas palabras nuevas | Máximo una palabra propia por frase; explicación al lado la primera semana; la palabra común siempre disponible al tocar |
| Caricatura o estereotipo | Personajes dibujados con dignidad y proporciones amables; el descanso se muestra como pausa compartida, nunca como pereza; revisión por personas cruceñas antes de publicar |
| Vocabulario inexacto | Glosario con estado de verificación; nada sin confirmar llega a la versión final |
| Dos personajes complican las pantallas pequeñas | En teléfono aparece solo quien habla; la escena doble queda para escritorio y celebraciones |
| Género de los personajes leído como reparto de roles | Los roles no son fijos: en el recorrido inicial se puede elegir quién acompaña, y ambos animan y ambos planifican cuando van solos |
| Stitch no mantiene iguales a los personajes | Se usa la referencia de `referencia/` y se reemplaza por los SVG propios al implementar |

## 10. Cambios respecto al tablero del lienzo

| En el tablero E | En esta propuesta | Motivo |
| :--- | :--- | :--- |
| El proyecto avanzaba por anillos ("3er anillo de 5") | El proyecto avanza por las cinco etapas del buri | "Anillo" ya nombra el nivel personal; dos usos en la misma pantalla confunden |
| Proyecto final con 20 de 30 (67 %) y aportes 8, 5, 4, 3 | 18 de 30 (60 %) y aportes 7, 5, 4, 2 | Mismos datos de ejemplo en las cinco direcciones para poder compararlas |
| "14 de 40 palabras" sin regla definida | Una palabra por día activo; los dichos llegan como yapa | La regla queda explícita y compatible con el motor |
| Descanso sin representación | Nando y Mechi sentados a la sombra con un somó | Hace visible que parar es legítimo |

El tablero se puede actualizar con estos cambios cuando se confirme la dirección.
