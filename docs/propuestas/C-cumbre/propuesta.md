# Propuesta de aplicación: Cumbre

Cumbre es una de las cinco pieles posibles de la plataforma gamificada. El motor, los casos de uso, el store y la base de datos son los de `../00-base-comun/`; este documento describe lo que cambia cuando el mundo es una montaña: qué significa cada cosa, cómo se ven las doce pantallas, cómo habla la aplicación y qué riesgos trae esta elección.

## Tabla de contenidos

1. [Resumen](#1-resumen)
2. [El mundo y su metáfora](#2-el-mundo-y-su-metáfora)
3. [Propuesta de valor y diferenciadores](#3-propuesta-de-valor-y-diferenciadores)
4. [Un día y una semana de Ana en Cumbre](#4-un-día-y-una-semana-de-ana-en-cumbre)
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
| **Nombre** | Cumbre |
| **Lema** | Se sube de a un tramo. |
| **Mascota** | Kusi, una llama con manta de franjas. Personaje original |
| **Promesa** | Saber cuánto has subido y cuánto falta con solo mirar la montaña |
| **Para quién** | Estudiantes y equipos pequeños que necesitan ver el avance acumulado y repartir el esfuerzo |
| **Impulsos que acentúa** | CD1 (la expedición compartida) y CD2 (la altura ganada) |
| **Perfil al que más le habla** | Triunfador |

**Por qué este mundo.** Subir es la metáfora de progreso que menos explicación necesita: arriba es más, la cumbre es el final, un campamento es un descanso merecido. Eso resuelve de entrada el pedido central del enunciado, que el cumplimiento se entienda de un vistazo. La montaña aporta además dos ideas que una lista de tareas no tiene: la **cordada**, donde un equipo sube unido por una cuerda y nadie queda atrás, y la **aclimatación**, donde descansar es condición para subir más y no una falta.

**Por qué no otro.** Cumbre es la dirección más sobria y la más fácil de leer, pero también la menos sorprendente: la montaña es una imagen frecuente para hablar de metas. Si lo que más importa es que el producto no se parezca a ningún otro, las direcciones cruceñas (D y E) ganan.

## 2. El mundo y su metáfora

Cada elemento del mundo muestra un dato. Nada es decoración.

| Elemento del mundo | Dato que muestra | Mecánica del motor |
| :--- | :--- | :--- |
| Tramo | Una actividad | Completar actividad |
| Tramo de rutina | Una actividad recurrente | Recurrencia |
| Metros ("+10 m", "+25 m") | Puntos | Puntos ponderados |
| Peldaños de la jornada | Progreso de hoy (3 de 5) | Meta diaria |
| Jornada completa | Día redondo | Bono de +20 |
| Altitud ganada | Puntos acumulados en el tiempo | Mapa de constancia y tendencia |
| Banderín de racha | Días activos seguidos | Racha |
| Refugio | Protector de racha | Protector |
| Día de aclimatación | Día de descanso semanal | Descanso |
| Campamento base | Pausa de hasta 14 días | Pausa |
| Oficio de montaña ("Guía de ruta") | Nivel | Niveles |
| Expedición: una montaña con su ruta | Un proyecto | Avance |
| Cuatro campamentos y la cumbre | Los cinco hitos (20, 40, 60, 80 y 100 %) | Hitos |
| Etapa | El recorrido entre dos hitos | Bono de hito |
| Cordada y cuerda | Miembros y aporte de cada uno | Aporte por miembro |
| Eco | Ánimo entre miembros | Ánimos |
| Pedir cuerda y dar cuerda | Pedido de ayuda y rescate | Pedido de ayuda |
| Abrir huella | Papel rotativo que elige el tramo clave de la semana | Mecánica insignia del mundo |
| Libro de cumbre | Cierre firmado por todo el equipo | Proyecto cerrado |
| Banderines | Insignias | Insignias |
| Hallazgos del sendero | Colección y sorpresa | Colección |
| Kusi | Cómo va el día | `selectEstadoMascota` |

En este mundo "tramo" es siempre una actividad. Al recorrido entre dos campamentos se le dice "etapa", para no usar la misma palabra con dos sentidos.

## 3. Propuesta de valor y diferenciadores

**Frente a una lista de tareas común.**

| Lista común | Cumbre |
| :--- | :--- |
| Lo hecho desaparece | Lo hecho queda como altura ganada |
| El avance del equipo es un porcentaje | El avance es una posición en una ruta con campamentos |
| Fallar un día rompe todo | Hay refugio, aclimatación y campamento base; la altitud nunca baja |
| No se ve quién aporta | La cordada muestra el aporte de cada miembro sin clasificarlos |
| Terminar un proyecto es archivar | Terminar es llegar a la cumbre y firmar el libro |

**Frente a las otras cuatro direcciones.**

| Dirección | Dónde gana ella | Dónde gana Cumbre |
| :--- | :--- | :--- |
| A · Panal | Más tierna y más cooperativa de inmediato | Lectura más rápida del avance acumulado y del hito siguiente |
| B · Órbita | Mejor para el ritmo de las recurrentes y para exploradores | Más clara para proyectos con principio y fin |
| D · Elay con Toco | Identidad local y colección más rica | Vocabulario casi sin palabras nuevas |
| E · Elay con Nando y Mechi | Pertenencia y calidez humana | Tono sobrio, apto para un contexto más formal |

**Fortalezas.** Metáfora universal. Gráfica de proyecto muy legible. El descanso tiene un lugar digno dentro del mundo. Poco vocabulario que aprender.

**Riesgos, dichos con franqueza.** Es la dirección menos original. Su paisaje es andino y el proyecto nace en Santa Cruz, en tierras bajas: no conecta con la identidad local como lo hacen D y E. Una ruta con una sola cumbre da poco que descubrir al perfil explorador. Y una gráfica que siempre sube puede disimular una mala semana si no se acompaña de la vista día por día.

## 4. Un día y una semana de Ana en Cumbre

**Viernes 13 de noviembre.** Ana abre la plataforma a media mañana. Kusi la recibe con la manta puesta y el saludo de siempre: "Hoy toca subir, Ana.". La ruta de hoy tiene cinco tramos. Repasa sus apuntes de Redux (+10 m), camina media hora (+10 m) y entrega el informe de avance (+25 m): tres peldaños de la jornada quedan llenos y el día suma 45 m. Su altitud es de 640 m, nivel 4, Guía de ruta; le faltan 60 m para ser Montañista.

En la montaña del inicio, la cordada del Proyecto final está en el campamento 3: 18 de 30 tramos. Por la tarde le quedan dos: diseñar la pantalla de reportes (+25 m, que además mueve a la cordada) y practicar inglés (+10 m). Si los cierra, tendrá jornada completa (+20 m), llegará a 695 m y Kusi dará un salto.

**La semana.** El lunes la Bitácora muestra el reconocimiento "Paso firme" para Ana, por aportar cinco días a la expedición. Esta semana le toca abrir huella a Luis, que marca como tramo clave "Conectar el store con la API". El miércoles Diego se traba con la base de datos y pide cuerda; Sofía toma el tramo y lo cierra. Ana le manda un eco a Diego: "Con calma, pero sin parar.". El domingo es su día de aclimatación: Kusi descansa junto a la carpa y nadie espera nada de ella.

## 5. Las doce pantallas en este mundo

| ID | Nombre en Cumbre | Qué muestra | Elemento distintivo |
| :--- | :--- | :--- | :--- |
| P01 | Volver a la ruta | Inicio de sesión | Kusi espera al pie del sendero, al amanecer |
| P02 | Empezar la ascensión | Registro | Tres promesas cortas junto al formulario |
| P03 | Campamento base | Recorrido inicial en tres pasos | Se elige el paso (3, 5 o 7 tramos), se crea el primer tramo y se gana el primer banderín y un refugio |
| P04 | Hoy | Saludo, tramos de hoy, cordada y altitud | La montaña con la ruta de la expedición principal |
| P05 | Tramos | Todas las actividades | Pestañas Hoy, Próximos, De rutina y Archivados |
| P06 | Nuevo tramo | Crear o editar | Vista previa de los metros que dará |
| P07 | Expediciones | Proyectos propios | Cada tarjeta es una montaña pequeña con sus campamentos |
| P08 | Detalle de expedición | Seguimiento de un proyecto | Ruta grande, cordada con cuerda, quién abre huella y pedidos de cuerda |
| P09 | Sumar a la cordada | Invitar personas | La cuerda con un lugar libre |
| P10 | Bitácora | Reportes | Altitud ganada por semana y perfil de la travesía día por día |
| P11 | Perfil | Nivel, banderines y hallazgos | Fila de banderines y ajustes de paso, aclimatación y campamento base |
| P12 | Celebración | Reconocer un logro | Kusi celebra; variante oscura para la cumbre con el libro de firmas |

## 6. Los cuatro casos de uso en este mundo

**CU-01. Registro e inicio de sesión.** El registro pide nombre, correo y contraseña. El recorrido inicial ocurre en el campamento base: Kusi pregunta "¿A qué paso quieres subir?" y ofrece paso tranquilo (3), paso constante (5) o paso intenso (7). La persona crea su primer tramo, lo completa y recibe el banderín "Primer paso", sus primeros metros y un refugio de regalo.

**CU-02. Actividades únicas y recurrentes.** Un tramo único tiene fecha de vencimiento y vale 25 m. Un tramo de rutina se repite según su regla y vale 10 m cada vez. Completar llena un peldaño de la jornada y suma metros al instante. La racha de ascenso se mantiene con un tramo al día; si un día queda en cero, un refugio la protege.

**CU-03. Proyectos y vinculación de usuarios.** Un proyecto es una expedición. Quien la crea invita por correo o enlace y arma su cordada. Los tramos de la expedición se asignan a miembros; cada tramo completado mueve a toda la cordada por la ruta. Hay cuatro campamentos y la cumbre. El retraso de una persona no le quita metros a nadie.

**CU-04. Reporte con gráficas.** La Bitácora muestra la altitud ganada (área acumulada por semana), el perfil de la travesía (día por día), el cumplimiento de cada tramo de rutina y, por expedición, la ruta con su posición y el aporte de cada miembro. Cada gráfica tiene su cifra en texto y una descripción alternativa.

## 7. Voz y textos clave

Voz de guía de montaña: frases cortas, tuteo, punto final en lugar de exclamación. Dice lo que hay y lo que falta. Nunca reprocha.

**Saludo según el estado de Kusi.**

| Estado | Título | Texto |
| :--- | :--- | :--- |
| Esperando | Hoy toca subir, Ana. | Tienes 5 tramos en la ruta de hoy. Kusi ya tiene la manta puesta. |
| Animando | Hoy toca subir, Ana. | Primer tramo hecho: ya estás en camino. Faltan 4 para la jornada completa. |
| Feliz | Hoy toca subir, Ana. | Kusi te espera en el campamento 3 del Proyecto final. Completa 2 tramos más y la cordada sigue subiendo. |
| Celebrando | Jornada completa, Ana. | Hoy subiste 100 m. Kusi mira el valle desde arriba. |
| Preocupada | Todavía hay luz, Ana. | Un tramo corto basta para mantener tu racha de 12 días. |
| Descansando | Día de aclimatación. | Hoy no se espera nada de ti. Descansar también es subir. |

**Estados vacíos.**

| Dónde | Texto |
| :--- | :--- |
| Hoy, sin tramos | El sendero de hoy está despejado. Suma un tramo o disfruta la vista. |
| Expediciones | Todavía no hay expediciones. Arma una y suma a tu cordada. |
| Bitácora | La bitácora se escribe subiendo. Completa tu primer tramo y aquí verás tu altitud. |
| Banderines | Tu primer banderín está a un tramo de distancia. |

**Errores.**

| Caso | Texto |
| :--- | :--- |
| Credenciales incorrectas | Ese correo o esa contraseña no coinciden. Revisa y vuelve a intentar. |
| Correo ya registrado | Ya hay una cuenta con ese correo. ¿Quieres iniciar sesión? |
| Título vacío | Ponle un nombre al tramo. |
| Fallo al guardar | No pudimos guardar el cambio. Revisa tu conexión y vuelve a intentar. |

**Momentos delicados.**

| Momento | Texto |
| :--- | :--- |
| Refugio usado | Pasaste la noche en un refugio. Tu racha de 12 días sigue en pie. Te queda 1 refugio. |
| Racha rota | El sendero sigue ahí. Tu mejor racha fue de 12 días y tu altitud no baja: 640 m. |
| Volver de una pausa | Kusi te esperó en el campamento base. Retomas donde lo dejaste. |
| Propuesta de bajar la meta | Las últimas dos semanas fueron cuesta arriba. ¿Probamos un paso más tranquilo? |

**Celebraciones.**

| Intensidad | Ejemplo |
| :--- | :--- |
| Pequeña | +10 m |
| Mediana | Jornada completa. +20 m |
| Grande | Campamento 3 alcanzado. +30 m para cada integrante que aportó en esta etapa. Siguiente parada: campamento 4, a 6 tramos. |
| Cierre | Cumbre. La cordada llegó completa. Firmen el libro. |

## 8. Redux en este mundo

El mundo es un diccionario y dos selectores. Ningún reducer cambia.

```js
// Lo que devuelve selectTextos cuando ajustes.mundo === 'cumbre'
export const textosCumbre = {
  mascota: 'Kusi',
  saludo: (nombre) => `Hoy toca subir, ${nombre}.`,
  actividad: { uno: 'tramo', varios: 'tramos' },
  recurrente: 'tramo de rutina',
  puntos: { nombre: 'metros', formato: (n) => `${n} m` },
  niveles: [
    'Caminante', 'Senderista', 'Excursionista', 'Guía de ruta', 'Montañista',
    'Andinista', 'Vigía de altura', 'Cabeza de cordada', 'Guía de cumbre',
    'Leyenda de la cordillera',
  ],
  racha: 'racha de ascenso',
  protector: { uno: 'refugio', varios: 'refugios' },
  descanso: 'día de aclimatación',
  pausa: 'campamento base',
  diaRedondo: 'jornada completa',
  proyecto: { uno: 'expedición', varios: 'expediciones' },
  miembros: 'cordada',
  hitos: ['Campamento 1', 'Campamento 2', 'Campamento 3', 'Campamento 4', 'Cumbre'],
  constancia: 'altitud ganada',
  reportes: 'bitácora',
  insignias: 'banderines',
  coleccion: 'hallazgos del sendero',
  constante: 'paso firme',
  animo: 'eco',
  ayuda: 'pedir cuerda',
};
```

```js
// La ruta de una expedición: función pura del avance del proyecto.
const HITOS = [20, 40, 60, 80, 100];

export const selectRutaExpedicion = createSelector(
  [selectAvanceProyecto, selectTextos],
  (avance, textos) => {
    const alcanzados = HITOS.filter((u) => avance.porcentaje >= u).length;
    return {
      posicion: avance.porcentaje / 100, // 0 = campamento base, 1 = cumbre
      campamentos: HITOS.map((umbral, i) => ({
        nombre: textos.hitos[i],
        umbral,
        estado: i < alcanzados - 1 ? 'alcanzado' : i === alcanzados - 1 ? 'actual' : 'pendiente',
      })),
      faltanParaSiguiente:
        alcanzados < HITOS.length
          ? Math.ceil((HITOS[alcanzados] / 100) * avance.total) - avance.completadas
          : 0,
      cordada: avance.miembros, // en orden de ingreso, nunca de clasificación
    };
  }
);

// La altitud ganada: una suma acumulada. Por construcción, nunca baja.
export const acumular = (valores) =>
  valores.reduce((serie, v) => [...serie, (serie.at(-1) ?? 0) + v], []);

export const selectAltitudPorSemana = createSelector([selectMetrosPorSemana], acumular);
// [80, 90, 80, 120, 150, 120] -> [80, 170, 250, 370, 520, 640]
```

Con los datos de ejemplo (18 de 30 tramos, 60 %), `selectRutaExpedicion` devuelve dos campamentos alcanzados, el tercero como actual, dos hitos pendientes y `faltanParaSiguiente: 6`.

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
| :--- | :--- |
| La metáfora de la cumbre puede leerse como "no pares nunca" | Aclimatación, refugio y campamento base son parte visible del mundo; Kusi dice "descansar también es subir" |
| Poca originalidad frente a otras aplicaciones de metas | El peso está en lo que sí es propio: la cordada, abrir huella y el libro de cumbre |
| Distancia cultural con Santa Cruz | Tono sobrio y universal; si se elige esta dirección, validar con el curso que no se sienta ajena |
| Iconografía andina tratada con ligereza | Sin símbolos sagrados ni tejidos de una comunidad concreta; Kusi sin rasgos de caricatura; la manta es de franjas genéricas |
| La gráfica acumulada disimula una mala semana | El perfil de la travesía muestra cada día: un día en cero es un llano visible |
| La cuerda puede sentirse como presión sobre quien va más lento | La cordada ocupa una sola posición; el orden es de ingreso; nadie aparece como último |
| Stitch no reproduce igual a Kusi ni la ruta | Se usan como composición; el dibujo final es SVG propio (ver `prompts-stitch.md`) |
| El nombre "Kusi" viene del quechua, donde se asocia con la alegría | Lo conozco por estudio, no por uso propio: conviene confirmarlo con hablantes antes de publicar |

## 10. Cambios respecto al tablero del lienzo

El tablero "C · Cumbre" fue una primera exploración de una sola pantalla. Al escribir el sistema completo cambiaron estos puntos:

| En el tablero | En la documentación | Motivo |
| :--- | :--- | :--- |
| 790 m y "+150 m esta semana" | 640 m y "+120 m esta semana" | Datos de ejemplo comunes a las cinco direcciones (640 puntos, nivel 4, faltan 60) |
| "2 escudos" con icono de escudo | "2 refugios" con icono de refugio | Diccionario de pieles: el protector de Cumbre es el refugio |
| Cinco campamentos más la cumbre (seis marcas) | Cuatro campamentos y la cumbre (cinco hitos) | El motor define cinco hitos; el quinto es la cumbre |
| "Campamento 3 de 5 · 18 de 30 tramos" | "Campamento 3 · hito 3 de 5 · 18 de 30 tramos" | Consecuencia del cambio anterior |
| "Recurrente · diario" | "De rutina · diario" | Diccionario de pieles: la recurrente es un tramo de rutina |
| Solo el contador "3 de 5" | Contador más cinco peldaños ascendentes | El progreso del día debe leerse sin números |
| Barras de aporte sin más | Se añaden eco, pedir cuerda y quién abre huella en P08 | Mecánicas de equipo del motor y mecánica insignia |

La composición, la paleta, las tipografías, Kusi y la montaña se mantienen tal como están en el tablero.
