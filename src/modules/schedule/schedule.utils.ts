export const convertDateTime = async (date: Date) => {
  const offset = date.getTimezoneOffset() * 6000;
  return new Date(date.getTime() + offset);
};
