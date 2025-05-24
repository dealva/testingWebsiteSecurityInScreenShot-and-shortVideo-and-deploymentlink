const SubmitButton = ({ text, loading }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-2 px-4 bg-green-600 text-white rounded"
    >
      {loading ? `${text} in process...` : text}
    </button>
  );
};
  
export default SubmitButton;
  