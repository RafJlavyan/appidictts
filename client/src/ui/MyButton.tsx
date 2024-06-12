import React, { ReactNode } from "react";
import Button, { ButtonProps } from "@mui/material/Button";

interface MyButtonProps extends ButtonProps {
  bg: string;
  children: ReactNode;
}

const MyButton: React.FC<MyButtonProps> = ({ bg, children, ...props }) => {
  return (
    <Button {...props} style={{ backgroundColor: bg }}>
      {children}
    </Button>
  );
};

export default MyButton;
