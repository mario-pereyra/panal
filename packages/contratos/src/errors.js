export const ERRORS = {
  invalid_data: { status: 400, message: "Revisa los datos: algo no está bien." },
  unauthorized: { status: 401, message: "Tu sesión terminó. Vuelve a entrar al panal." },
  invalid_credentials: { status: 401, message: "El correo o la contraseña no coinciden." },
  forbidden: { status: 403, message: "Esto es de otro enjambre." },
  not_found: { status: 404, message: "Eso no existe en el panal." },
  email_taken: { status: 409, message: "Ese correo ya tiene un panal." },
  cell_already_filled: { status: 409, message: "Esa celda ya estaba llena." },
  cell_not_assigned: { status: 409, message: "Esa celda está asignada a otra abeja." },
  high_priority_full: {
    status: 409,
    message: "Ya tienes tres celdas de prioridad alta. Termina una antes de marcar otra.",
  },
  hive_closed: { status: 409, message: "Esta colmena ya está cerrada." },
  already_member: { status: 409, message: "Ya eres parte de esta colmena." },
  owner_cannot_leave: {
    status: 409,
    message: "Quien fundó la colmena no puede salir mientras haya otras abejas.",
  },
  invite_expired: {
    status: 410,
    message: "Esta invitación ya no está activa. Pide a tu enjambre un enlace nuevo.",
  },
  too_many_attempts: {
    status: 429,
    message: "Demasiados intentos. Espera unos minutos y vuelve a probar.",
  },
  internal_error: { status: 500, message: "Algo falló de nuestro lado. Vuelve a intentarlo." },
};

export const MAX_HIGH_PRIORITY = 3;
export const DEFAULT_DAILY_GOAL = 5;
