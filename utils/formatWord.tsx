export const capitalizeWords = (str: string) =>
  str
    .toLowerCase()
    .split(" ")
    .filter((w) => w.trim() !== "")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
