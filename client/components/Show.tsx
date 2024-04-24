import { ReactNode } from "react";

type ShowProps = {
  children: ReactNode;
  active: boolean;
};

const Show: React.FC<ShowProps> = ({ children, active }) => {
  if (active) return <>{children}</>;
  else return null
}

export default Show;