# -*- coding: utf-8 -*-
"""Compone una vista de los assets listos sobre los fondos del diseno, para revisarlos de un vistazo.

Uso (desde assets-fuente/):  python herramientas/hoja_de_estados.py <salida.png> <grupo> [tamano]
"""
import pathlib
import sys

from PIL import Image, ImageDraw

salida, grupo = sys.argv[1], sys.argv[2]
tam = int(sys.argv[3]) if len(sys.argv) > 3 else 360
base = pathlib.Path(__file__).parent.parent / 'listos' / grupo
archivos = sorted(base.glob(f'*-{tam}.webp'))
if not archivos:
    raise SystemExit(f'No hay archivos de {tam} px en {base}')

MIEL, CERA, PAPEL, TINTA, BLANCO = (255, 196, 33), (255, 247, 214), (251, 250, 246), (42, 27, 10), (255, 255, 255)
celda, sep, cols = 300, 24, min(3, len(archivos))
filas = (len(archivos) + cols - 1) // cols
ancho = cols * celda + (cols + 1) * sep
alto = filas * celda + (filas + 1) * sep
lienzo = Image.new('RGB', (ancho, alto), PAPEL)
d = ImageDraw.Draw(lienzo)
for i, a in enumerate(archivos):
    x = sep + (i % cols) * (celda + sep)
    y = sep + (i // cols) * (celda + sep)
    # alterna: tarjeta miel con circulo de cera (como en Hoy) y tarjeta blanca
    if i % 2 == 0:
        d.rounded_rectangle((x, y, x + celda, y + celda), 28, fill=MIEL, outline=TINTA, width=3)
        d.ellipse((x + 22, y + 22, x + celda - 22, y + celda - 22), fill=CERA)
    else:
        d.rounded_rectangle((x, y, x + celda, y + celda), 28, fill=BLANCO, outline=TINTA, width=3)
    img = Image.open(a).convert('RGBA').resize((celda - 70, celda - 70), Image.LANCZOS)
    lienzo.paste(img, (x + 35, y + 35), img)
lienzo.save(salida)
print('hoja:', salida, [a.name for a in archivos])
