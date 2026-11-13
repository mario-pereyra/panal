# Estrategia de gamificación: Elay con Toco

Cómo se viste el motor común con el mundo de Toco. Ninguna regla ni número cambia respecto de `../00-base-comun/motor-de-gamificacion.md`; aquí se decide qué impulsos se acentúan, cómo se llama cada cosa y cuál es la mecánica que solo existe en este mundo. Sigue los cinco pasos de diseño del curso.

## Tabla de contenidos

1. [Narrativa](#1-narrativa)
2. [Objetivos y conductas](#2-objetivos-y-conductas)
3. [Jugadores](#3-jugadores)
4. [Octalysis del mundo](#4-octalysis-del-mundo)
5. [Mecánicas con nombre propio](#5-mecánicas-con-nombre-propio)
6. [La mecánica insignia: Toco es el tablero](#6-la-mecánica-insignia-toco-es-el-tablero)
7. [Equipo: la comparsa](#7-equipo-la-comparsa)
8. [Insignias: el Álbum del monte](#8-insignias-el-álbum-del-monte)
9. [Colección y sorpresas: visitas en la rama](#9-colección-y-sorpresas-visitas-en-la-rama)
10. [Estados de Toco](#10-estados-de-toco)
11. [Bucles y recorrido del jugador](#11-bucles-y-recorrido-del-jugador)
12. [Línea base y métricas](#12-línea-base-y-métricas)
13. [Riesgos éticos propios](#13-riesgos-éticos-propios)
14. [Trazabilidad](#14-trazabilidad)

---

## 1. Narrativa

> En el patio hay un tajibo y en una de sus ramas vive Toco. Cada mañana su pico amanece sin color. Lo que vos cumplís lo va pintando, tramo por tramo, del amarillo de la mañana al rosado del tajibo. Si el pico queda entero, a veces el monte se entera y manda visita. Con los días, el árbol florece donde hubo constancia y Toco sube de rama. Y cuando se junta una comparsa, sale de la plaza y cruza la ciudad anillo por anillo hasta que se arma el buri.

La historia responde tres preguntas sin explicar ninguna regla:

| Pregunta | Respuesta del mundo |
| :--- | :--- |
| ¿Para qué marco esta actividad? | Para pintarle un tramo al pico |
| ¿Para qué vuelvo mañana? | Porque el pico amanece en blanco y el jenecherú guarda el fuego |
| ¿Para qué aporto al equipo? | Para que la comparsa cruce el siguiente anillo |

El tono es de patio, no de epopeya. Nadie salva el monte: lo cuida, lo conoce y lo va coleccionando.

## 2. Objetivos y conductas

| Conducta | Cómo la empuja este mundo | Objetivo |
| :--- | :--- | :--- |
| C1 Registrar en menos de 15 segundos | Un campo obligatorio y la vista previa "Pinta un tramo" | OE1 |
| C2 Completar algo el primer día | El recorrido termina con el primer tramo pintado y la lámina "El curucusí" | OE1 |
| C3 Volver al día siguiente | El pico amanece en crema; el jenecherú recuerda que hay fuego guardado | OE2 |
| C4 Cumplir la meta diaria | Un pico con un solo tramo sin pintar pide cierre; el día redondo puede traer visita | OE2 |
| C5 Aportar cada semana | El punto naranja no avanza solo; tiluchi de la semana premia la regularidad | OE4 |
| C6 Mirar el reporte | La florada se entiende sin leer: donde hay flores grandes hubo días buenos | OE3 |
| C7 Retomar tras fallar | "La brasa quedó": mejor racha a la vista, hamaca y lámina "La peta" | OE5 |

**Acento del mundo.** La conducta que más debería mover es C4: el pico convierte "me falta una" en algo que se ve y molesta dejar a medias.

## 3. Jugadores

| Perfil | Atención | Qué recibe aquí | Límite |
| :--- | :--- | :--- | :--- |
| **Explorador** | Alta | Álbum del monte, visitas, láminas secretas, glosario de palabras, el tajibo por recorrer | Nada de eso es requisito para avanzar |
| **Socializador** | Alta | Comparsa, somó, pedir y dar una mano, buri compartido | Sin comparación pública fuera de la comparsa |
| **Triunfador** | Media | Ramas, cuñapés, pico pintado, florada | Menos cifras en primer plano que en Cumbre o Panal |
| **Competidor** | Baja | "La punta de la comparsa": clasificación semanal, solo si el propietario la enciende | Sin tabla global |

**A quién le habla menos y cómo se compensa.** El triunfador puro puede sentir que el mundo es demasiado amable. Se compensa con cifras exactas siempre disponibles: "Mi tajibo" muestra cuñapés totales, umbral de la rama siguiente y mejor racha, y la pantalla "Cómo se ganan los cuñapés" publica todas las reglas.

## 4. Octalysis del mundo

| Impulso | Motor | Aquí | Mecánica con nombre del mundo | Freno |
| :--- | :---: | :---: | :--- | :--- |
| CD1 Significado épico | 2 | 2 | Pertenencia cruceña; la comparsa convoca al buri | Tono cercano, sin solemnidad |
| CD2 Logro y desarrollo | 3 | 2 | Cuñapés, ramas, pico pintado | Reglas publicadas; topes contra el abuso |
| CD3 Creatividad y respuesta | 2 | 2 | Meta que divide el pico; pinchulear a Toco | Pocas opciones, todas cosméticas |
| CD4 Propiedad | 2 | **3** | Mi tajibo, florada, Álbum del monte, visitas | Nada se compra; nada caduca |
| CD5 Influencia social | 3 | 2 | Comparsa, somó, tiluchi de la semana | Nadie pierde por otro |
| CD6 Escasez | 1 | 1 | Dos hamacas como máximo; visitas raras | Sin piezas por tiempo limitado |
| CD7 Curiosidad | 1 | **2** | Visitas en la rama, láminas secretas | Solo cosmético; garantía a la octava |
| CD8 Evitación de pérdida | 1 | 1 | Jenecherú | Hamaca automática, siesta, viaje, "la brasa quedó" |

**Balance.** White Hat (CD1 + CD2 + CD3) suma 6; Black Hat (CD6 + CD7 + CD8) suma 4. El margen es menor que en el motor porque sube la curiosidad, y por eso su freno es el más estricto del mundo: la sorpresa nunca da ventaja, nunca se paga y nunca desaparece. Intrínsecos (CD3 + CD5 + CD7) suman 6 y extrínsecos (CD2 + CD4 + CD6) suman 6.

## 5. Mecánicas con nombre propio

| Motor | En Elay con Toco | Texto de ayuda en la interfaz |
| :--- | :--- | :--- |
| Puntos | Cuñapés | "Lo que ganás al cumplir" |
| Nivel | Rama | "Toco sube de rama con tus cuñapés" |
| Racha | Jenecherú | "Tu racha: el fuego que no se apaga" |
| Protector | Hamaca | "Días de descanso que cuidan tu racha" |
| Día de descanso | Siesta | "Tu día libre de la semana" |
| Pausa | Viaje | "Armá tu tapeque: hasta 14 días con todo guardado" |
| Día redondo | Pico pintado | "Cumpliste tu meta de hoy" |
| Proyecto | Comparsa | "Tu equipo" |
| Miembros | Comparseros | |
| Hitos | Anillos | "Cada 20 % la comparsa cruza un anillo" |
| Proyecto cerrado | Buri | "La fiesta al cerrar el 5to anillo" |
| Mapa de constancia | Florada del tajibo | "Cada día cumplido es una flor" |
| Insignias | Álbum del monte | "Láminas que se ganan" |
| Sorpresa y colección | Visitas en la rama | "A veces, cuando el día queda redondo" |
| Constante de la semana | Tiluchi de la semana | "Quien aportó más días" |
| Ánimo | Invitar un somó | "Un gesto de ánimo; no da cuñapés" |
| Pedido de ayuda | Pedir una mano | |

**Cuñapés.** Los valores son los del motor: recurrente 10, única 25, única de prioridad alta 35, única vencida 15, cuota semanal +15, pico pintado +20, cada 7 días de jenecherú +50, anillo cruzado +30, buri +100.

**Las diez ramas.**

| Nivel | Rama | Cuñapés | Qué hay en esa rama |
| :---: | :--- | :---: | :--- |
| 1 | Rama 1 · El brote | 0 | La primera hoja |
| 2 | Rama 2 · La horqueta | 100 | Donde el tronco se abre en dos |
| 3 | Rama 3 · La sombra | 250 | Ya da sombra al patio |
| 4 | Rama 4 · El mirador | 450 | Se ve la calle |
| 5 | Rama 5 · El nido | 700 | Toco arma su nido |
| 6 | Rama 6 · La florada | 1000 | La primera rama que florece entera |
| 7 | Rama 7 · El viento | 1400 | Se mueve con la brisa |
| 8 | Rama 8 · Las parabas | 1900 | Donde se posan las parabas |
| 9 | Rama 9 · El cielo abierto | 2500 | Ya no hay hojas encima |
| 10 | Rama 10 · La copa | 3200 | Se ve todo el monte |

Estado de ejemplo: 640 cuñapés, rama 4, faltan 60 para la rama 5.

## 6. La mecánica insignia: Toco es el tablero

En las otras direcciones la mascota acompaña a las gráficas. Aquí la mascota **es** las gráficas: quien mira a Toco tres segundos sabe cómo va su día, su nivel y su suerte.

| Parte de Toco | Regla | Impulso |
| :--- | :--- | :--- |
| **El pico** | Tiene tantos tramos como el objetivo de hoy (el menor entre la meta diaria y lo programado). Cada actividad cumplida pinta un tramo, de la base a la punta, en una rampa plana del amarillo al rosado tajibo. Entero = pico pintado = día redondo | CD2, CD3 |
| **La rama** | Es el nivel. Lleva cuatro botones; se abre uno por cada 25 % de avance hacia la rama siguiente. Con los cuatro abiertos, Toco salta de rama | CD2, CD4 |
| **La visita** | En un día redondo, con probabilidad de 1 en 4, un animal o una flor del monte se posa en la rama hasta el cambio de día y queda en el álbum | CD7, CD4 |
| **El pinchuleo** | Con cada rama se desbloquean arreglos para Toco. Son cosméticos y no cambian ninguna cifra | CD3, CD4 |

**Por qué funciona.** Un pico con un tramo en crema aprovecha el efecto de meta cercana: cuanto menos falta, más cuesta dejarlo. No hay cuenta regresiva ni amenaza; la tensión la pone el dibujo incompleto. Y como el pico amanece en blanco cada día, ayer no pesa: siempre se empieza de nuevo.

**Pinchulear a Toco.**

| Se desbloquea en | Arreglo |
| :--- | :--- |
| Rama 2 | Cinta del sombrero en cuatro colores: verde, rosada, amarilla y celeste |
| Rama 3 | Pintura "Monte": el pico se pinta de verde claro a verde monte |
| Rama 5 | Pintura "Carnaval": cada tramo de un color distinto de la paleta |
| Rama 7 | Flor de tajibo en el sombrero |
| Rama 10 | Pintura "La copa": tramos dorados con la punta rosada |

La pintura por defecto se llama "Atardecer". Toda pintura respeta dos reglas de lectura: el tramo sin pintar siempre es crema y los tramos siempre se separan con línea de tinta.

**Cómo se ve.** En "Hoy", Toco ocupa el centro de la portada. En pantallas pequeñas y en la barra de navegación se usa solo la cabeza con el pico, que conserva el dato del día.

## 7. Equipo: la comparsa

Un proyecto es una comparsa que sale de la plaza y cruza la ciudad. El mapa es el de Santa Cruz reducido a lo esencial: la plaza al centro, cinco anillos y el río a la izquierda.

| Hito | Nombre | Qué cambia en el dibujo |
| :---: | :--- | :--- |
| 20 % | 1er anillo · Salida de la plaza | Se pinta de verde el primer anillo y aparece el punto naranja de la comparsa |
| 40 % | 2do anillo · Se suma el barrio | Se pinta el segundo y sobre cada anillo cruzado quedan las iniciales de quienes aportaron en ese tramo |
| 60 % | 3er anillo · Media ciudad | Se pinta el tercero y se marcan las avenidas que salen de la plaza hasta ahí |
| 80 % | 4to anillo · Ya se oye la tamborita | Se pinta el cuarto y una fila de banderines rodea el mapa |
| 100 % | 5to anillo · Buri | Todo el mapa en verde, una flor de tajibo sobre cada anillo y Toco con el sombrero en alto |

| Mecánica del motor | En la comparsa |
| :--- | :--- |
| Aporte por miembro | Lista de comparseros con actividades cumplidas y días con aporte |
| Constante | **Tiluchi de la semana**: más días con aporte; si hay empate, se comparte |
| Empujón | **Abrió anillo**: completó la actividad que cruzó un anillo |
| Rescate | **Dio una mano**: tomó y completó una actividad con pedido de ayuda |
| Ánimos | **Invitar un somó**: hasta tres por día; quien lo recibe ve "Sofía te invitó un somó". No da cuñapés |
| Pedido de ayuda | **Pedir una mano**: la actividad lleva una etiqueta ámbar "Pidió una mano" y cualquier comparsero puede tocar "Dar una mano" |
| Clasificación opcional | **La punta de la comparsa**: apagada por defecto; semanal y solo dentro de la comparsa |
| Cierre | **Buri**: +100 cuñapés a cada comparsero con aporte, lámina "La bandada de parabas" y el mapa terminado queda guardado como recuerdo |

Las iniciales sobre cada anillo son el detalle social del mundo: el mapa terminado dice quién empujó cada tramo, sin ordenar a nadie.

## 8. Insignias: el Álbum del monte

Cada insignia es una lámina. Sin ganar se ve en silueta con su criterio escrito, salvo las secretas. Los nombres locales de animales y plantas están **sin confirmar**, excepto curucusí, toborochi, motacú, achachairú, pahuichi y tutuma.

| Insignia del motor | Lámina | Criterio | Por qué esa lámina |
| :--- | :--- | :--- | :--- |
| Primer paso | El curucusí | Completar la primera actividad | La primera lucecita |
| Día redondo | El tucán | Primer pico pintado | Toco de cuerpo entero |
| Semana entera | El tajibo | Jenecherú de 7 días | La primera florada |
| Mes entero | El toborochi | Jenecherú de 30 días | Guarda agua para la seca |
| Cien días | El bibosi | Jenecherú de 100 días | El árbol que tarda años en hacerse |
| Regreso | La peta | Volver a un día activo tras apagarse el jenecherú | Llega a su paso, pero llega |
| Puntual | El piyo | Diez únicas antes de vencer | Nadie le gana corriendo |
| Cuota firme | El motacú | Cuatro semanas cumpliendo una actividad de N veces por semana | Da palma todo el año |
| Al día | El achachairú | Cero actividades vencidas | Cosecha completa |
| Primer proyecto | El pahuichi | Crear una comparsa y vincular a alguien | La primera casa |
| Buen anfitrión | La tutuma | Tres invitaciones aceptadas | Lo que se sirve para compartir |
| Primer hito | El jochi | Cruzar el 1er anillo | El que abre senda |
| Proyecto cerrado | La bandada de parabas | Cerrar el 5to anillo | Llegaron juntas |
| Mano amiga | La capiguara | Tres veces "Dio una mano" | Se lleva bien con todos |
| Secreta 1 | El matico | Cumplir una actividad antes de las 7:00, cinco veces | Canta al amanecer |
| Secreta 2 | El sumurucucu | Cumplir una actividad después de las 22:00, cinco veces | El búho del monte |
| Secreta 3 | El tigre | Pico pintado siete días seguidos | Casi nadie lo ve |

## 9. Colección y sorpresas: visitas en la rama

Regla del motor sin cambios: en cada día redondo, 1 de cada 4 veces llega una visita; tras siete días redondos sin visita, la octava es segura. La visita se elige con la misma semilla pura; las raras pesan la cuarta parte que las comunes. La visita se queda junto a Toco hasta el cambio de día y después vive en el álbum.

| N.º | Visita | Tipo | N.º | Visita | Tipo |
| :---: | :--- | :--- | :---: | :--- | :--- |
| 1 | Picaflor | Común | 9 | Orquídea del monte | Común |
| 2 | Mariposa azul | Común | 10 | Flor de patujú | Común |
| 3 | Sayubú | Común | 11 | Tatú | Común |
| 4 | Cardenal | Común | 12 | Tucancillo | Común |
| 5 | Cotorra | Común | 13 | Perezoso | Rara |
| 6 | Rana de árbol | Común | 14 | Borochi | Rara |
| 7 | Abeja señorita | Común | 15 | Paraba azul | Rara |
| 8 | Chicharra | Común | | | |

Tres decisiones de diseño:

- **Las visitas llegan y se van.** El álbum guarda el recuerdo de la visita, no al animal. Nada se captura ni se enjaula.
- **No hay piezas de temporada.** Ninguna visita deja de estar disponible; el álbum no castiga a quien llega tarde.
- **El perezoso aparece despierto y curioso**, nunca en la hamaca. Es fauna querida de la ciudad, no un chiste.

## 10. Estados de Toco

| Estado | Aspecto | Frase |
| :--- | :--- | :--- |
| Esperando | De perfil, cabeza ladeada, pico en crema, sombrero derecho | "El pico amaneció sin color. ¿Por cuál empezamos?" |
| Animando | Un ala levantada, primer tramo recién pintado | "¡Primer tramo pintado! Dale nomás." |
| Feliz | Ojo en arco, sombrero echado hacia atrás, pecho inflado | "Ya van 3 de 5. Dos más y queda entero." |
| Celebrando | Alas abiertas, sombrero en el aire, flores cayendo, pico entero | "¡Pico pintado! Hoy quedó de punta a punta." |
| Preocupada | Toco abriga con un ala el tizón encendido; sombrero bajo | "El jenecherú sigue encendido. Con una actividad alcanza." |
| Descansando | En la hamaca colgada de la rama, sombrero sobre los ojos | "Hoy toca siesta. El jenecherú queda bien guardado." |

En "preocupada", Toco cuida el fuego: no mira a la persona ni la señala. La preocupación es por la racha, no un reproche.

## 11. Bucles y recorrido del jugador

**Bucle del día.** Entrar y ver el pico; cumplir y ver pintarse un tramo; cerrar el pico; quizá recibir visita; al otro día, pico en blanco.

**Bucle de la semana.** La florada suma una fila; se anuncia tiluchi de la semana; el jenecherú llega a múltiplo de siete y deja una hamaca.

**Bucle de la comparsa.** Aportes de todos; el punto naranja avanza; se cruza un anillo y el mapa cambia; al 5to anillo, buri.

| Momento | Qué pasa | Qué se desbloquea |
| :--- | :--- | :--- |
| **Día 1** | Elige meta, crea y cumple su primera actividad, pinta el primer tramo | Lámina "El curucusí", una hamaca de regalo, rama 1 |
| Día 2 | Sube a la rama 2 | Cinta del sombrero (primer pinchuleo) |
| **Semana 1** | Primer pico pintado, primera visita posible, jenecherú de 7 días | Láminas "El tucán" y "El tajibo", segunda hamaca, florada con su primera fila |
| Semana 2 | Crea o se suma a una comparsa; rama 5 | Mapa de anillos, somó, pedir una mano |
| **Mes 1** | Cruza anillos, recibe reconocimientos, llena medio álbum de visitas | "El toborochi" al día 30, ramas 6 y 7, pintura "Carnaval" |

El primer día no se muestran el álbum completo, las visitas ni la comparsa. Aparecen cuando la persona ya domina lo básico.

## 12. Línea base y métricas

Plan de medición del motor (semana 0 sin capa de juego, semanas 1 y 2 con ella) más tres indicadores propios.

| Métrica | Fórmula | Qué comprueba |
| :--- | :--- | :--- |
| **Cierre del pico** (la principal) | Días redondos sobre días en que se llegó a faltar una sola actividad | Si el tramo en crema empuja a terminar |
| Tasa de día redondo | Días redondos sobre días con actividades programadas | OE2 |
| Visitas al álbum | Personas que abren "Mi tajibo" al menos una vez por semana | Si la colección interesa al explorador |
| Comprensión del vocabulario | Aciertos al preguntar "¿qué es el jenecherú?" y "¿qué es una hamaca?" tras cinco minutos de uso | Si las palabras ayudan o estorban |
| Recuperación | Rachas salvadas con hamaca o reanudadas en tres días, sobre rachas interrumpidas | OE5 |

**Cómo comprobarlo.** El selector de textos permite una comparación limpia: mitad del grupo con el vocabulario del mundo y mitad con "Palabras comunes", con el mismo diseño. Si la comprensión baja de 80 % con el vocabulario del mundo, se reducen palabras antes de publicar. No hay datos todavía; cualquier número aquí sería inventado.

## 13. Riesgos éticos propios

| Riesgo | Freno |
| :--- | :--- |
| Caricatura de lo cruceño | Toco es un tucán con sombrero, no un personaje que imita un acento. El habla se limita al voseo y a palabras revisadas |
| El descanso leído como flojera | La hamaca se gana con siete días de constancia; la siesta la elige la persona. Los textos dicen "descanso", nunca "flojera" |
| La sorpresa como mecánica de azar | Sin pago, sin compra, sin ventaja, con garantía y sin caducidad |
| Completismo ansioso | El álbum no muestra porcentaje ni cuenta lo que falta en la portada; solo se ve dentro de "Mi tajibo" |
| Miedo a apagar el jenecherú | Hamaca automática, siesta, viaje y el mensaje "la brasa quedó" con la mejor racha |
| Fauna tratada como trofeo | Las visitas no se capturan; el álbum guarda recuerdos |
| Palabras mal usadas | Glosario con estado de verificación en `propuesta.md` y revisión local obligatoria |

## 14. Trazabilidad

| Mecánica del mundo | Impulso | Perfil | Acción de Redux | Selector |
| :--- | :--- | :--- | :--- | :--- |
| Pintar un tramo | CD2 | Triunfador | `actividad/completada` | `selectPicoDeToco` |
| Pico pintado | CD2 | Triunfador | Derivado | `selectProgresoHoy` |
| Cuñapés | CD2 | Triunfador | `actividad/completada` | `selectPuntos` |
| Subir de rama | CD2, CD4 | Triunfador | Derivado | `selectRamaDeToco` |
| Meta que divide el pico | CD3 | Todos | `ajustes/metaCambiada` | `selectPicoDeToco` |
| Pinchulear a Toco | CD3, CD4 | Explorador | `ajustes/arregloCambiado` | `selectArreglosDisponibles` |
| Jenecherú | CD8 | Triunfador | Derivado de eventos | `selectRacha` |
| Hamaca, siesta y viaje | CD8 con freno | Todos | `racha/protectorUsado`, `ajustes/pausaActivada` | `selectRacha` |
| Florada del tajibo | CD4 | Triunfador | Derivado | `selectConstancia` |
| Álbum del monte | CD4, CD2 | Explorador | Derivado | `selectInsignias` |
| Visita en la rama | CD7, CD4 | Explorador | Derivado con semilla | `selectColeccion` |
| Cruzar un anillo | CD1, CD5 | Socializador | `actividad/completada` con `proyectoId` | `selectAvanceProyecto` |
| Iniciales en el anillo | CD5 | Socializador | Derivado | `selectAvanceProyecto` |
| Invitar un somó | CD5 | Socializador | `animo/enviado` | `selectAnimos` |
| Pedir y dar una mano | CD5 | Socializador | `ayuda/pedida`, `ayuda/tomada` | `selectPedidosDeAyuda` |
| Tiluchi de la semana | CD5 | Socializador | Derivado | `selectReconocimientos` |
| La punta de la comparsa | CD5 | Competidor | `proyecto/clasificacionCambiada` | `selectClasificacionSemanal` |
| Estado de Toco | CD1, CD3 | Todos | Derivado | `selectEstadoMascota` |
