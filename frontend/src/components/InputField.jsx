const InputField = ({ type = "text", value, onChange, placeholder }) => (
  <input
    className="border p-2 mb-2 w-full"
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
);

export default InputField;
