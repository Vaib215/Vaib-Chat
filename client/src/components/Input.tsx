import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement,
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
>(({ className, id, children, ...rest}, ref) => {
  return (
    <div className="form-control w-full">
      <label htmlFor={id} className="label">
        <span className="label-text">{children}</span>
      </label>
      <input ref={ref} {...rest} id={id} className={`input input-bordered ${className}`} />
    </div>
  );
});

