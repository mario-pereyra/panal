# -*- coding: utf-8 -*-
"""Prepara todos los originales que ya existen, segun inventario.csv.

Uso (desde assets-fuente/):  python herramientas/preparar_todo.py [ID ...]
Sin argumentos procesa todo lo que encuentre; con argumentos, solo esos identificadores.
"""
import csv
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from preparar import preparar, redimensionar  # noqa: E402

sys.stdout.reconfigure(encoding='utf-8')
aqui = pathlib.Path(__file__).parent
base = aqui.parent
solo = set(sys.argv[1:])
hechos, faltan = [], []
with open(aqui / 'inventario.csv', encoding='utf-8', newline='') as f:
    for fila in csv.DictReader(f, delimiter=';'):
        if solo and fila['id'] not in solo:
            continue
        originales = sorted((base / 'originales' / fila['grupo']).glob(f"{fila['id']}-*"))
        if not originales:
            faltan.append(fila['id'])
            continue
        tamanos = [int(v) for v in fila['tamanos'].split(',')]
        salida = base / 'listos' / fila['grupo']
        if fila['recorte'] == 'si':
            preparar(originales[0], salida, fila['nombre'], tamanos)
        else:
            redimensionar(originales[0], salida, fila['nombre'], tamanos)
        hechos.append(fila['id'])
print(f'preparados: {len(hechos)} ({", ".join(hechos)})')
if faltan:
    print(f'sin original todavia: {", ".join(faltan)}')
