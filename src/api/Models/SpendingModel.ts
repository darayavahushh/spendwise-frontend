import { CategorySpendingModel } from "./CategorySpending";

export type SpendingModel = {
  total_sum: number;
  categories: CategorySpendingModel[];
}