export type Currency = "pln" | "eur";

type AccountDefinitionShape = {
  id: `${Currency}.${string}`;
  label: string;
  currency: Currency;
  activeFrom: string;
};

export const accountDefinitions = [
  {
    id: "pln.mBank",
    label: "PLN mBank",
    currency: "pln",
    activeFrom: "2023-01-01",
  },
  {
    id: "pln.cash",
    label: "PLN cash",
    currency: "pln",
    activeFrom: "2023-01-01",
  },
  {
    id: "pln.bonds",
    label: "Bonds",
    currency: "pln",
    activeFrom: "2023-01-01",
  },
  {
    id: "eur.mBank",
    label: "EUR mBank",
    currency: "eur",
    activeFrom: "2023-01-01",
  },
  {
    id: "eur.ing",
    label: "ING EUR",
    currency: "eur",
    activeFrom: "2023-01-01",
  },
  {
    id: "eur.cash",
    label: "EUR cash",
    currency: "eur",
    activeFrom: "2023-01-01",
  },
  {
    id: "eur.crypto",
    label: "Crypto",
    currency: "eur",
    activeFrom: "2023-01-01",
  },
  {
    id: "eur.broker",
    label: "Broker",
    currency: "eur",
    activeFrom: "2023-01-01",
  },
] as const satisfies readonly AccountDefinitionShape[];

export type AccountId = (typeof accountDefinitions)[number]["id"];
export type AccountDefinition = (typeof accountDefinitions)[number];

export interface AccountSnapshot {
  date: string;
  exchangeRate: number;
  balances: Partial<Record<AccountId, number>>;
}

type AccountSnapshotDraft = {
  date: string;
  exchangeRate: number | null;
  balances: Partial<Record<AccountId, number | null>>;
};

export const isAccountActiveOnDate = (
  account: AccountDefinition,
  date: string,
) => account.activeFrom <= date;

const normalizeSnapshot = (
  snapshot: AccountSnapshotDraft,
): AccountSnapshot | null => {
  if (snapshot.exchangeRate === null) return null;

  const balances: Partial<Record<AccountId, number>> = {};

  for (const account of accountDefinitions) {
    if (!isAccountActiveOnDate(account, snapshot.date)) continue;

    const balance = snapshot.balances[account.id];

    if (balance === null || balance === undefined) return null;

    balances[account.id] = balance;
  }

  return {
    date: snapshot.date,
    exchangeRate: snapshot.exchangeRate,
    balances,
  };
};

const isSnapshot = (
  snapshot: AccountSnapshot | null,
): snapshot is AccountSnapshot => snapshot !== null;

const accountSnapshotTemplate: AccountSnapshotDraft[] = [
  {
    date: "2023-01-01",
    exchangeRate: 4.66,
    balances: {
      "pln.mBank": 1975.41,
      "pln.cash": 7100,
      "pln.bonds": 30726,
      "eur.mBank": 46.97,
      "eur.ing": 3158.12,
      "eur.cash": 60,
      "eur.crypto": 0,
      "eur.broker": 5736.57,
    },
  },
  {
    date: "2023-02-01",
    exchangeRate: 4.75,
    balances: {
      "pln.mBank": 203.33,
      "pln.cash": 7659.5,
      "pln.bonds": 30921,
      "eur.mBank": 46.97,
      "eur.ing": 3067.75,
      "eur.cash": 0,
      "eur.crypto": 0,
      "eur.broker": 6014.46,
    },
  },
  {
    date: "2023-03-01",
    exchangeRate: 4.71,
    balances: {
      "pln.mBank": 69.34,
      "pln.cash": 7659.5,
      "pln.bonds": 31059,
      "eur.mBank": 46.97,
      "eur.ing": 780.21,
      "eur.cash": 310,
      "eur.crypto": 0,
      "eur.broker": 8900.90,
    },
  },
  {
    date: "2023-04-01",
    exchangeRate: 4.69,
    balances: {
      "pln.mBank": 1619.55,
      "pln.cash": 7859.5,
      "pln.bonds": 31215,
      "eur.mBank": 46.97,
      "eur.ing": 659.92,
      "eur.cash": 95,
      "eur.crypto": 0,
      "eur.broker": 8800.3,
    },
  },
  {
    date: "2023-05-01",
    exchangeRate: 4.59,
    balances: {
      "pln.mBank": 860.43,
      "pln.cash": 8693.5,
      "pln.bonds": 31392,
      "eur.mBank": 46.97,
      "eur.ing": 1115.88,
      "eur.cash": 170,
      "eur.crypto": 0,
      "eur.broker": 8682.44,
    },
  },
  {
    date: "2023-06-01",
    exchangeRate: 4.44,
    balances: {
      "pln.mBank": 2.13,
      "pln.cash": 6700,
      "pln.bonds": 31602,
      "eur.mBank": 46.97,
      "eur.ing": 3371.51,
      "eur.cash": 285,
      "eur.crypto": 0,
      "eur.broker": 9184.89,
    },
  },
  {
    date: "2023-07-01",
    exchangeRate: 4.45,
    balances: {
      "pln.mBank": 2279.72,
      "pln.cash": 1100,
      "pln.bonds": 31758,
      "eur.mBank": 1196.97,
      "eur.ing": 4250.2,
      "eur.cash": 135,
      "eur.crypto": 0,
      "eur.broker": 9090.72,
    },
  },
  
];

export const initialAccountSnapshots: AccountSnapshot[] = accountSnapshotTemplate
  .map(normalizeSnapshot)
  .filter(isSnapshot);