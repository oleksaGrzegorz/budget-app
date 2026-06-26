import type { Forecast } from "../../data/initialForecast";
import { getIncomeForecastMetrics } from "../../hooks/getIncomeForecastMetrics";
import type { BudgetData } from "../../types/budgetData";
import { AnnualSavingsProgress } from "./AnnualSavingsProgress";
import { ForecastAssumptionsTable } from "./ForecastAssumptionsTable";
import { MonthlyNotes } from "./MonthlyNotes";
import { MonthlyPerformanceTable } from "./MonthlyPerformanceTable";

interface IncomeForecastTableProps {
  incomes: BudgetData;
  expenses: BudgetData;
  forecast: Forecast;
  setForecast: React.Dispatch<React.SetStateAction<Forecast>>;
}

export const IncomeForecastTable = ({
  incomes,
  expenses,
  forecast,
  setForecast,
}: IncomeForecastTableProps) => {
  const {
    getActualIncome,
    getActualExpenses,
    getPlannedIncome,
    getPlannedExpenses,
    getSavingsGoal,
    getActualSavings,
    hasActualData,
    getRating,
    getYearTotal,
    getAverage,
    getActualAverage,
    getActualYearTotal,
    getAverageRating,
    getActualIncomeByCategory,
    annualGoal,
    annualResult,
    forecastedYearEnd,
    forecastGap,
    actualProgress,
    forecastProgress,
    gapProgress,
    forecastedProgress,
    savedProgress,
    remainingForecast,
  } = getIncomeForecastMetrics(incomes, expenses, forecast);

  return (
    <div>
      <AnnualSavingsProgress
        annualGoal={annualGoal}
        annualResult={annualResult}
        forecastedYearEnd={forecastedYearEnd}
        forecastGap={forecastGap}
        actualProgress={actualProgress}
        forecastProgress={forecastProgress}
        gapProgress={gapProgress}
        forecastedProgress={forecastedProgress}
        savedProgress={savedProgress}
        remainingForecast={remainingForecast}
        averageMonthlyResult={getActualAverage(getActualSavings)}
        averageRating={getAverageRating()}
      />

      <MonthlyPerformanceTable
        getActualIncome={getActualIncome}
        getPlannedIncome={getPlannedIncome}
        getActualExpenses={getActualExpenses}
        getPlannedExpenses={getPlannedExpenses}
        getSavingsGoal={getSavingsGoal}
        getActualSavings={getActualSavings}
        hasActualData={hasActualData}
        getRating={getRating}
        getAverageRating={getAverageRating}
        getActualAverage={getActualAverage}
        getActualYearTotal={getActualYearTotal}
        getAverage={getAverage}
        getYearTotal={getYearTotal}
      />

      <ForecastAssumptionsTable
        forecast={forecast}
        setForecast={setForecast}
        getAverage={getAverage}
        getYearTotal={getYearTotal}
        getActualIncomeByCategory={getActualIncomeByCategory}
        getPlannedExpenses={getPlannedExpenses}
        getActualAverage={getActualAverage}
        getActualYearTotal={getActualYearTotal}
        getActualExpenses={getActualExpenses}
        hasActualData={hasActualData}
      />

      <MonthlyNotes forecast={forecast} setForecast={setForecast} />
    </div>
  );
};