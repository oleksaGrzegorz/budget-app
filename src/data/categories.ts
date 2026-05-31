export const categoryGroups = [
  {
    name: "Mortgage",
    emoji: "🏦",
    iconClassName: "bg-violet-200 ring-violet-300",
    categories: ["Mortgage", "Property tax"],
  },
  {
    name: "Food",
    emoji: "🛒",
    iconClassName: "bg-emerald-200 ring-emerald-300",
    categories: ["Groceries", "Eating out"],
  },
  {
    name: "Car",
    emoji: "🚗",
    iconClassName: "bg-blue-200 ring-blue-300",
    categories: [
      "Fuel - Dacia",
      "Fuel - Renault",
      "Car tax",
      "Car insurance",
      "Car repairs & parts",
    ],
  },
  {
    name: "Bills",
    emoji: "🧾",
    iconClassName: "bg-amber-200 ring-amber-300",
    categories: [
      "Electricity",
      "Water",
      "Internet",
      "RISK",
      "DELA",
      "Heating",
      "Liability insurance",
      "Phone",
      "ING cards",
    ],
  },
  {
    name: "Health",
    emoji: "🏥",
    iconClassName: "bg-rose-200 ring-rose-300",
    categories: ["Health insurance", "Dentist & medicine"],
  },
  {
    name: "Home",
    emoji: "🏠",
    iconClassName: "bg-orange-200 ring-orange-300",
    categories: ["Renovations", "Home items", "Watches & etc"],
  },
  {
    name: "Child",
    emoji: "👶",
    iconClassName: "bg-pink-200 ring-pink-300",
    categories: ["Child"],
  },
  {
    name: "Dog",
    emoji: "🐶",
    iconClassName: "bg-green-200 ring-green-300",
    categories: ["Dog"],
  },
  {
    name: "Personal",
    emoji: "🧍",
    iconClassName: "bg-sky-200 ring-sky-300",
    categories: ["Hairdresser", "Clothes & shoes"],
  },
  {
    name: "Sport",
    emoji: "💪",
    iconClassName: "bg-lime-200 ring-lime-300",
    categories: ["Gym"],
  },
  {
    name: "Entertainment",
    emoji: "🎉",
    iconClassName: "bg-fuchsia-200 ring-fuchsia-300",
    categories: ["Entertainment", "Flights", "Theme parks & attractions", "Massage"],
  },
  {
    name: "Currency",
    emoji: "💱",
    iconClassName: "bg-cyan-200 ring-cyan-300",
    categories: ["Currency exchange"],
  },
  {
    name: "Other",
    emoji: "📦",
    iconClassName: "bg-slate-300 ring-slate-400",
    categories: ["Other"],
  },
];

export const categories = categoryGroups.flatMap((group) => group.categories);

export const categoryEmojis: Record<string, string> = Object.fromEntries(
  categoryGroups.flatMap((group) =>
    group.categories.map((category) => [category, group.emoji]),
  ),
);

export const categoryIconClassNames: Record<string, string> = Object.fromEntries(
  categoryGroups.flatMap((group) =>
    group.categories.map((category) => [category, group.iconClassName]),
  ),
);