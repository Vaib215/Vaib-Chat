import { ReactNode } from "react";

type FullScreenCardProps = {
  children: ReactNode;
};

export const FullScreenCard = ({ children }: FullScreenCardProps) => {
  return (
    <div className="flex flex-col justify-center min-h-screen items-center ">
      {children}
    </div>
  );
};

FullScreenCard.Body = ({ children }: FullScreenCardProps) => {
  return (
    <div className="card w-96 bg-neutral text-neutral-content">
      <div className="card-body items-center text-center w-full">{children}</div>
    </div>
  );
};

FullScreenCard.BelowCard = ({ children }: FullScreenCardProps) => {
  return <div className="mt-2 justify-center flex gap-3">{children}</div>;
};
