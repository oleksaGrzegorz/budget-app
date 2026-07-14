import {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useId,
  useState,
} from "react";

import { budgetSummaryLabels } from "../../../../../data/budgetSummaryLabels";
import { categoryGroups } from "../../../../../data/categories";
import { months } from "../../../../../data/months";
import type { Entry } from "../../../types/entry";
import {
  CategoryCombobox,
  type CategoryComboboxOption,
} from "./CategoryCombobox";

interface FormProps {
  selectedYear: string;
  setEntries: Dispatch<SetStateAction<Entry[]>>;
}

type FormType = "expense" | "income";

interface FormErrors {
  amount?: string;
  category?: string;
  month?: string;
  form?: string;
}

const expenseCategoryOptions: CategoryComboboxOption[] =
  categoryGroups.flatMap((group) =>
    group.categories.map((category) => ({
      name: category,
      groupName: group.name,
      emoji: group.emoji,
      iconClassName: group.iconClassName,
    })),
  );

const incomeCategoryOptions: CategoryComboboxOption[] =
  budgetSummaryLabels.map((category) => ({
    name: category,
    groupName: "Income",
    emoji: "💰",
    iconClassName: "bg-emerald-200 ring-emerald-300",
  }));

const parseAmount = (value: string): number | null => {
  const normalizedValue = value.trim().replace(",", ".");

  if (!/^\d+(?:\.\d{1,2})?$/.test(normalizedValue)) {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return Math.round(parsedValue * 100) / 100;
};

export const Form = ({ selectedYear, setEntries }: FormProps) => {
  const formId = useId();

  const headingId = `${formId}-heading`;
  const amountId = `${formId}-amount`;
  const amountHintId = `${formId}-amount-hint`;
  const amountErrorId = `${formId}-amount-error`;
  const categoryId = `${formId}-category`;
  const monthId = `${formId}-month`;
  const monthErrorId = `${formId}-month-error`;
  const formErrorId = `${formId}-form-error`;
  const statusId = `${formId}-status`;

  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  const [amountInput, setAmountInput] = useState("");
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState(currentMonth);
  const [formType, setFormType] = useState<FormType>("expense");
  const [errors, setErrors] = useState<FormErrors>({});
  const [statusMessage, setStatusMessage] = useState("");

  const isExpense = formType === "expense";

  const categoryOptionsToShow = isExpense
    ? expenseCategoryOptions
    : incomeCategoryOptions;

  const accent = isExpense
    ? {
        focus: "focus-visible:border-rose-300 focus-visible:ring-rose-100",
        button: "bg-rose-500 hover:bg-rose-600 focus-visible:ring-rose-100",
      }
    : {
        focus:
          "focus-visible:border-emerald-300 focus-visible:ring-emerald-100",
        button:
          "bg-emerald-500 hover:bg-emerald-600 focus-visible:ring-emerald-100",
      };

  const getFieldStateClasses = (hasError: boolean) => {
    if (hasError) {
      return "border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-100";
    }

    return `border-slate-300 ${accent.focus}`;
  };

  const clearFieldError = (field: keyof FormErrors) => {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const handleTypeChange = (type: FormType) => {
    setFormType(type);
    setCategory("");
    clearFieldError("category");
    setStatusMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedAmount = parseAmount(amountInput);
    const nextErrors: FormErrors = {};

    if (normalizedAmount === null) {
      nextErrors.amount =
        "Enter an amount greater than 0 with no more than two decimal places.";
    }

    if (!category) {
      nextErrors.category = "Choose a transaction category.";
    }

    if (!month) {
      nextErrors.month = "Choose a month.";
    }

    if (!selectedYear) {
      nextErrors.form = "Choose a year before adding the transaction.";
    }

    if (Object.keys(nextErrors).length > 0 || normalizedAmount === null) {
      setErrors(nextErrors);
      setStatusMessage("");
      return;
    }

    setEntries((previousEntries) => [
      ...previousEntries,
      {
        id: crypto.randomUUID(),
        formType,
        category,
        month,
        year: selectedYear,
        amount: normalizedAmount,
      },
    ]);

    const transactionLabel = isExpense ? "Expense" : "Income";

    setStatusMessage(
      `${transactionLabel} of ${normalizedAmount.toFixed(2)} EUR was added.`,
    );

    setAmountInput("");
    setCategory("");
    setErrors({});
  };

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-col gap-5 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 shadow-sm sm:h-12 sm:w-12"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white">
              <span className="-mt-px text-[22px] leading-none text-slate-900">
                ✎
              </span>
            </div>
          </div>

          <h2
            id={headingId}
            className="min-w-0 truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
          >
            Add transaction
          </h2>
        </div>

        <fieldset className="w-full sm:w-auto">
          <legend className="sr-only">Transaction type</legend>

          <div className="relative grid w-full grid-cols-2 rounded-xl bg-slate-100 p-1 sm:w-auto">
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-lg shadow-sm transition-all duration-300 ease-out motion-reduce:transition-none ${
                isExpense
                  ? "translate-x-0 bg-rose-500"
                  : "translate-x-full bg-emerald-500"
              }`}
            />

            <button
              type="button"
              aria-pressed={isExpense}
              onClick={() => handleTypeChange("expense")}
              className={`relative z-10 rounded-lg px-5 py-2 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-4 motion-reduce:transition-none ${
                isExpense
                  ? "text-white focus-visible:ring-rose-100"
                  : "text-slate-500 hover:text-slate-800 focus-visible:ring-slate-200"
              }`}
            >
              Expense
            </button>

            <button
              type="button"
              aria-pressed={!isExpense}
              onClick={() => handleTypeChange("income")}
              className={`relative z-10 rounded-lg px-5 py-2 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-4 motion-reduce:transition-none ${
                !isExpense
                  ? "text-white focus-visible:ring-emerald-100"
                  : "text-slate-500 hover:text-slate-800 focus-visible:ring-slate-200"
              }`}
            >
              Income
            </button>
          </div>
        </fieldset>
      </div>

      <div aria-hidden="true" className="h-px bg-slate-100" />

      <form
        noValidate
        onSubmit={handleSubmit}
        aria-describedby={errors.form ? formErrorId : undefined}
        className="mt-6 grid items-start gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]"
      >
        <div>
          <label
            htmlFor={amountId}
            className="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Amount
          </label>

          <div className="relative mt-1.5">
            <input
              id={amountId}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={amountInput}
              placeholder="e.g. 250.00"
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={
                errors.amount
                  ? `${amountHintId} ${amountErrorId}`
                  : amountHintId
              }
              onChange={(event) => {
                setAmountInput(event.target.value);
                clearFieldError("amount");
                setStatusMessage("");
              }}
              className={`h-11 w-full rounded-lg border px-3 pr-9 text-sm outline-none transition-all duration-300 focus-visible:ring-2 motion-reduce:transition-none ${getFieldStateClasses(
                Boolean(errors.amount),
              )}`}
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400"
            >
              €
            </span>
          </div>

          <p id={amountHintId} className="mt-1.5 text-xs text-slate-500">
            You can use a comma or dot as the decimal separator.
          </p>

          {errors.amount && (
            <p
              id={amountErrorId}
              role="alert"
              className="mt-1.5 text-xs font-medium text-rose-700"
            >
              {errors.amount}
            </p>
          )}
        </div>

        <CategoryCombobox
          key={formType}
          id={categoryId}
          options={categoryOptionsToShow}
          value={category}
          error={errors.category}
          focusClassName={accent.focus}
          onChange={(nextCategory) => {
            setCategory(nextCategory);
            clearFieldError("category");
            setStatusMessage("");
          }}
        />

        <div>
          <label
            htmlFor={monthId}
            className="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Month
          </label>

          <select
            id={monthId}
            value={month}
            required
            aria-invalid={Boolean(errors.month)}
            aria-describedby={errors.month ? monthErrorId : undefined}
            onChange={(event) => {
              setMonth(event.target.value);
              clearFieldError("month");
              setStatusMessage("");
            }}
            className={`mt-1.5 h-11 w-full rounded-lg border px-3 text-sm outline-none transition-all duration-300 focus-visible:ring-2 motion-reduce:transition-none ${getFieldStateClasses(
              Boolean(errors.month),
            )}`}
          >
            <option value="">Choose month</option>

            {months.map((monthOption) => (
              <option key={monthOption} value={monthOption}>
                {monthOption}
              </option>
            ))}
          </select>

          {errors.month && (
            <p
              id={monthErrorId}
              role="alert"
              className="mt-1.5 text-xs font-medium text-rose-700"
            >
              {errors.month}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`mt-[26px] h-11 rounded-lg px-8 text-sm font-semibold text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 motion-reduce:transition-none ${accent.button}`}
        >
          Add
        </button>

        {errors.form && (
          <p
            id={formErrorId}
            role="alert"
            className="text-sm font-medium text-rose-700 lg:col-span-4"
          >
            {errors.form}
          </p>
        )}

        <p
          id={statusId}
          role="status"
          aria-live="polite"
          className="min-h-5 text-sm font-medium text-emerald-700 lg:col-span-4"
        >
          {statusMessage}
        </p>
      </form>
    </section>
  );
};