# PRD de Panal

Documento de requisitos del producto. Dice qué se construye, para quién y cómo se sabrá que está bien. El cómo técnico está en [`04-stack-y-arquitectura.md`](04-stack-y-arquitectura.md).

Estado: **borrador para tu revisión**. Las preguntas abiertas están en la [sección 12](#12-preguntas-abiertas).

## Tabla de contenidos

1. [Resumen](#1-resumen)
2. [Problema](#2-problema)
3. [Objetivos y cómo se miden](#3-objetivos-y-cómo-se-miden)
4. [Para quién es](#4-para-quién-es)
5. [El mundo de Panal](#5-el-mundo-de-panal)
6. [Alcance por versión](#6-alcance-por-versión)
7. [Requisitos funcionales](#7-requisitos-funcionales)
8. [Reglas del juego](#8-reglas-del-juego)
9. [Requisitos no funcionales](#9-requisitos-no-funcionales)
10. [Restricciones y supuestos](#10-restricciones-y-supuestos)
11. [Riesgos](#11-riesgos)
12. [Preguntas abiertas](#12-preguntas-abiertas)
13. [Cuándo está terminado](#13-cuándo-está-terminado)

## 1. Resumen

Panal es una aplicación web gamificada para organizar y cumplir actividades, por cuenta propia o en equipo. Funciona en el navegador del computador y se instala en el teléfono como una aplicación. Cada actividad cumplida llena una celda de un panal; los proyectos en equipo son colmenas que se llenan entre todos; y Zum, una abeja, acompaña y celebra. El avance se entiende de un vistazo, con gráficas hechas de hexágonos.

Es el proyecto final de la materia Gamificación y Programación Funcional. Cumple los cuatro casos de uso del enunciado y sus tres requisitos técnicos.

## 2. Problema

Quien estudia o trabaja en equipo suele tener una lista de pendientes que crece y no dice nada: no muestra cuánto se avanzó, no distingue lo que se repite de lo que se hace una vez, y en los trabajos en grupo no deja ver quién aportó ni cuánto falta. Sin una señal de progreso, las costumbres se abandonan en la segunda semana y los proyectos se resuelven la última noche.

Las aplicaciones de tareas resuelven el registro, no la motivación. Las de hábitos motivan, pero no sirven para un proyecto en equipo. Panal junta las dos cosas con una sola idea visual: todo avance es una celda que se llena.

## 3. Objetivos y cómo se miden

| N.º | Objetivo | Indicador | Meta inicial |
| :--- | :--- | :--- | :--- |
| OE1 | Que la persona complete su primera actividad el mismo día en que se registra | Registros con una actividad cumplida en el día 1 | 70 % |
| OE2 | Sostener la constancia en actividades recurrentes | Días cumplidos por semana por persona activa | 4 de 7 |
| OE3 | Que el avance de un proyecto se entienda sin leer listas | Tiempo para responder "¿cuánto falta y quién aportó?" en una prueba con usuarios | Menos de 10 segundos |
| OE4 | Repartir el aporte dentro de los equipos | Integrantes con al menos un aporte semanal | 80 % |
| OE5 | Retener sin presión excesiva | Rachas salvadas con una reserva frente a rachas abandonadas | Más salvadas que abandonadas |

Las metas son hipótesis: se ajustan cuando haya una primera medición. Para la entrega, OE3 se puede comprobar con tres o cuatro compañeros y un cronómetro.

## 4. Para quién es

| Persona | Qué busca | Qué le frustra hoy |
| :--- | :--- | :--- |
| **Ana, estudiante que se organiza sola.** Usa el teléfono durante el día y el computador para estudiar | Cumplir sus costumbres (repasar, caminar, practicar inglés) y no olvidar entregas | Las listas no le devuelven nada; pierde el hilo a la segunda semana |
| **Luis, integrante de un equipo.** Entra dos o tres veces por semana | Saber qué le toca, cuánto falta y sentir que su aporte se nota | No sabe en qué va el grupo hasta que alguien pregunta por chat |
| **Sofía, quien coordina el trabajo en grupo.** Arma el proyecto e invita al resto | Repartir tareas, ver quién está atascado y llegar a la entrega sin sorpresas | Tiene que perseguir a cada persona para saber el estado |

Fuera del público: equipos de empresa con permisos por rol, facturación o integraciones. Panal es para estudio y proyectos pequeños.

## 5. El mundo de Panal

Cada palabra del mundo nombra una mecánica. Este es el vocabulario que usa la interfaz.

| En Panal | Qué es |
| :--- | :--- |
| Celda | Una actividad. Se llena al cumplirla |
| Panal de hoy | La meta diaria: 3, 5 o 7 celdas. "Cerrar el panal" es cumplirla |
| Gotas de miel | Los puntos |
| Oficio | El nivel, del 1 al 10 (por ejemplo, nivel 4 "Exploradora") |
| Racha de vuelo | Días seguidos con al menos una celda llena |
| Reserva de miel | Protege la racha un día en que no se cumplió nada. Máximo 2 |
| Día sin flores | Día de descanso elegido; no rompe la racha |
| Invernada | Pausa de hasta 14 días; la racha queda congelada |
| Recurrente | Actividad que se repite según su regla (en la propuesta original, "de ronda") |
| Colmena | Un proyecto en equipo |
| Enjambre | El equipo de una colmena |
| Cuadro | Un hito de la colmena. Son cinco: al 20, 40, 60, 80 y 100 % |
| Zumbido | Un ánimo que se le manda a otra persona del enjambre |
| Llamar al enjambre | Pedir ayuda con una celda; cualquiera puede tomarla |
| Sello de cera | Una insignia. Hay 14 visibles y 3 secretas |
| Alacena de mieles | La colección: 12 mieles raras que Zum encuentra de vez en cuando |
| Zum | La mascota. Su estado refleja cómo va el día |

## 6. Alcance por versión

| | Versión 1: la entrega | Versión 1.1: si alcanza el tiempo | Fuera de alcance |
| :--- | :--- | :--- | :--- |
| **Cuenta** | Registro, inicio y cierre de sesión; recorrido inicial | Recuperar contraseña por correo | Inicio con Google u otras redes |
| **Actividades** | Únicas y recurrentes con cuatro tipos de repetición; cumplir, desmarcar, editar, posponer y archivar | Marcar celdas sin conexión | Subtareas, adjuntos, comentarios |
| **Juego** | Gotas, oficios, racha, reservas, panal de hoy, Zum con seis estados, celebración al cerrar el panal, sellos de cera | Alacena de mieles y sorpresa; sugerencia de Zum ("la danza") | Tienda, monedas, tablas globales de posiciones |
| **Equipo** | Colmenas, invitación por enlace, asignar celdas, avance con cuadros y aporte por persona | Zumbidos, "llamar al enjambre", reconocimientos de la semana, invitación por correo | Chat, roles y permisos finos |
| **Reportes** | Mapa de constancia, cumplimiento por actividad recurrente, celdas por día, reparto entre únicas y recurrentes | Elegir periodo ("Todo") | Exportar a PDF o Excel |
| **Plataforma** | Web adaptable de 360 px en adelante; instalable como PWA; abre sin conexión mostrando lo último visto | Notificaciones | Aplicación nativa en tiendas |

La versión 1 cubre por sí sola los cuatro casos de uso del enunciado. Lo de la versión 1.1 mejora la nota de gamificación, pero no es condición para entregar.

## 7. Requisitos funcionales

Las historias de usuario con sus criterios de aceptación están en [`02-historias-de-usuario.md`](02-historias-de-usuario.md).

| N.º | Requisito | Caso de uso del enunciado | Versión |
| :--- | :--- | :--- | :---: |
| RF-01 | Registro, inicio y cierre de sesión | Registro e iniciar sesión | 1 |
| RF-02 | Recorrido inicial: elegir la meta diaria y cumplir la primera actividad | Registro e iniciar sesión | 1 |
| RF-03 | Crear, editar, posponer y archivar actividades únicas | Actividades únicas y recurrentes | 1 |
| RF-04 | Crear y editar actividades recurrentes: todos los días, ciertos días de la semana, un número de veces por semana o un día del mes | Actividades únicas y recurrentes | 1 |
| RF-05 | Cumplir y desmarcar actividades con respuesta inmediata | Actividades únicas y recurrentes | 1 |
| RF-06 | Calcular gotas, oficio, racha y reservas | Actividades únicas y recurrentes | 1 |
| RF-07 | Crear colmenas con su fecha de entrega | Gestión de proyectos | 1 |
| RF-08 | Invitar y vincular personas por enlace; por correo en la 1.1 | Gestión de proyectos | 1 |
| RF-09 | Asignar celdas a integrantes de una colmena | Gestión de proyectos | 1 |
| RF-10 | Mostrar el avance de la colmena, sus cuadros y el aporte de cada persona | Gestión de proyectos y reporte | 1 |
| RF-11 | Reporte individual: constancia, cumplimiento por actividad y tendencia | Reporte con gráficas | 1 |
| RF-12 | Sellos de cera y celebraciones; alacena en la 1.1 | Transversal | 1 |
| RF-13 | Zum con estados que salen del progreso | Transversal | 1 |
| RF-14 | Instalar la aplicación y abrirla sin conexión | Pedido propio | 1 |
| RF-15 | Perfil y ajustes: meta diaria, día sin flores y pausa | Transversal | 1 |

## 8. Reglas del juego

Las reglas completas, con sus casos límite y sus resguardos contra el abuso, están en [`../propuestas/00-base-comun/motor-de-gamificacion.md`](../propuestas/00-base-comun/motor-de-gamificacion.md). Este es el resumen que fija el producto.

| Hecho | Gotas de miel |
| :--- | :---: |
| Cumplir una actividad recurrente | 10 |
| Cumplir una actividad única | 25 |
| Cumplir una actividad única de prioridad alta | 35 |
| Cumplir una actividad ya vencida | 15 |
| Completar la cuota semanal de una recurrente | +15 |
| Cerrar el panal de hoy | +20 |
| Cada 7 días de racha | +50 |
| Alcanzar un cuadro de una colmena | +30 a quienes aportaron en ese tramo |
| Cerrar una colmena | +100 a cada integrante con al menos un aporte |

- **Oficios.** Diez niveles, con umbrales en 0, 100, 250, 450, 700, 1000, 1400, 1900, 2500 y 3200 gotas.
- **El día.** Cambia a las 03:00 hora local, para que quien cumple pasada la medianoche no pierda el día.
- **Racha.** Cuenta los días con al menos una celda llena. Un día sin flores no la rompe. Una reserva la salva un día. Se regala una reserva al empezar y otra cada 7 días de racha, con un máximo de 2. Se puede pausar hasta 14 días.
- **Zum.** Tiene seis estados que se derivan del avance del día y de la racha: esperando, animando, feliz, celebrando, preocupada y descansando. Nunca regaña.
- **Ética.** Nada se pierde por descansar, no hay cuenta regresiva ni comparación entre personas fuera de su propia colmena, y deshacer una celda devuelve las gotas sin castigo.

## 9. Requisitos no funcionales

| N.º | Requisito | Cómo se comprueba |
| :--- | :--- | :--- |
| RNF-01 | Redux es la única fuente de verdad del estado en el frontend | Revisión del código: ningún dato compartido vive fuera del store |
| RNF-02 | Reducers puros, estado inmutable y selectores memorizados | Pruebas de los reducers y del motor |
| RNF-03 | Base de datos de código abierto | PostgreSQL |
| RNF-04 | Accesible: contraste de texto de 4,5 a 1 como mínimo, todo se puede usar con teclado y las imágenes tienen texto alternativo | Revisión con las herramientas del navegador |
| RNF-05 | Adaptable: teléfono desde 360 px y escritorio hasta 1440 px, con la misma funcionalidad | Prueba manual en 360, 768 y 1360 px |
| RNF-06 | Contraseñas cifradas y sesión en cookie que el JavaScript de la página no puede leer | Revisión del código y de la cookie en el navegador |
| RNF-07 | Las animaciones respetan la preferencia de movimiento reducido | Prueba con la preferencia activada |
| RNF-08 | Instalable: cumple los criterios de PWA y abre sin conexión | Auditoría del navegador e instalación en un teléfono |
| RNF-09 | Rápida: marcar una celda responde en menos de 100 ms a la vista, antes de la confirmación del servidor | Prueba manual con la red limitada |
| RNF-10 | Corre completa en tu máquina, sin servicios externos: la base va en un contenedor de WSL | Iniciar el contenedor y arrancar con dos comandos |
| RNF-11 | Las reglas del juego se calculan en el servidor; el navegador no puede otorgarse gotas | Prueba que envía datos alterados |
| RNF-12 | Las reglas del juego están cubiertas por pruebas automáticas | `vp test` en verde |

## 10. Restricciones y supuestos

- **Del enunciado.** Redux obligatorio, base de datos libre obligatoria, backend de tecnología libre.
- **De costo.** Todo debe poder funcionar sin pagar: en local siempre y desplegado en planes gratuitos.
- **De equipo y tiempo.** No sé todavía cuántas personas lo construyen ni la fecha de entrega; el alcance de la versión 1 está pensado para que no dependa de eso (ver preguntas abiertas).
- **Supuesto.** Quien use Panal en equipo tiene un navegador actual; no se da soporte a navegadores sin service worker.
- **Supuesto.** El idioma es español y la zona horaria por defecto es la de Bolivia; cada persona puede cambiar la suya.

## 11. Riesgos

| Riesgo | Probabilidad | Efecto | Qué se hace |
| :--- | :---: | :---: | :--- |
| El alcance crece y no se llega a la fecha | Alta | Alto | La versión 1 está cerrada; lo demás es 1.1 y solo entra si la 1 está terminada |
| La lógica de actividades recurrentes y de la racha tiene errores de fechas | Media | Alto | Va en el motor como funciones puras con pruebas basadas en propiedades; el día "lógico" se guarda calculado |
| Las imágenes generadas de Zum no son coherentes entre poses | Media | Medio | Primero una hoja de personaje aprobada, después las poses con esa hoja como referencia; el SVG actual queda como respaldo |
| El servicio gratuito falla el día de la defensa | Baja | Alto | La aplicación corre completa en local; se lleva lista esa opción |
| La gamificación se percibe como presión | Media | Medio | Reglas éticas de la sección 8; prueba con compañeros antes de entregar |
| El docente espera ver Redux escrito a mano y no RTK Query | Baja | Medio | Los slices y selectores propios son la parte central; se puede preguntar antes |

## 12. Preguntas abiertas

1. **Fecha de entrega y cuántas personas construyen el proyecto.** Define si la versión 1.1 es realista.
2. **Alcance sin conexión.** El stack quedó confirmado; solo falta este punto: ver [`04-stack-y-arquitectura.md`](04-stack-y-arquitectura.md#7-decisiones-confirmadas).
3. **Nombre.** "Panal" y "Zum" son propuestas; se pueden cambiar sin tocar la lógica.
4. **Vocabulario.** Los nombres de oficios, sellos y mieles vienen de la propuesta escrita; conviene que los leas antes de fijarlos.
5. **Qué exige el docente en la defensa.** Si pide desplegado o basta en local, y si quiere ver la base de datos.

## 13. Cuándo está terminado

La versión 1 se da por terminada cuando este recorrido funciona de principio a fin, en el computador y en un teléfono con la aplicación instalada:

1. Una persona nueva se registra, elige su meta de 5 celdas, crea su primera actividad, la cumple y recibe su primer sello.
2. Crea una actividad única y una recurrente de lunes, miércoles y viernes; al día siguiente la recurrente aparece solo si toca.
3. Cumple todas las celdas del día: Zum celebra, suman las gotas y la racha.
4. Crea una colmena, copia el enlace de invitación y una segunda persona se une con él.
5. Las dos cumplen celdas de la colmena: el avance, los cuadros y el aporte de cada una se actualizan.
6. Abre Reportes y ve su constancia, su cumplimiento por actividad y sus celdas por día.
7. Cierra sesión, vuelve a entrar y todo sigue ahí. Sin conexión, la aplicación abre y muestra lo último visto.

Además: `vp test` pasa, los doce requisitos no funcionales están comprobados y la documentación coincide con lo construido.
