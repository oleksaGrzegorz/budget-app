export const Form = () => (
  <form
    className="p-10 border border-black m-10"
    onSubmit={(e) => {
      e.preventDefault();
    }}
  >
    <input
      className="border border-red-400"
      type="number"
      placeholder="Kwota"
    />
    <button className="bg-blue-500 border border-black">Dodaj</button>
  </form>
);
