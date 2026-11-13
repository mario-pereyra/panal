# Encargo 01: los seis estados de Zum

Eres ilustrador de personajes para una aplicación. Tu tarea es generar **seis imágenes**, una por estado de Zum, con tu herramienta de generación de imágenes, y dejar cada una en la ruta indicada.

## Reglas de trabajo

- Trabaja solo dentro de la carpeta de trabajo actual. No modifiques nada en `referencia/`, `encargos/` ni `herramientas/`.
- Los únicos comandos de terminal permitidos son crear las carpetas de destino y **copiar** los archivos generados a las rutas indicadas. No instales nada, no borres nada y no ejecutes otros programas.
- No conviertas ni edites las imágenes: copia el archivo tal como lo entrega la herramienta, con su extensión real (`.jpg` o `.png`).
- Genera las seis imágenes de una en una. **La cuota de generación es escasa: una sola generación por imagen.** Repite solo si la imagen incumple un rasgo obligatorio, y como máximo una vez. Cuentan también las generaciones internas del subagente: indícale ese límite.

## Referencias que debes mirar antes

- `originales/zum/Z00-hoja-de-personaje.jpg`: la hoja de personaje aprobada. Cada imagen nueva debe mostrar **exactamente ese personaje**, en la pose correspondiente de la hoja.
- `referencia/zum-actual.png`: el dibujo original. De aquí se toma el **grosor del contorno**: grueso y uniforme, cerca del 2,5 % del ancho del personaje. En la hoja quedó más fino; en estas imágenes debe ser como en el original.

## Rasgos que no cambian

- Cuerpo: un óvalo casi redondo, apenas más ancho que alto, amarillo miel `#FFD23F`. Zum es casi toda cabeza.
- Contorno de tinta marrón muy oscura `#2A1B0A`, grueso y uniforme, **cerrado** en todas las formas.
- Dos franjas curvas de tinta, gruesas y con extremos redondos, en la mitad inferior del cuerpo. La cara queda despejada.
- Dos alas ovaladas azul muy claro `#DDF0FA`, detrás del cuerpo.
- Dos antenas curvas de tinta, cada una rematada en una bolita.
- Ojos: óvalos verticales de tinta con un brillo blanco pequeño. Mejillas: óvalos coral `#FF8A5B`. Boca pequeña.
- Aguijón mínimo de tinta en la base.
- Bracitos muy cortos y redondeados, del mismo amarillo, solo cuando la pose los necesita. Sin dedos, sin piernas.

## Las seis imágenes

| Archivo de destino (sin extensión) | Estado | Pose |
| :--- | :--- | :--- |
| `originales/zum/Z01-zum-esperando` | Esperando | De frente, quieta, alas a media altura, antenas quietas, ojos abiertos y sonrisa pequeña. Sin brazos visibles |
| `originales/zum/Z02-zum-animando` | Animando | Inclinada unos 10 grados; un bracito estirado que señala hacia la derecha de la imagen; ojos mirando hacia ese lado; sonrisa abierta |
| `originales/zum/Z03-zum-feliz` | Feliz | En vuelo, alas altas y abiertas, cuerpo apenas inclinado, sonrisa amplia, mejillas marcadas y dos trazos cortos de movimiento junto a cada ala |
| `originales/zum/Z04-zum-celebrando` | Celebrando | Alas arriba del todo, los dos bracitos en alto, ojos cerrados en arco feliz, boca abierta, y tres gotas de miel pequeñas `#E69A00` con contorno de tinta alrededor |
| `originales/zum/Z05-zum-preocupada` | Preocupada | De frente, alas bajas, cuerpo apenas encogido, cejas levantadas hacia el centro y boca en una línea corta. Preocupación tierna: sin lágrimas, sin tristeza. Sin brazos ni piernas |
| `originales/zum/Z06-zum-descansando` | Descansando | De frente, dormida, alas plegadas hacia abajo, ojos cerrados en arco hacia abajo y sonrisa tranquila. Sin brazos ni piernas. No de perfil |

## Estilo obligatorio de cada imagen

- **Una sola Zum por imagen**, completa, centrada, ocupando cerca del 80 % del lienzo. No se corta ninguna ala, antena, gota ni trazo.
- Formato cuadrado, proporción 1:1, a la mayor resolución que permita la herramienta.
- Ilustración vectorial plana, estilo pegatina. Rellenos planos: sin degradados, sin sombreado, sin brillos de volumen, sin texturas, sin apariencia 3D y sin sombra proyectada.
- Solo estos colores: miel `#FFD23F`, tinta `#2A1B0A`, ala `#DDF0FA`, coral `#FF8A5B`, blanco para el brillo de los ojos y miel oscura `#E69A00` para las gotas.
- **Fondo blanco puro y liso `#FFFFFF`**, sin marco, sin suelo, sin decorado y sin viñeta. El fondo se recortará después: no debe quedar fondo encerrado dentro del dibujo, salvo que la pose lo haga inevitable.
- Sin texto, letras, números ni rótulos.

## Al terminar

Responde en español con una tabla: archivo guardado (ruta con extensión), tamaño en píxeles, número de intentos y cualquier rasgo que no se haya podido cumplir.
