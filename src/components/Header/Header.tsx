export const Header = () => {
  const today = new Date();

  const formattedDate = today.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <header>
      <h1 className="text-2xl font-bold py-6 text-center">Budżet domowy</h1>
      <p className="text-center text-sm text-gray-600">{formattedDate}</p>
    </header>
  );
};
