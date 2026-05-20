export const categoryGroups = [
  {
    name: "Kredyt",
    emoji: "🏦",
    iconClassName: "bg-violet-200 ring-violet-300",
    categories: ["Kredyt", "Podatek od nieruchomości"],
  },

  {
    name: "Jedzenie",
    emoji: "🛒",
    iconClassName: "bg-emerald-200 ring-emerald-300",
    categories: ["Jedzenie", "Jedzenie - miasto"],
  },

    {
    name: "Auto",
    emoji: "🚗",
    iconClassName: "bg-blue-200 ring-blue-300",
    categories: [
      "Paliwo - dacia",
      "Paliwo - renault",
      "Podatek auto",
      "Ubezpieczenie auta",
      "Naprawy aut i części",
    ],
  }, 

   {
    name: "Opłaty",
    emoji: "🧾",
    iconClassName: "bg-amber-200 ring-amber-300",
    categories: [
      "Energia",
      "Woda",
      "Internet",
      "RISK",
      "DELA",
      "PIEC",
      "Ubezpieczenie cywilne",
      "Telefon",
      "Karty ing",
    ],
  },

    {
    name: "Zdrowie",
    emoji: "🏥",
    iconClassName: "bg-rose-200 ring-rose-300",
    categories: ["Ubezpieczenie zdr", "Dentyści leki itd"],
  },

    {
    name: "Dom",
    emoji: "🏠",
    iconClassName: "bg-orange-200 ring-orange-300",
    categories: ["Remonty", "Rzeczy do domu"],
  },
  {
    name: "Dziecko",
    emoji: "👶",
    iconClassName: "bg-pink-200 ring-pink-300",
    categories: ["Dziecko"],
  },
  {
    name: "Pies",
    emoji: "🐶",
    iconClassName: "bg-green-200 ring-green-300",
    categories: ["Pies"],
  },

  {
    name: "Osobiste",
    emoji: "🧍",
    iconClassName: "bg-sky-200 ring-sky-300",
    categories: ["Fryzjer", "Ciuchy/obuwie"],
  },

 
  {
    name: "Sport",
    emoji: "💪",
    iconClassName: "bg-lime-200 ring-lime-300",
    categories: ["Siłownia"],
  },
  {
    name: "Przyjemności",
    emoji: "🎉",
    iconClassName: "bg-fuchsia-200 ring-fuchsia-300",
    categories: ["Rozrywka", "Samolot", "Parki rozrywki, atrakcje", "Masaze"],
  },

  {
    name: "Waluty",
    emoji: "💱",
    iconClassName: "bg-cyan-200 ring-cyan-300",
    categories: ["Wymiana walut"],
  },
  {
    name: "Inne",
    emoji: "📦",
    iconClassName: "bg-slate-300 ring-slate-400",
    categories: ["Inne"],
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