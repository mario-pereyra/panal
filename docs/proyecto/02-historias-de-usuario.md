# Historias de usuario de Panal

Cada historia dice quién quiere qué y para qué, y cómo se comprueba que está hecha. El producto está definido en [`01-prd.md`](01-prd.md); las pantallas, en [`03-pantallas.md`](03-pantallas.md).

## Tabla de contenidos

1. [Cómo leer este documento](#1-cómo-leer-este-documento)
2. [Resumen por épica](#2-resumen-por-épica)
3. [Épica 1. Cuenta y primer vuelo](#3-épica-1-cuenta-y-primer-vuelo)
4. [Épica 2. Celdas](#4-épica-2-celdas)
5. [Épica 3. El día](#5-épica-3-el-día)
6. [Épica 4. Colmenas y enjambre](#6-épica-4-colmenas-y-enjambre)
7. [Épica 5. Reportes](#7-épica-5-reportes)
8. [Épica 6. Mi vuelo](#8-épica-6-mi-vuelo)
9. [Épica 7. Aplicación instalable y adaptable](#9-épica-7-aplicación-instalable-y-adaptable)
10. [Trazabilidad con el enunciado](#10-trazabilidad-con-el-enunciado)
11. [Cuándo una historia está hecha](#11-cuándo-una-historia-está-hecha)

## 1. Cómo leer este documento

- **Prioridad.** *Debe*: sin ella no hay entrega. *Debería*: entra en la versión 1 si no pone en riesgo la fecha. *Podría*: versión 1.1.
- **Criterios.** Están escritos como situación, acción y resultado, para poder convertirlos en pruebas.
- **Pantalla y requisito.** Los identificadores `P` son los de [`03-pantallas.md`](03-pantallas.md) y los `RF`, los de [`01-prd.md`](01-prd.md#7-requisitos-funcionales).
- **Personas.** Ana se organiza sola, Luis es integrante de un equipo y Sofía coordina.

## 2. Resumen por épica

| Épica | Historias | Debe | Debería | Podría | Caso de uso del enunciado |
| :--- | :---: | :---: | :---: | :---: | :--- |
| 1. Cuenta y primer vuelo | HU-01 a HU-05 | 4 | 0 | 1 | Registro e iniciar sesión |
| 2. Celdas | HU-06 a HU-12 | 7 | 0 | 0 | Actividades únicas y recurrentes |
| 3. El día | HU-13 a HU-19 | 4 | 1 | 2 | Actividades únicas y recurrentes |
| 4. Colmenas y enjambre | HU-20 a HU-29 | 6 | 1 | 3 | Gestión de proyectos |
| 5. Reportes | HU-30 a HU-34 | 4 | 0 | 1 | Reporte con gráficas |
| 6. Mi vuelo | HU-35 a HU-37 | 2 | 1 | 0 | Transversal |
| 7. Aplicación instalable y adaptable | HU-38 a HU-42 | 4 | 1 | 0 | Pedido propio |
| **Total** | **42** | **31** | **4** | **7** | |

HU-25 cuenta como *Debe*: los cuadros son obligatorios; su cierre con colmenar es *Debería*.

## 3. Épica 1. Cuenta y primer vuelo

### HU-01. Crear mi cuenta

Como persona nueva, quiero crear mi cuenta con mi nombre, correo y contraseña, para tener mi propio panal.

**Debe** · P02 · RF-01

- Con datos válidos, al enviar, la cuenta se crea, la sesión queda iniciada y llego a "Primer vuelo".
- Si el correo ya está registrado, veo "Ese correo ya tiene un panal. ¿Quieres entrar?" con un enlace a "Entrar al panal".
- Si la contraseña tiene menos de 8 caracteres, el botón no envía y el campo dice qué falta.
- Mientras escribo la contraseña, tres celdas se llenan según su fuerza, con un texto que lo dice ("Débil", "Buena", "Fuerte").
- El correo se guarda sin espacios y en minúsculas; dos cuentas no pueden diferir solo en mayúsculas.

### HU-02. Entrar a mi cuenta

Como persona registrada, quiero entrar con mi correo y contraseña, para ver mi día.

**Debe** · P01 · RF-01

- Con credenciales correctas llego a "Hoy".
- Con credenciales incorrectas veo "El correo o la contraseña no coinciden. Prueba otra vez.", sin indicar cuál de los dos falló.
- Si todavía no terminé "Primer vuelo", entro ahí y no a "Hoy".
- Tras cinco intentos fallidos seguidos, hay que esperar un minuto antes de volver a intentar.

### HU-03. Seguir dentro y salir cuando quiera

Como persona registrada, quiero que la aplicación me recuerde y poder cerrar sesión, para no escribir mi contraseña cada vez y proteger mi cuenta en equipos compartidos.

**Debe** · P01, P11 · RF-01

- Si cierro el navegador y vuelvo dentro de 30 días, sigo dentro.
- Al pulsar "Cerrar sesión" vuelvo a "Entrar al panal" y la sesión deja de servir en el servidor.
- Si abro una dirección interna sin sesión, voy a "Entrar al panal" y, al entrar, vuelvo a la dirección que buscaba.
- Si mi sesión vence mientras uso la aplicación, veo un aviso y, tras entrar, no pierdo lo que estaba viendo.

### HU-04. Hacer mi primer vuelo

Como persona recién registrada, quiero que Zum me guíe para elegir mi meta y cumplir mi primera actividad, para entender cómo funciona y ganar algo desde el primer minuto.

**Debe** · P03 · RF-02

- Paso 1: elijo un panal de 3, 5 o 7 celdas. El de 5 viene elegido.
- Paso 2: creo mi primera celda escribiendo un título o tocando una sugerencia.
- Paso 3: lleno esa celda. Recibo sus gotas, el sello "Primera celda" y una reserva de miel de regalo, y llego a "Hoy".
- Si salgo a mitad del recorrido, al volver retomo el paso donde quedé.
- El recorrido se hace una sola vez; después no vuelve a aparecer.

### HU-05. Recuperar mi contraseña

Como persona que olvidó su contraseña, quiero recibir un enlace por correo, para volver a entrar.

**Podría** (versión 1.1) · P01 · RF-01

- Al pedirlo, siempre veo el mismo mensaje, exista o no el correo, para no revelar quién tiene cuenta.
- El enlace sirve una sola vez y vence en una hora.
- Al cambiar la contraseña se cierran las demás sesiones abiertas.

## 4. Épica 2. Celdas

### HU-06. Crear una actividad única

Como Ana, quiero anotar algo que se hace una sola vez, con fecha y prioridad, para no olvidar una entrega.

**Debe** · P06 · RF-03

- El título es obligatorio y admite hasta 80 caracteres. La fecha, la prioridad alta y la colmena son opcionales.
- Antes de guardar veo cuánto vale: "Esta celda vale +25 gotas de miel", o +35 si la marco como prioridad alta.
- Al guardar, aparece en "Hoy" si vence hoy, si ya venció o si no tiene fecha; si vence más adelante, aparece en "Próximas".
- Solo puedo tener dos actividades de prioridad alta por día; al intentar una tercera, se explica el límite.

### HU-07. Crear una actividad de ronda

Como Ana, quiero anotar algo que se repite, eligiendo cómo se repite, para sostener una costumbre.

**Debe** · P06 · RF-04

- Puedo elegir entre cuatro repeticiones: todos los días, ciertos días de la semana, un número de veces por semana o un día del mes.
- Mientras la configuro, leo la regla en palabras: "Lunes, miércoles y viernes" o "3 veces por semana".
- Veo que vale +10 gotas cada vez que la cumpla.
- Con "ciertos días" aparece en "Hoy" solo esos días. Con "veces por semana" aparece todos los días hasta cumplir la cuota de la semana, y después deja de aparecer hasta el lunes.
- Con "día del mes", si el mes no tiene ese día, aparece el último día del mes.

### HU-08. Llenar una celda

Como Ana, quiero marcar una actividad como cumplida con un toque, para ver mi avance al instante.

**Debe** · P04, P05, P08 · RF-05, RF-06

- Al tocar el hexágono, la celda se llena de inmediato, suben las gotas y se llena la celda correspondiente del panal de hoy, sin esperar al servidor.
- Si el servidor no confirma, la celda vuelve a su estado anterior y un aviso lo explica.
- Si toco dos veces seguidas o la red repite el envío, la actividad cuenta una sola vez.
- Una actividad de ronda se puede llenar una sola vez por día.
- La celda se puede llenar también con el teclado y anuncia su estado a los lectores de pantalla.

### HU-09. Deshacer una celda llena

Como Ana, quiero desmarcar una actividad que marqué por error, para que mi registro sea verdadero.

**Debe** · P04, P05 · RF-05

- Al desmarcarla, la celda queda pendiente y sus gotas desaparecen de mi total, sin ninguna penalización.
- Si al desmarcar el panal deja de estar cerrado, también se retira el premio por cerrarlo.
- Los sellos ya ganados se conservan.
- Solo quien llenó la celda puede desmarcarla.

### HU-10. Editar, posponer y archivar

Como Ana, quiero corregir, mover de fecha o guardar una actividad, para mantener mi lista al día.

**Debe** · P05, P06 · RF-03, RF-04

- Puedo cambiar el título, la fecha, la prioridad, la colmena y la repetición.
- "Posponer" ofrece "Mañana" y "Elegir fecha".
- Cambiar la repetición no altera los días ya cumplidos.
- "Archivar" la quita de "Hoy" y de las listas, pero conserva su historial y sus gotas. Desde "Archivadas" puedo recuperarla.

### HU-11. Ver y filtrar todas mis celdas

Como Ana, quiero ver todas mis actividades ordenadas, para planear mi semana.

**Debe** · P05 · RF-03

- Hay cuatro pestañas: "Hoy", "Próximas", "De ronda" y "Archivadas", cada una con su cantidad.
- Puedo filtrar por colmena y por prioridad.
- Las actividades de ronda con cuota muestran su avance de la semana con celdas pequeñas: "2 de 3 esta semana".
- Una pestaña vacía muestra un mensaje y un botón para crear, nunca una pantalla en blanco.

### HU-12. Ponerme al día con lo vencido

Como Ana, quiero ver qué se me pasó y poder cumplirlo igual, para ponerme al día sin sentir que ya no vale la pena.

**Debe** · P04, P05 · RF-06

- Una actividad única con fecha pasada sigue en "Hoy" con la etiqueta "Vencida".
- Al cumplirla vale 15 gotas en lugar de 25.
- Una actividad de ronda no se acumula: el día que no se cumplió queda sin llenar y no aparece como vencida.

## 5. Épica 3. El día

### HU-13. Ver mi día de un vistazo

Como Ana, quiero abrir la aplicación y entender en segundos cómo voy, para decidir qué hacer ahora.

**Debe** · P04 · RF-06, RF-13

- Veo el saludo de Zum, la fecha, el panal de hoy con tantas celdas como mi meta, mi racha y mis reservas.
- La frase de Zum corresponde a uno de sus seis estados y siempre incluye el dato: "Llevas 3 de 5 celdas llenas".
- Debajo veo mis celdas de hoy, el resumen de mi colmena más activa y mi constancia.
- Si no tengo actividades, veo "Tu panal de hoy está por estrenar. Crea tu primera celda." con el botón para crear.

### HU-14. Cerrar el panal de hoy

Como Ana, quiero que cumplir mi meta diaria se celebre, para sentir que el día quedó completo.

**Debe** · P04, P12 · RF-06, RF-12

- Al llenar la celda que completa mi meta, el panal se sella, recibo +20 gotas y aparece la celebración "¡Panal cerrado!".
- Si hoy tengo menos actividades programadas que mi meta, el panal se cierra al cumplirlas todas.
- Las celdas que llene después suman sus gotas, pero el premio por cerrar el panal se da una vez al día.
- La celebración se puede cerrar de inmediato y, con movimiento reducido, no tiene animación.
- Si coinciden varios logros, se muestran juntos en una sola ventana.

### HU-15. Mantener mi racha de vuelo

Como Ana, quiero que mis días seguidos cuenten y que un mal día no lo borre todo, para sostener la constancia sin angustia.

**Debe** · P04, P11 · RF-06

- La racha sube un día cuando lleno al menos una celda. El día cambia a las 03:00 de mi zona horaria.
- Si ayer no llené ninguna y tengo una reserva, se usa sola y hoy lo veo: "Ayer no hubo celdas, así que usamos una reserva de miel. Tu racha de 12 días sigue en vuelo. Te queda 1 reserva."
- Sin reserva, la racha vuelve a cero con un mensaje sin culpa que recuerda mi mejor racha.
- Cada 7 días de racha recibo +50 gotas y una reserva, con un máximo de dos guardadas.
- Un día sin actividades programadas no rompe la racha ni la suma.

### HU-16. Elegir mi día sin flores

Como Ana, quiero fijar un día de descanso a la semana, para parar sin perder mi racha.

**Debería** · P11 · RF-15

- En ajustes elijo un día de la semana como "día sin flores", o ninguno.
- Ese día Zum descansa, no se espera ninguna celda y la racha no se rompe.
- Si igual lleno una celda ese día, suma sus gotas con normalidad.
- El cambio rige desde la semana siguiente, para que no sirva para salvar el día de hoy.

### HU-17. Subir de oficio

Como Ana, quiero ver cuánto me falta para el siguiente nivel y que se celebre al llegar, para sentir que progreso.

**Debe** · P04, P11, P12 · RF-06, RF-12

- En la cabecera veo mi oficio actual: "Nivel 4 · Exploradora".
- En "Mi vuelo" veo cuántas gotas faltan: "Faltan 60 gotas para Recolectora".
- Al cruzar un umbral aparece la celebración "¡Nuevo oficio: Recolectora!".
- Si al deshacer una celda bajo del umbral, el oficio vuelve al anterior sin ningún aviso negativo.

### HU-18. Recibir una sugerencia de Zum

Como Ana, quiero que Zum me señale por cuál celda empezar y por qué, para no quedarme dudando frente a la lista.

**Podría** (versión 1.1) · P04 · RF-13

- Al entrar a "Hoy" con pendientes, Zum sugiere una celda y dice el motivo: vence hoy, es de tu colmena o su cuota semanal está en riesgo.
- "Voy" me lleva a esa celda. "Otra flor" cambia la sugerencia, hasta dos veces por visita.
- Seguir o ignorar la sugerencia no cambia las gotas.
- Se puede apagar en ajustes.

### HU-19. Encontrar una flor rara

Como Ana, quiero que de vez en cuando aparezca una sorpresa al cerrar el panal, para tener algo que coleccionar.

**Podría** (versión 1.1) · P11, P12 · RF-12

- Al cerrar el panal hay una posibilidad de 1 en 4 de que Zum traiga una miel nueva; tras siete cierres sin sorpresa, el octavo la trae seguro.
- La miel aparece en mi alacena de doce tarros. No hay repetidas mientras falten tarros.
- La sorpresa de un día es siempre la misma aunque recargue la página.
- Las mieles son decorativas: no dan gotas ni ventajas.

## 6. Épica 4. Colmenas y enjambre

### HU-20. Fundar una colmena

Como Sofía, quiero crear un proyecto con su nombre y su fecha de entrega, para organizar el trabajo del grupo.

**Debe** · P07 · RF-07

- El nombre es obligatorio; la descripción y la fecha de entrega son opcionales.
- Al crearla quedo como fundadora y entro a su detalle, con la invitación a sumar al enjambre.
- En "Colmenas" veo una tarjeta por cada colmena mía, con su avance, su enjambre y su cuadro actual.
- Sin colmenas veo "Todavía no tienes colmena. Funda una e invita a tu enjambre."

### HU-21. Invitar con un enlace

Como Sofía, quiero copiar un enlace de invitación, para sumar a mis compañeros sin pedirles nada más.

**Debe** · P09 · RF-08

- Al abrir "Invitar al enjambre" hay un enlace listo y un botón "Copiar" que confirma que se copió.
- El enlace vence a los 7 días y puedo anularlo antes; entonces se crea uno nuevo.
- Veo quiénes ya se unieron.
- En el teléfono, "Compartir" abre el menú de compartir del sistema.

### HU-22. Unirme a una colmena con un enlace

Como Luis, quiero abrir el enlace que me mandaron y quedar dentro del proyecto, para empezar a aportar.

**Debe** · P13 · RF-08

- Con sesión iniciada veo el nombre de la colmena, quién me invita y el botón "Unirme".
- Sin cuenta, primero me registro y, al terminar, quedo unido sin volver a abrir el enlace.
- Si el enlace venció o fue anulado veo "Esta invitación ya no está activa. Pide a tu enjambre un enlace nuevo."
- Si ya soy integrante, el enlace me lleva directo a la colmena.
- Al unirme recibo un color propio dentro de esa colmena.

### HU-23. Crear y asignar celdas de la colmena

Como Sofía, quiero crear las actividades del proyecto y decidir quién hace cada una, para repartir el trabajo.

**Debe** · P06, P08 · RF-09

- Cualquier integrante puede crear una celda dentro de la colmena.
- Una celda se puede asignar a una persona o dejar "Libre".
- La celda asignada aparece en el "Hoy" de esa persona con el nombre de la colmena.
- Una celda libre la puede llenar cualquier integrante.
- Cambiar la asignación no cambia quién la llenó, si ya estaba llena.

### HU-24. Ver el avance de la colmena

Como Luis, quiero ver cuánto falta y quién aportó, para saber en qué va el grupo sin preguntar.

**Debe** · P08 · RF-10

- Veo una rejilla con una celda por actividad: las llenas, con el color y la inicial de quien las llenó; las pendientes, vacías.
- Leo el porcentaje, el cuadro actual y cuánto falta para el siguiente: "Cuadro 3 de 5. Faltan 6 celdas para el cuarto".
- Veo la lista del enjambre con las celdas aportadas por cada persona.
- Lo que otra persona llenó aparece al volver a la pestaña o en menos de un minuto, sin recargar.
- La información se entiende sin depender del color: hay iniciales, cifras y una tabla equivalente.

### HU-25. Celebrar un cuadro y cerrar la colmena

Como integrante, quiero que cada avance grande del grupo se reconozca, para sentir que avanzamos juntos.

**Debe** (cuadros) y **Debería** (cierre con colmenar) · P08, P12 · RF-10, RF-12

- Al llegar al 20, 40, 60 y 80 %, quienes aportaron en ese tramo reciben +30 gotas y ven la celebración al entrar.
- Al llegar al 100 %, cada integrante con al menos un aporte recibe +100 gotas y el sello "Enjambrazón".
- La colmena cerrada pasa al colmenar, con su nombre y los nombres del enjambre en orden alfabético.
- Si se deshace la celda que cerró un cuadro, el premio de ese cuadro se retira hasta volver a alcanzarlo.

### HU-26. Salir de una colmena o quitar a alguien

Como Sofía, quiero poder quitar a quien ya no participa, y como Luis, poder salir, para que el enjambre refleje al equipo real.

**Debería** · P08 · RF-08

- La fundadora puede quitar a cualquier integrante; cada integrante puede salir por su cuenta. Las dos acciones piden confirmación.
- Las celdas que esa persona llenó se conservan con su nombre; sus celdas pendientes quedan libres.
- La fundadora no puede salir sin antes pasar la colmena a otra persona.

### HU-27. Mandar un zumbido

Como Luis, quiero darle ánimo a alguien del enjambre con un toque, para acompañar sin escribir.

**Podría** (versión 1.1) · P08

- Puedo mandar hasta tres zumbidos por día.
- La otra persona ve "Luis te mandó un zumbido" la próxima vez que entra.
- No se puede mandar a quien está en su día sin flores o en invernada.
- No da gotas.

### HU-28. Llamar al enjambre

Como Luis, quiero avisar que estoy trabado con una celda, para que alguien pueda tomarla.

**Podría** (versión 1.1) · P08

- Al marcarla, la celda muestra "Llama al enjambre" y cualquier integrante ve "Tomar celda".
- Quien la toma pasa a tenerla asignada.
- Pedir ayuda no resta gotas ni afecta la racha.

### HU-29. Invitar por correo

Como Sofía, quiero mandar la invitación a un correo, para no depender de un chat.

**Podría** (versión 1.1) · P09 · RF-08

- Al escribir un correo válido, esa persona recibe el enlace.
- Veo las invitaciones pendientes y puedo reenviarlas o anularlas.

## 7. Épica 5. Reportes

### HU-30. Ver mi constancia

Como Ana, quiero ver mis últimas semanas en un mapa, para saber qué tan constante fui.

**Debe** · P04, P10 · RF-11

- Veo cinco semanas, un día por celda: sin actividad, día de vuelo, mitad o más de la meta, panal cerrado y día sin flores.
- Hoy se distingue con un contorno y los días futuros, con una línea punteada.
- Al pasar el cursor o tocar un día, leo la fecha y cuántas celdas llené.
- Una frase lo resume ("Cerraste el panal 9 de los últimos 14 días") y hay una tabla equivalente para lectores de pantalla.
- Sin datos veo "Aquí aparecerá tu panal de constancia cuando llenes tu primera celda."

### HU-31. Ver cómo voy con cada actividad de ronda

Como Ana, quiero ver el cumplimiento de cada costumbre, para saber cuál estoy sosteniendo y cuál no.

**Debe** · P10 · RF-11

- Por cada actividad de ronda veo una tira con los últimos siete días que tocaba y su porcentaje: "6 de 7 · 86 %".
- La lista se ordena de menor a mayor cumplimiento, para ver primero la que necesita atención.
- Solo cuentan los días en que la actividad tocaba.

### HU-32. Ver mi ritmo de la semana

Como Ana, quiero ver cuántas celdas llené cada día y de qué tipo, para entender mi ritmo.

**Debe** · P10 · RF-11

- Veo una columna por día de la semana actual, con su cifra encima.
- Una frase lo resume: "21 celdas esta semana. Tu mejor día fue el jueves."
- Veo cuántas fueron únicas y cuántas de ronda.
- Puedo comparar con la semana anterior.

### HU-33. Ver el aporte de cada persona

Como Sofía, quiero ver cuánto aportó cada integrante, para repartir mejor lo que falta.

**Debe** · P08, P10 · RF-10, RF-11

- Por cada colmena veo el aporte de cada integrante con su color, su nombre y su cifra.
- El orden es alfabético, no por cantidad: no es una tabla de posiciones.
- Veo también cuántas celdas quedan sin asignar.

### HU-34. Elegir el periodo del reporte

Como Ana, quiero cambiar el periodo, para ver más atrás.

**Podría** (versión 1.1) · P10 · RF-11

- Puedo elegir entre "5 semanas", "3 meses" y "Todo".
- Las frases de resumen cambian con el periodo elegido.

## 8. Épica 6. Mi vuelo

### HU-35. Ver mi oficio y mis sellos

Como Ana, quiero ver mi nivel y mis insignias, ganadas y por ganar, para saber qué logré y qué me falta.

**Debe** · P11 · RF-12

- Veo la escalera de diez oficios con el mío marcado y una barra con las gotas que faltan.
- Veo los 14 sellos de cera: los ganados, con su fecha; los que faltan, en hueco, con su criterio y su progreso ("3 de 7 días").
- Los sellos secretos no aparecen hasta que los gano.
- Hay un enlace a "Cómo se ganan las gotas", con todas las reglas.

### HU-36. Cambiar mis ajustes

Como Ana, quiero ajustar mi meta y mis preferencias, para que la aplicación se adapte a mí.

**Debe** · P11 · RF-15

- Puedo cambiar mi meta diaria entre 3, 5 y 7; el cambio rige desde mañana.
- Puedo cambiar mi nombre y mi zona horaria.
- Puedo reducir las animaciones aunque mi sistema no lo pida.
- Puedo cerrar sesión.

### HU-37. Pausar con una invernada

Como Ana, quiero pausar unos días cuando viajo o estoy enferma, para volver sin haber perdido nada.

**Debería** · P11 · RF-15

- Puedo activar una pausa de hasta 14 días.
- Durante la pausa la racha no cambia, Zum descansa y no se espera nada.
- Al volver antes, la pausa termina sola cuando lleno una celda.
- Solo se puede activar una pausa nueva cuando pasaron 7 días desde la anterior.

## 9. Épica 7. Aplicación instalable y adaptable

### HU-38. Instalar Panal en mi teléfono

Como Ana, quiero tener Panal como una aplicación más en mi teléfono, para abrirla con un toque.

**Debe** · P11, aviso de instalación · RF-14

- En Android y en computador aparece la opción "Instalar Panal" cuando el navegador lo permite.
- En iPhone veo las instrucciones: Compartir y "Agregar a inicio".
- Instalada, abre a pantalla completa, con su icono y su color, sin la barra del navegador.
- Si ya está instalada, la opción no aparece.

### HU-39. Abrir Panal sin conexión

Como Ana, quiero poder mirar mi día aunque no tenga señal, para consultar qué me toca.

**Debe** · todas · RF-14

- Sin conexión, la aplicación abre y muestra lo último que vi, con un aviso "Sin conexión".
- Las acciones que guardan cambios se muestran desactivadas y explican por qué.
- Al volver la conexión, el aviso desaparece y los datos se actualizan solos.
- Si nunca abrí la aplicación con conexión, veo una pantalla que lo explica en lugar de un error del navegador.

### HU-40. Usar Panal en el teléfono y en el computador

Como Ana, quiero la misma aplicación en cualquier pantalla, para usarla donde esté.

**Debe** · todas · RNF-05

- Desde 360 px de ancho todo se puede leer y tocar, sin desplazamiento horizontal.
- En teléfono la navegación va abajo, con cuatro destinos y el botón de crear; en computador va arriba.
- Las zonas táctiles miden al menos 44 px.
- Las ventanas se muestran como hojas que suben desde abajo en el teléfono y como ventanas centradas en el computador.

### HU-41. Usar Panal con teclado y lector de pantalla

Como persona que no usa el ratón o no ve la pantalla, quiero poder hacer todo, para no quedar fuera.

**Debe** · todas · RNF-04, RNF-07

- Todas las acciones se alcanzan con el teclado, en un orden lógico y con el foco siempre visible.
- Las ventanas atrapan el foco, se cierran con Escape y lo devuelven a donde estaba.
- Cada gráfica tiene un texto que la resume y una tabla equivalente.
- Los cambios importantes (celda llena, gotas ganadas, errores) se anuncian a los lectores de pantalla.
- Con movimiento reducido, las animaciones se reemplazan por cambios de estado.

### HU-42. Recibir la versión nueva

Como Ana, quiero saber cuándo hay una versión nueva, para no quedarme con una vieja guardada.

**Debería** · todas · RF-14

- Cuando hay una versión nueva aparece el aviso "Hay una versión nueva de Panal" con el botón "Actualizar".
- Actualizar no cierra mi sesión ni pierde lo que estaba escribiendo.

## 10. Trazabilidad con el enunciado

| Caso de uso del enunciado | Historias que lo cumplen | Pantallas |
| :--- | :--- | :--- |
| Registro e iniciar sesión | HU-01, HU-02, HU-03, HU-04 | P01, P02, P03 |
| Creación de actividades únicas y recurrentes | HU-06 a HU-12, HU-13, HU-14, HU-15 | P04, P05, P06 |
| Gestión de proyectos (vincular usuarios) | HU-20 a HU-25 | P07, P08, P09, P13 |
| Reporte (uso de gráficas) | HU-30 a HU-33, HU-24 | P04, P08, P10 |
| "Mostrar el progreso con gráficas" | HU-13, HU-24, HU-30, HU-31, HU-32, HU-35 | P04, P08, P10, P11 |
| "De manera individual o en equipo" | Épicas 2 y 3 (individual), épica 4 (equipo) | |
| "Plataforma gamificada" | HU-04, HU-14, HU-15, HU-17, HU-25, HU-35 | P03, P04, P11, P12 |
| Redux obligatorio | Todas: el estado de cada pantalla sale del store | |
| Base de datos libre | Todas las que guardan datos | |

## 11. Cuándo una historia está hecha

1. Cumple todos sus criterios en el computador y en un teléfono de 360 px.
2. Sus reglas están en el motor, con pruebas, y no repetidas en los componentes.
3. Su estado vive en Redux: en un slice propio o en RTK Query.
4. Tiene resueltos sus estados de carga, vacío y error.
5. Se puede usar con teclado y sus imágenes tienen texto alternativo.
6. `vp check` y `vp test` pasan.
