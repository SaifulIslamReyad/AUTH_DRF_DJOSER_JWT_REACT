import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const LinkButton = ({
  children,
  to,
  disabled = false,
  onClick,
  variant = "outlined",
  color = "primary",
  size = "small",
  component,
  startIcon,
  endIcon,
  ...props
}) => {
  const buttonProps = {
    variant,
    color,
    size,
    disabled,
    onClick,
    startIcon,
    endIcon,
    sx: {
      borderRadius: "25px",
      textTransform: "none",
      fontWeight: "medium",
      minWidth: "auto",
      "&:hover": {
        transform: "translateY(-1px)",
      },
      transition: "all 0.2s ease-in-out",
      ...props.sx,
    },
    ...props,
  };

  // If 'to' prop is provided, render as Link component
  if (to) {
    return (
      <Button component={Link} to={to} {...buttonProps}>
        {children}
      </Button>
    );
  }

  // If custom component is provided
  if (component) {
    return (
      <Button component={component} {...buttonProps}>
        {children}
      </Button>
    );
  }

  // Regular button
  return <Button {...buttonProps}>{children}</Button>;
};

export default LinkButton;
