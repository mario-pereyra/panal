# Cómo contribuir a Panal

Para instalar y arrancar el proyecto, sigue el [`README.md`](README.md).

## Flujo de trabajo

1. **Crea una rama desde `main`.** El nombre dice qué es y de qué trata: `funcion/pantalla-celdas`, `arreglo/racha-en-domingo`, `docs/plan-de-pruebas`.
2. **Haz commits pequeños.** Cada uno cuenta una sola cosa, en español y en imperativo: "Agrega la pantalla Celdas", "Corrige la racha en el día sin flores".
3. **Abre un pull request hacia `main`.** La plantilla te pide qué cambia y cómo lo probaste. Si cierra una historia de [`docs/proyecto/02-historias-de-usuario.md`](docs/proyecto/02-historias-de-usuario.md), nómbrala (HU-12).
4. **Espera a que la integración continua pase.** Corre lo mismo que puedes correr en tu máquina.

## Antes de abrir el pull request

```bash
vp run check    # formato y reglas de estilo; vp fmt corrige el formato
vp run test     # pruebas
vp run build    # compilación
```

Si el cambio se ve, pruébalo en el navegador a tamaño de computador y de teléfono, y adjunta capturas.

## Convenciones del código

Están en [`AGENTS.md`](AGENTS.md): dónde va cada cosa, el idioma, los estilos y la accesibilidad. Valen igual para personas y para agentes.

## Reportar un error o proponer una mejora

Abre un issue con la plantilla que corresponda. Un error bien reportado dice qué hiciste, qué esperabas y qué pasó.
