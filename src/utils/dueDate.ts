export const getDueDate = (maintainceDate: string, days: number): Date => {
  const date = new Date(maintainceDate);
  const dueDate = new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

  return dueDate;
};