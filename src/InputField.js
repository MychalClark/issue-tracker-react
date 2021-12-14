function InputField({ label, id, error, className, type, ...rest }) {
  const inputClasses = 'form-control ' + (error ? 'is-invalid' : 'is-valid');

  return (

    <div>
      {console.log(type)}
  {type !== "textarea" && ( 
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input className={inputClasses} id={id} {...rest} />
      {error && <div className="text-danger mt-2">{error}</div>}
    </div>)}

    {type === "textarea" && ( 
    <div>
    
      <textarea  className={inputClasses} id={id} {...rest} />
      {error && <div className="text-danger mt-2">{error}</div>}
    </div>)}

    </div>
  );
}
export default InputField;
