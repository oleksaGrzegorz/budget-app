export const Form = ({ amount, setAmount, setExpense }) => (
  <form
    className="p-10 border border-black m-10"
    onSubmit={(e) => {
      e.preventDefault();
      setExpense(prev => prev + amount);
      setAmount(0);

    }}
  >
    <input
      className="border border-red-400"
      type="number"
      placeholder="Kwota"
      value={amount}
      onChange={(e) => setAmount(Number(e.target.value))}
    />
    <button className="bg-blue-500 border border-black">Dodaj</button>
  </form>
);
