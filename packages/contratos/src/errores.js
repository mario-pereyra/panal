/**
 * Errores de la API. Toda respuesta de error tiene la misma forma:
 *
 *     { "error": { "codigo": "correo_en_uso", "mensaje": "Ese correo ya tiene un panal.", "campos": {...} } }
 *
 * `campos` solo aparece en los errores de validación. El navegador decide qué
 * mostrar según `codigo`; el mensaje sirve de respaldo.
 */
export const ERRORES = {
  datos_invalidos: { estado: 400, mensaje: "Revisa los datos: algo no está bien." },
  sin_sesion: { estado: 401, mensaje: "Tu sesión terminó. Vuelve a entrar al panal." },
  credenciales_incorrectas: { estado: 401, mensaje: "El correo o la contraseña no coinciden." },
  sin_permiso: { estado: 403, mensaje: "Esto es de otro enjambre." },
  no_existe: { estado: 404, mensaje: "Eso no existe en el panal." },
  correo_en_uso: { estado: 409, mensaje: "Ese correo ya tiene un panal." },
  celda_ya_llena: { estado: 409, mensaje: "Esa celda ya estaba llena." },
  celda_ajena: { estado: 409, mensaje: "Esa celda está asignada a otra abeja." },
  prioridad_alta_completa: {
    estado: 409,
    mensaje: "Ya tienes tres celdas de prioridad alta. Termina una antes de marcar otra.",
  },
  colmena_cerrada: { estado: 409, mensaje: "Esta colmena ya está cerrada." },
  ya_eres_integrante: { estado: 409, mensaje: "Ya eres parte de esta colmena." },
  fundadora_no_sale: {
    estado: 409,
    mensaje: "Quien fundó la colmena no puede salir mientras haya otras abejas.",
  },
  invitacion_vencida: {
    estado: 410,
    mensaje: "Esta invitación ya no está activa. Pide a tu enjambre un enlace nuevo.",
  },
  demasiados_intentos: {
    estado: 429,
    mensaje: "Demasiados intentos. Espera unos minutos y vuelve a probar.",
  },
  error_interno: { estado: 500, mensaje: "Algo falló de nuestro lado. Vuelve a intentarlo." },
};

/** Prioridades altas activas que puede tener una persona a la vez. */
export const MAXIMO_DE_PRIORIDAD_ALTA = 3;
