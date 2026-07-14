import { useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

export interface CategoryComboboxOption {
  name: string;
  groupName?: string;
  emoji: string;
  iconClassName: string;
}

interface CategoryComboboxProps {
  id: string;
  options: readonly CategoryComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  focusClassName: string;
  error?: string;
}

const normalizeSearchValue = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pl-PL")
    .replace(/ł/g, "l")
    .trim();

export const CategoryCombobox = ({
  id,
  options,
  value,
  onChange,
  focusClassName,
  error,
}: CategoryComboboxProps) => {
  const [query, setQuery] = useState("");

  const selectedOption =
    options.find((option) => option.name === value) ?? null;

  const normalizedQuery = normalizeSearchValue(query);

  const filteredOptions =
    normalizedQuery === ""
      ? options
      : options.filter((option) =>
          normalizeSearchValue(
            `${option.name} ${option.groupName ?? ""}`,
          ).includes(normalizedQuery),
        );

  const errorId = `${id}-error`;

  return (
    <div>
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wide text-slate-500"
      >
        Category
      </label>

      <Combobox
        immediate
        by="name"
        value={selectedOption}
        invalid={Boolean(error)}
        onChange={(nextOption: CategoryComboboxOption | null) => {
          onChange(nextOption?.name ?? "");
          setQuery("");
        }}
        onClose={() => setQuery("")}
      >
        <div className="relative mt-1.5">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
            {selectedOption ? (
              <span
                aria-hidden="true"
                className={`flex h-6 w-6 items-center justify-center rounded-md text-sm ring-1 ${selectedOption.iconClassName}`}
              >
                {selectedOption.emoji}
              </span>
            ) : (
              <span aria-hidden="true" className="text-lg">
                🔎
              </span>
            )}
          </span>

          <ComboboxInput
            id={id}
            autoComplete="off"
            aria-required="true"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            placeholder="Search category..."
            displayValue={(option: CategoryComboboxOption | null) =>
              option?.name ?? ""
            }
            onChange={(event) => {
              setQuery(event.target.value);

              if (value) {
                onChange("");
              }
            }}
            className={`h-11 w-full rounded-lg border py-2 pl-11 pr-11 text-sm outline-none transition-all duration-300 focus-visible:ring-2 ${
              error
                ? "border-rose-500 focus-visible:border-rose-500 focus-visible:ring-rose-100"
                : `border-slate-300 ${focusClassName}`
            }`}
          />

          <ComboboxButton
            type="button"
            aria-label="Open category list"
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-slate-500 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-400"
          >
            <span aria-hidden="true">⌄</span>
          </ComboboxButton>
        </div>

        <ComboboxOptions
          anchor="bottom start"
          className="z-50 max-h-80 w-[var(--input-width)] overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white p-2 shadow-xl outline-none [--anchor-gap:6px] [--anchor-padding:8px]"
        >
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-slate-500">
              No matching category
            </div>
          ) : (
            filteredOptions.map((option) => (
              <ComboboxOption
                key={option.name}
                value={option}
                className="group flex cursor-default items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 outline-none data-focus:bg-slate-100 data-selected:font-semibold"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm ring-1 ${option.iconClassName}`}
                >
                  {option.emoji}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate">{option.name}</span>

                  {option.groupName && (
                    <span className="block truncate text-xs font-normal text-slate-400">
                      {option.groupName}
                    </span>
                  )}
                </span>

                <span
                  aria-hidden="true"
                  className="invisible text-slate-700 group-data-selected:visible"
                >
                  ✓
                </span>
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </Combobox>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-xs font-medium text-rose-700"
        >
          {error}
        </p>
      )}
    </div>
  );
};