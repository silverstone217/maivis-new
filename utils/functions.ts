export const isEmptyString = (value: string) => {
  return value.replace(/ /g, "") === "";
};

export const isEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

// capitalize first letter
export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return ""; // Vérifie si le texte est vide ou null
  return text.charAt(0).toUpperCase() + text.slice(1);
};
