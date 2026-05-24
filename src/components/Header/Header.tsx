export const Header = () => {
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header>
      <h1 className="text-center text-2xl font-bold">Home Budget</h1>
      <p className="text-center text-sm text-gray-600">{formattedDate}</p>
    </header>
  );
};