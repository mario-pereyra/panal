export const selectEnLinea = (estado) => estado.conexion.enLinea;

/** Si se puede ofrecer "Instalar Panal" desde los ajustes. */
export const selectPuedeInstalar = (estado) => estado.conexion.instalable;

export const selectInstalada = (estado) => estado.conexion.instalada;

/** Si hay una versión nueva esperando a que la persona pulse "Actualizar". */
export const selectVersionNueva = (estado) => estado.conexion.versionNueva;
