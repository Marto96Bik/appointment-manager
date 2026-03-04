export const KNOWN_PREFIXES = ["+972", "+54", "+34", "+1", "+52"] as const;

export const COUNTRY_LIMITS: Record<string, number> = {
  "+972": 9, // Israel (ej. 50 266 9713 -> 9 dígitos)
  "+34": 9, // España
  "+1": 10, // US
  "+52": 10, // México
  "+54": 10, // Argentina (sin el 9 inicial de móvil para la API)
  custom: 15, // Límite internacional máximo
};
