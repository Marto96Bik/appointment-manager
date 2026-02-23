import { KNOWN_PREFIXES } from "./phone.config";

export function splitPhone(fullPhone: string) {
  for (const prefix of KNOWN_PREFIXES) {
    if (fullPhone.startsWith(prefix)) {
      return {
        prefix,
        localNumber: fullPhone.replace(prefix, ""),
        isCustom: false,
      };
    }
  }

  if (fullPhone.startsWith("+")) {
    const match = fullPhone.match(/^\+\d{1,4}/);
    const custom = match ? match[0] : "+";
    return {
      prefix: custom,
      localNumber: fullPhone.replace(custom, ""),
      isCustom: true,
    };
  }

  return {
    prefix: "",
    localNumber: fullPhone,
    isCustom: false,
  };
}

export function buildPhone(prefix: string, localNumber: string) {
  return `${prefix}${localNumber}`;
}
