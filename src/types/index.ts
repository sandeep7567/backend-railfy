export interface TaskType {
  _id?: string;
  title: string;
  days: number;
  maintainceDate: string;
  description?: string | undefined;
  dueDate?: string | undefined;
};