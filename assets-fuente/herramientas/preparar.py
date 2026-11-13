# -*- coding: utf-8 -*-
"""Convierte un original generado (fondo liso, sin transparencia) en un asset listo para la interfaz.

Pasos: detecta el color de fondo en el borde, lo vuelve transparente con un borde suave,
quita el halo del fondo en el contorno, recorta, centra en un lienzo cuadrado y exporta
en WebP a los tamaños pedidos, mas un PNG maestro.

Uso:
    python preparar.py <original> <carpeta_salida> <nombre> [--tamanos 720,360,128]
                       [--huecos si|no] [--margen 0.06] [--recorte x0,y0,x1,y1]

--huecos si   quita tambien el fondo encerrado (entre un brazo y el cuerpo). Solo es seguro
              cuando el fondo es un color que el dibujo no usa (magenta). Con fondo blanco
              usar "no": borraria el brillo de los ojos.
--recorte     fraccion de la imagen a usar (0 a 1), para sacar una pose de una hoja.

Requiere Pillow y numpy.
"""
import argparse
import pathlib
import sys

import numpy as np
from PIL import Image

T0, T1 = 28.0, 110.0  # distancia al fondo: por debajo de T0 es fondo, por encima de T1 es dibujo


def conectado_al_borde(candidato):
    """Pixeles candidatos a fondo que tocan el borde de la imagen (relleno por crecimiento)."""
    fondo = np.zeros_like(candidato)
    fondo[0, :], fondo[-1, :] = candidato[0, :], candidato[-1, :]
    fondo[:, 0], fondo[:, -1] = candidato[:, 0], candidato[:, -1]
    while True:
        crecido = fondo.copy()
        crecido[1:, :] |= fondo[:-1, :]
        crecido[:-1, :] |= fondo[1:, :]
        crecido[:, 1:] |= fondo[:, :-1]
        crecido[:, :-1] |= fondo[:, 1:]
        crecido &= candidato
        if crecido.sum() == fondo.sum():
            return fondo
        fondo = crecido


def dilatar(mascara, veces):
    for _ in range(veces):
        m = mascara.copy()
        m[1:, :] |= mascara[:-1, :]
        m[:-1, :] |= mascara[1:, :]
        m[:, 1:] |= mascara[:, :-1]
        m[:, :-1] |= mascara[:, 1:]
        mascara = m
    return mascara


def recortar_fondo(img, huecos):
    rgb = np.asarray(img.convert('RGB')).astype(np.float32)
    borde = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    color_fondo = np.median(borde, axis=0)
    dist = np.sqrt(((rgb - color_fondo) ** 2).sum(axis=2))

    rampa = np.clip((dist - T0) / (T1 - T0), 0.0, 1.0)
    if huecos:
        # El dibujo no usa el color de fondo: se puede quitar en toda la imagen.
        alfa = rampa.copy()
    else:
        # Solo el fondo que toca el borde; las zonas claras encerradas son parte del dibujo.
        fondo = conectado_al_borde(dist < T0)
        franja = dilatar(fondo, 3) & ~fondo
        alfa = np.ones(dist.shape, dtype=np.float32)
        alfa[fondo] = 0.0
        alfa[franja] = rampa[franja]

    # Quita el halo: recupera el color propio del pixel mezclado con el fondo.
    a = np.clip(alfa, 0.02, 1.0)[..., None]
    limpio = np.clip((rgb - (1.0 - a) * color_fondo) / a, 0, 255)
    mezcla = (alfa > 0) & (alfa < 1)
    rgb[mezcla] = limpio[mezcla]

    rgba = np.dstack([rgb, alfa * 255.0]).astype(np.uint8)
    return Image.fromarray(rgba, 'RGBA'), tuple(int(c) for c in color_fondo)


def encuadrar(img, margen):
    caja = img.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    if caja is None:
        raise SystemExit('La imagen quedo vacia: revisa el fondo del original.')
    img = img.crop(caja)
    lado = int(round(max(img.size) * (1 + 2 * margen)))
    lienzo = Image.new('RGBA', (lado, lado), (0, 0, 0, 0))
    lienzo.paste(img, ((lado - img.width) // 2, (lado - img.height) // 2))
    return lienzo


def preparar(original, salida, nombre, tamanos, huecos=False, margen=0.06, recorte=None):
    """Recorta el fondo de un original y lo exporta. Devuelve el lado del maestro en pixeles."""
    img = Image.open(original)
    if recorte:
        x0, y0, x1, y1 = recorte
        w, h = img.size
        img = img.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))
    recortada, color = recortar_fondo(img, huecos)
    cuadrada = encuadrar(recortada, margen)
    salida = pathlib.Path(salida)
    salida.mkdir(parents=True, exist_ok=True)
    cuadrada.save(salida / f'{nombre}.png')
    for t in tamanos:
        if t > cuadrada.width:
            print(f'  aviso: {t} px supera el original ({cuadrada.width} px); se amplia')
        copia = cuadrada.resize((t, t), Image.LANCZOS)
        copia.save(salida / f'{nombre}-{t}.webp', 'WEBP', quality=92, alpha_quality=100, method=6)
    print(f'{nombre}: fondo {color}, maestro {cuadrada.width} px, tamanos {tamanos}')
    return cuadrada.width


def redimensionar(original, salida, nombre, tamanos):
    """Para imagenes que conservan su fondo (el icono): solo cambia el tamano y guarda PNG."""
    img = Image.open(original).convert('RGB')
    lado = min(img.size)
    x, y = (img.width - lado) // 2, (img.height - lado) // 2
    img = img.crop((x, y, x + lado, y + lado))
    salida = pathlib.Path(salida)
    salida.mkdir(parents=True, exist_ok=True)
    for t in tamanos:
        img.resize((t, t), Image.LANCZOS).save(salida / f'{nombre}-{t}.png')
    print(f'{nombre}: sin recorte, tamanos {tamanos}')


def main():
    p = argparse.ArgumentParser()
    p.add_argument('original')
    p.add_argument('salida')
    p.add_argument('nombre')
    p.add_argument('--tamanos', default='720,360,128')
    p.add_argument('--huecos', default='no', choices=['si', 'no'])
    p.add_argument('--margen', type=float, default=0.06)
    p.add_argument('--recorte', default='')
    a = p.parse_args()
    recorte = tuple(float(v) for v in a.recorte.split(',')) if a.recorte else None
    preparar(a.original, a.salida, a.nombre, [int(v) for v in a.tamanos.split(',')],
             huecos=a.huecos == 'si', margen=a.margen, recorte=recorte)


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main()
