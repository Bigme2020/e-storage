export const getItemFromStorage = (
  type: "sessionStorage" | "localStorage",
  item: string
) => {
  const value = window[type].getItem(item);

  return value ? JSON.parse(value) : value;
};
