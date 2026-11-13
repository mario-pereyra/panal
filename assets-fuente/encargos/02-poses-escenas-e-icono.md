# Encargo 02: tres poses, cuatro escenas y el icono

Eres ilustrador de personajes para una aplicación. Tu tarea es generar **ocho imágenes** con tu herramienta de generación de imágenes y dejar cada una en la ruta indicada.

## Reglas de trabajo

- Trabaja solo dentro de la carpeta de trabajo actual. No modifiques nada en `referencia/`, `encargos/`, `herramientas/` ni los archivos que ya existen en `originales/`.
- Los únicos comandos de terminal permitidos son crear las carpetas de destino y **copiar** los archivos generados a las rutas indicadas. No instales nada, no borres nada y no ejecutes otros programas.
- No conviertas ni edites las imágenes: copia el archivo tal como lo entrega la herramienta, con su extensión real (`.jpg` o `.png`).
- Genera las imágenes de una en una. **La cuota de generación es escasa: una sola generación por imagen.** Repite solo si la imagen incumple un rasgo obligatorio, y como máximo una vez. Cuentan también las generaciones internas del subagente: indícale ese límite.

## Referencias que debes mirar antes

- `originales/zum/Z00-hoja-de-personaje.jpg`: la hoja de personaje. Zum debe ser **exactamente ese personaje**.
- `originales/zum/Z01-zum-esperando.jpg`: una pose ya terminada. De aquí se toman el grosor del contorno y el acabado.
- `referencia/pantalla-hoy.png`: la interfaz donde se usarán las imágenes.

## Rasgos de Zum que no cambian

- Cuerpo: un óvalo casi redondo, apenas más ancho que alto, amarillo miel `#FFD23F`. Zum es casi toda cabeza.
- Contorno de tinta marrón muy oscura `#2A1B0A`, grueso, uniforme y **cerrado** en todas las formas.
- Dos franjas curvas de tinta, gruesas y con extremos redondos, en la mitad inferior del cuerpo.
- Dos alas ovaladas azul muy claro `#DDF0FA`, detrás del cuerpo. Dos antenas curvas de tinta rematadas en una bolita.
- Ojos: óvalos verticales de tinta con un brillo blanco pequeño. Mejillas coral `#FF8A5B`. Boca pequeña. Aguijón mínimo.
- Bracitos muy cortos y redondeados, del mismo amarillo, solo cuando la pose los necesita. Sin dedos, sin piernas.
- Zum nunca se enoja, nunca llora y nunca usa el aguijón como gesto.

## Las ocho imágenes

| Archivo de destino (sin extensión) | Qué muestra |
| :--- | :--- |
| `originales/zum/Z07-zum-saludando` | Zum de frente, un bracito en alto saludando, sonrisa abierta, alas a media altura |
| `originales/zum/Z08-zum-con-flor` | Zum de frente, sostiene con los dos bracitos una flor de cinco pétalos redondos color coral `#FF8A5B`, con centro miel oscura `#E69A00` y un tallo corto verde `#2E7D4F`; la mira con asombro alegre |
| `originales/zum/Z09-zum-guiando` | Zum inclinada unos 10 grados, un bracito estirado que señala **hacia abajo y a la derecha**, mirando hacia ese lado, sonrisa abierta |
| `originales/escenas/E01-entrada` | Una colmena redondeada de tres franjas, color miel `#FFC421` con contorno de tinta, y su entrada: un arco oscuro de tinta en la base. Zum asoma por delante de la colmena y saluda con un bracito en alto. Dos hexágonos pequeños color cera `#FFF3C9` flotan a un lado |
| `originales/escenas/E02-celda-nueva` | Zum de frente sostiene delante de su cuerpo, con los dos bracitos, un hexágono grande vacío: relleno cera `#FFF3C9` y contorno de tinta. Sonríe invitando |
| `originales/escenas/E03-panal-vacio` | **Sin Zum.** Un panal de tres hexágonos juntos (dos arriba y uno abajo, encajados), vacíos: relleno cera `#FFF3C9` y contorno de tinta. A su lado, una flor pequeña de cinco pétalos redondos coral `#FF8A5B` con centro miel oscura y un tallo corto verde `#2E7D4F` con una hoja |
| `originales/escenas/E04-colmena-vacia` | **Sin Zum.** Una colmena redondeada de tres franjas color miel `#FFC421` con contorno de tinta y la entrada abierta, un arco de tinta en la base. A su lado, la misma flor pequeña de E03 |
| `originales/icono/I01-icono` | Icono de aplicación. **Fondo liso miel `#FFC421` que llena todo el cuadrado**, sin transparencia y sin esquinas redondeadas. Centrada, solo la cara de Zum: el óvalo amarillo `#FFD23F` con contorno de tinta, los ojos, las mejillas, la sonrisa, las dos antenas y una sola franja de tinta abajo. Sin alas ni aguijón. El dibujo ocupa el 60 % central del cuadrado |

## Estilo obligatorio de cada imagen

- Un solo motivo por imagen, completo, centrado, ocupando cerca del 80 % del lienzo (salvo el icono, que ocupa el 60 %). No se corta nada.
- Formato cuadrado, proporción 1:1.
- Ilustración vectorial plana, estilo pegatina. Rellenos planos: sin degradados, sin sombreado, sin brillos de volumen, sin texturas, sin apariencia 3D y sin sombra proyectada.
- Solo colores de esta paleta: miel `#FFC421`, miel de Zum `#FFD23F`, miel oscura `#E69A00`, cera `#FFF3C9`, ala `#DDF0FA`, coral `#FF8A5B`, hoja `#2E7D4F`, tinta `#2A1B0A` y blanco.
- **Fondo blanco puro y liso `#FFFFFF`** en todas menos el icono: sin marco, sin suelo, sin decorado y sin viñeta. El fondo se recortará después, así que todas las formas deben tener su contorno de tinta cerrado.
- Sin texto, letras, números ni rótulos.

## Al terminar

Responde en español con una tabla: archivo guardado (ruta con extensión), tamaño en píxeles, número de intentos y cualquier rasgo que no se haya podido cumplir.
