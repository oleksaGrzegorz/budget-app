import { budgetSummaryLabels } from "./budgetSummaryLabels";
import { months } from "./months";

export interface Forecast {
  incomes: Record<string, Record<string, number>>;
  plannedExpenses: Record<string, number | null>;
  ratings: Record<string, number | null>;
  notes: Record<string, string>;
}

const emptyMonthValues = Object.fromEntries(months.map((month) => [month, 0]));

export const initialForecast: Forecast = {
  incomes: {
    ...Object.fromEntries(
      budgetSummaryLabels.map((category) => [category, emptyMonthValues]),
    ),

    "Salary - Grzesiek": {
      "01": 2888.91,
      "02": 2930,
      "03": 6300,
      "04": 4360,
      "05": 3200,
      "06": 2850,
      "07": 2620,
      "08": 2950,
      "09": 3060,
      "10": 2810,
      "11": 2380,
      "12": 2870,
    },

    "Salary - Marta": {
      "01": 1600,
      "02": 1600,
      "03": 1600,
      "04": 1800,
      "05": 1800,
      "06": 1400,
      "07": 1800,
      "08": 1400,
      "09": 1800,
      "10": 1400,
      "11": 1400,
      "12": 1800,
    },

    "Other income": {
      "01": 326,
      "02": 75,
      "03": 75,
      "04": 370.07,
      "05": 75,
      "06": 75,
      "07": 325,
      "08": 75,
      "09": 75,
      "10": 325,
      "11": 75,
      "12": 75,
    },

    Refunds: {
      "01": 0,
      "02": 0,
      "03": 0,
      "04": 260.55,
      "05": 0,
      "06": 0,
      "07": 0,
      "08": 0,
      "09": 0,
      "10": 0,
      "11": 0,
      "12": 0,
    },

    Rent: {
      "01": 0,
      "02": 0,
      "03": 0,
      "04": 0,
      "05": 200,
      "06": 800,
      "07": 800,
      "08": 1000,
      "09": 800,
      "10": 800,
      "11": 1000,
      "12": 800,
    },
  },

  plannedExpenses: {
    "01": 4516.83,
    "02": 3936.31,
    "03": 5412.94,
    "04": 3743.49,
    "05": 4180.84,
    "06": 4200,
    "07": 4200,
    "08": 4200,
    "09": 4200,
    "10": 4200,
    "11": 4200,
    "12": 4200,
  },

ratings: Object.fromEntries(months.map((month) => [month, null])),

notes: {
  ...Object.fromEntries(months.map((month) => [month, ""])),
  "06": "rent: 600e/800e expected (200e less Kam - vacation)",
},
};

