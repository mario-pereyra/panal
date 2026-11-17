# Fundamentos de Gamificación — Base Teórica y Metodológica

Documento de referencia estructurado a partir del material oficial de la asignatura *Gamificación y Programación Funcional* (Universidad NUR — Docente: Alexander Torrico Torrico), orientado a fundamentar el diseño y la arquitectura del proyecto final.

## Tabla de Contenidos

1. [Fuentes del Curso](#1-fuentes-del-curso)
2. [Concepto y Propósito de la Gamificación](#2-concepto-y-propósito-de-la-gamificación)
3. [Anatomía del Sistema: Mecánicas, Dinámicas y Objetos](#3-anatomía-del-sistema-mecánicas-dinámicas-y-objetos)
4. [Base Psicológica y Neurológica](#4-base-psicológica-y-neurológica)
5. [Tipología de Jugadores — Modelo de Bartle (1996)](#5-tipología-de-jugadores--modelo-de-bartle-1996)
6. [El Marco Octalysis (Yu-kai Chou)](#6-el-marco-octalysis-yu-kai-chou)
7. [Metodología de Diseño y Caso Práctico](#7-metodología-de-diseño-y-caso-práctico)
8. [Antipatrones y Problemas Comunes](#8-antipatrones-y-problemas-comunes)
9. [Puente Técnico: Gamificación + Programación Funcional y Redux](#9-puente-técnico-gamificación--programación-funcional-y-redux)
10. [Bibliografía Oficial](#10-bibliografía-oficial)

---

## 1. Fuentes del Curso

| Unidad / Sección | Archivo fuente | Aporte principal |
| :--- | :--- | :--- |
| Presentación | `presentacion/Programa de Estudio PFG.pdf` | Plan de clases (Unidades 1–7), capacidades, metodología y bibliografía |
| Presentación | `presentacion/ClaendarioGamificacion.xlsx` | Temario resumido por unidad |
| Unidad 1 | `unidad-1/00introducción.pptx` | Definición inicial, objetivos y puente con programación funcional |
| Unidad 5 | `unidad-5/01Mecanicas.pptx` | Fundamentos, mecánicas, dinámicas, objetos y tabla comparativa |
| Unidad 7 | `unidad-7/gamificacón con octalisis.pptx` | Sistema de gamificación, Bartle, Octalysis, casos aplicados y antipatrones |
| Entregables | `entregables/PRACTICO.pdf` | Especificación del proyecto final (plataforma gamificada con Redux) |

> **Nota sobre el material fuente:** Los archivos `Doc1.pdf` y `Doc1-2.pdf` de las unidades 3, 4 y 6 en la plataforma Moodle son PDFs de 1 página en blanco. El contenido teórico de la **Unidad 6** (*Neurociencia, Motivación y Tipos de Jugadores*) proviene del `Programa de Estudio PFG.pdf` y de `gamificacón con octalisis.pptx`.

---

## 2. Concepto y Propósito de la Gamificación

### Definición
La gamificación es una estrategia que consiste en **trasladar elementos, mecánicas y dinámicas propias de los juegos** (puntos, niveles, recompensas, desafíos, narrativa) a **contextos no lúdicos** (educación, trabajo, hábitos, fidelización), con el fin de aumentar la motivación, el compromiso (*engagement*) y la participación de las personas.

> **Qué NO es gamificación:** No es simplemente "poner a jugar" para pasar el rato. El propósito es convertir al usuario en protagonista activo, aumentando su motivación intrínseca y construyendo una experiencia con propósito.

### Objetivos Principales
1. **Aumentar la motivación:** Transformar tareas rutinarias en desafíos atractivos que generen interés por completarlas.
2. **Mejorar el aprendizaje y desarrollo de habilidades:** Hacer el proceso más activo y participativo, facilitando la retención.
3. **Fomentar la colaboración:** Impulsar el trabajo en equipo y la interacción social mediante metas compartidas.
4. **Obtener *feedback* inmediato:** Usar sistemas de puntuación y progreso para que el usuario vea su evolución y desempeño en tiempo real.
5. **Cambiar o consolidar hábitos:** Fomentar comportamientos positivos (productividad, salud, constancia) o reducir malos hábitos.

### Ámbitos de Aplicación
- **Educación:** Aprendizaje basado en retos (ejemplos citados en clase: *Flexbox Froggy*, *Querymon*, *Virtudes de la zombiología*).
- **Corporativo interno:** Motivar empleados, mejorar desempeño y retener talento.
- **Corporativo externo / Marketing:** Fidelización de clientes, retención y captación.
- **Otras áreas:** Recursos Humanos, Salud y bienestar, Ventas y comercio, Finanzas y ahorro, Sostenibilidad y medio ambiente, Medición de actividades y hábitos.

---

## 3. Anatomía del Sistema: Mecánicas, Dinámicas y Objetos

Todo sistema gamificado se estructura en tres capas. El orden en que se diseñan es determinante:

> **Regla de oro:** *"El error más común es empezar por los objetos, porque son lo más visible. Pero los objetos sin mecánica son solo decoración."*

| Capa | Definición | Ejemplos del curso |
| :--- | :--- | :--- |
| **Mecánicas** | Reglas o acciones concretas que determinan cómo interactúa el usuario con el sistema y qué puede hacer. | Completar misiones, recolectar monedas, resolver enigmas, duelos directos, retos temporales, niveles/zonas desbloqueables, barras de progreso, recompensas acumulativas, cajas misteriosas, eventos aleatorios, misiones cooperativas, roles complementarios, mapas interactivos, álbumes/colecciones, decisiones con impacto. |
| **Dinámicas** | Patrones de comportamiento y emociones que **emergen** de la interacción del jugador con las mecánicas. | Sensación de logro, frustración ante una derrota, colaboración con compañeros, rivalidad por el puntaje más alto, deseo de mejorar habilidades, satisfacción de desbloquear algo exclusivo, miedo a perder una racha. |
| **Objetos (Componentes)** | Elementos interactivos tangibles o intangibles que los usuarios usan, recolectan o ganan. | Monedas, insignias/medallas, llaves de acceso, escudos protectores, cofres con recompensas, tablas de posición (**modelo PBL**: *Points, Badges, Leaderboards*). |

---

## 4. Base Psicológica y Neurológica

### Neurotransmisores del Juego
- El enfoque del curso se centra en la **dopamina** y el **ciclo de anticipación-recompensa**: la dopamina se dispara principalmente ante la *anticipación* de una recompensa (una racha por completarse, una caja misteriosa por abrirse) más que por la recompensa misma.
- **Riesgo de diseño:** Un sistema que solo persigue disparos rápidos de dopamina logra enganche superficial a corto plazo, pero pierde efectividad y genera desgaste si no ofrece valor ni propósito real.

### Motivación Intrínseca vs. Extrínseca

| Tipo | Descripción | Impacto a largo plazo |
| :--- | :--- | :--- |
| **Motivación Intrínseca** | Hacer algo por el placer, curiosidad, autonomía, propósito o maestría de la actividad misma. | Sostiene el compromiso genuino y duradero más allá de los premios. |
| **Motivación Extrínseca** | Hacer algo por una recompensa externa (puntos, medallas, notas, premios, reconocimiento público) o por evitar una pérdida. | Motiva rápido a corto plazo, pero un diseño basado **exclusivamente** en recompensas extrínsecas puede apagar el interés genuino. |

---

## 5. Tipología de Jugadores — Modelo de Bartle (1996)

**Bartle responde a: ¿QUIÉN es el jugador?** Distintas personas disfrutan distintas mecánicas; un mismo diseño puede enganchar a un perfil y aburrir a otro.

| Perfil | Qué busca / Qué lo motiva | Implicación de diseño |
| :--- | :--- | :--- |
| **Triunfadores (*Achievers*)** | Logros, progreso medible, completar objetivos, acumular puntos, insignias y maestría. | Requieren metas claras, barras de progreso e insignias de mérito real. Las misiones ocultas sin criterio claro suelen fallarles. |
| **Exploradores (*Explorers*)** | Descubrir el sistema, curiosidad, caminos alternativos, mecánicas ocultas, entender cómo funciona todo. | Se aburren con recompensas puramente extrínsecas; valoran mapas, secretos y novedad. |
| **Socializadores (*Socializers*)** | Conectar con otros, cooperar, pertenecer a una comunidad, reconocimiento entre pares. | Una tabla de clasificación puramente competitiva suele fallar con ellos si desplaza la conexión humana; prefieren misiones cooperativas y roles complementarios. |
| **Competidores / Asesinos (*Killers*)** | Competencia directa, superar a otros, dominar rankings, demostrar superioridad. | Necesitan duelos, rankings y retos donde medirse frente a otros, pero en exceso generan toxicidad para el resto. |

> En un sistema real, los usuarios son una **mezcla de perfiles**. Además de definir qué perfiles se potencian, es útil identificar qué perfiles están **ausentes** o no son prioridad en el dominio del proyecto.

---

## 6. El Marco Octalysis (Yu-kai Chou)

**Octalysis responde a: ¿QUÉ impulsa profundamente al jugador?** Ofrece un mapa de **8 Core Drives** (impulsos centrales) para analizar sistemas existentes o diseñar uno equilibrado.

### Los 8 Core Drives

| # | Core Drive | Esencia | Mecánicas típicas |
| :--- | :--- | :--- | :--- |
| **CD1** | **Significado épico y vocación** | *"Soy parte de algo más grande"* | Narrativa, propósito compartido, misiones con impacto. |
| **CD2** | **Logro y desarrollo** | *"Estoy progresando y superando retos"* | Puntos, niveles, barras de progreso, insignias de habilidad, desafíos. |
| **CD3** | **Empoderamiento (Creatividad y feedback)** | *"Puedo elegir, crear y ver el resultado"* | Elección de caminos, personalización de estrategias, feedback instantáneo. |
| **CD4** | **Propiedad y posesión** | *"Esto es mío y quiero cuidarlo/hacerlo crecer"* | Acumular monedas/bienes, álbumes/colecciones, insignias de constancia, perfil propio. |
| **CD5** | **Influencia social y afinidad** | *"Me importa cómo me ven y cómo colaboro"* | Rankings, misiones cooperativas, mentoría, reconocimiento público en grupo. |
| **CD6** | **Escasez e impaciencia** | *"Lo quiero porque es limitado o aún no puedo tenerlo"* | Retos temporales, recompensas exclusivas por tiempo limitado, desbloqueos escalonados. |
| **CD7** | **Imprevisibilidad y curiosidad** | *"¿Qué pasará después?"* | Cajas misteriosas, eventos aleatorios, giros inesperados, recompensas variables. |
| **CD8** | **Evitación y pérdida** | *"No quiero perder lo que ya conseguí"* | Rachas (*streaks*), penalizaciones por inactividad, expiración de beneficios. |

### Ejes Estratégicos del Octalysis
1. **Cerebro Izquierdo (Extrínseco) vs. Cerebro Derecho (Intrínseco):**
   - *Extrínseco (CD2, CD4, CD6):* orientado a metas, posesión y recompensas.
   - *Intrínseco (CD3, CD5, CD7):* orientado a creatividad, socialización y curiosidad.
2. **White Hat (Positivo) vs. Black Hat (Presión):**
   - *White Hat (CD1, CD2, CD3):* hace sentir al usuario realizado y con propósito; sostiene el uso a largo plazo.
   - *Black Hat (CD6, CD7, CD8):* genera urgencia, incertidumbre o miedo a perder; útil para acción inmediata, pero **abusar de él** genera estrés, manipulación y abandono.

---

## 7. Metodología de Diseño y Caso Práctico

El curso propone un flujo de diseño en **5 pasos** antes de implementar:

1. **Presentación del modelo de negocio (Narrativa):** Contexto, problema y propósito.
2. **Establecer objetivos:** Generales y específicos (medibles).
3. **Definir tipos de jugadores (Bartle):** Identificar perfiles presentes y ausentes.
4. **Aplicar Sistema Octalysis:** Seleccionar los Core Drives clave y derivar mecánicas concretas.
5. **Gráfica del estado actual:** Establecer la línea base para medir el progreso de la actividad gamificada.

### Caso de Estudio Visto en Clase (Transporte Público / Rastreo GPS)
- **Objetivos:** Retención y captación de clientes; fomentar conducción segura, cumplimiento de horarios y uso de la plataforma GPS.
- **Perfiles detectados:** Triunfadores (quieren ser "el mejor de su ruta" con progreso medible) y Socializadores/Competencia sana dentro de la asociación. *Perfiles ausentes:* Asesino y Explorador.
- **Mapeo a Mecánicas y Core Drives:**
  - *Puntaje semanal de ruta* (datos GPS) → **CD2 (Logro)**.
  - *Insignias de constancia* ("4 semanas > 80 pts") → **CD4 (Propiedad acumulada)**.
  - *Ranking de la asociación* (Top 3 visible al jefe) → **CD5 (Influencia social)**.
  - *Reporte trimestral en PDF* para el decisor del contrato → Retención directa del cliente.

---

## 8. Antipatrones y Problemas Comunes

| Problema | Diagnóstico en Octalysis | Perfil de Bartle afectado | Cómo mitigarlo |
| :--- | :--- | :--- | :--- |
| **Exceso de competitividad** | **CD5:** La comparación desplaza a la conexión. | Socializadores | Equilibrar rankings con metas cooperativas y progreso personal. |
| **Desigualdad en recompensas** | **CD2:** El logro deja de sentirse merecido o justo. | Triunfadores | Reglas transparentes, proporcionales al esfuerzo y sin sesgos. |
| **Solo recompensas extrínsecas** | No enganchan más allá del premio inicial. | Exploradores | Incorporar curiosidad, autonomía, propósito y feedback (CD1, CD3, CD7). |
| **Monotonía y falta de innovación** | **CD7 y CD3:** Sin curiosidad ni novedad. | Competidores / Asesinos (y general) | Introducir variedad en retos, evolución de niveles y eventos. |
| **Complejidad excesiva** | **CD2:** El usuario no se siente competente. | Socializadores (y nuevos usuarios) | Curva de aprendizaje progresiva y feedback visual claro. |

---

## 9. Puente Técnico: Gamificación + Programación Funcional y Redux

La materia conecta el diseño de gamificación (el **qué** y **por qué**) con la arquitectura funcional (el **cómo**):

1. **Inmutabilidad y Funciones Puras (Unidades 1–3):** Cada evento del usuario se procesa mediante funciones puras que calculan el nuevo estado sin mutar el anterior. El estado es una reducción (`reduce`) aplicada sobre las acciones a lo largo del tiempo.
2. **Store Único como Fuente de Verdad (Unidad 4):** Todo el estado gamificado vive centralizado, permitiendo trazabilidad y viaje en el tiempo sobre el historial de acciones.
3. **Composición de Reducers (`combineReducers`, Unidad 5):** Evitar un reducer monolítico. Cada mecánica (ej. `puntosReducer`, `rachasReducer`, `nivelesReducer`, `insigniasReducer`) debe ser un reducer pequeño, puro e independiente, compuesto en un *root reducer*.
4. **Trazabilidad Diseño ↔ Código (Unidades 6–7):** Cada acción del *store* debe poder etiquetarse con el perfil de Bartle, tipo de motivación (intrínseca/extrínseca) y Core Drive de Octalysis que activa.

### Requisitos del Proyecto Final (`PRACTICO.pdf`)
- **Objetivo:** Plataforma gamificada para organizar y cumplir actividades (individual o en equipo), mostrando el cumplimiento de forma visual mediante gráficos de avance por actividad y por proyecto.
- **Casos de uso mínimos:**
  1. Registro e inicio de sesión.
  2. Registro de actividades únicas y recurrentes.
  3. Sistema de gestión de proyectos (permitir vinculación de usuarios).
  4. Reporte a partir de gráficas resaltando el progreso de cada acción.
- **Restricciones técnicas:** Backend libre, Base de datos libre (obligatorio), Frontend con **Redux obligatorio**.

---

## 10. Bibliografía Oficial

- **Yu-kai Chou** (2019). *Actionable Gamification*. O'Reilly Media, Inc. *(Marco Octalysis).*
- **For Dummies / O'Reilly** (2013). *Business Gamification for Dummies*. O'Reilly Media, Inc.
- **Bibliografía técnica complementaria del programa:**
  - Ruiz Blas, C. (2004). *Razonando con Haskell: Un curso sobre programación funcional*.
  - McBride, Martin (2019). *Functional Programming in Python*. O'Reilly Media, Inc.
  - Debrauwer, Laurent (2013). *Patrones de diseño en Java: Los 23 modelos de diseño*. ENI.
  - Guijarro Olivares, Jordi (2019). *DevOps y seguridad cloud*. Editorial UOC.

