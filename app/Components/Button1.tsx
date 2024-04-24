// Import the `clsx` library for conditionally joining classNames together.
import clsx from "clsx";

// Define TypeScript interface for the component's props.
interface ButtonProps {
  type?: "button" | "submit" | "reset" | undefined; // Optional prop to define the button's type attribute.
  fullWidth?: boolean; // Optional prop to determine if the button should be full width.
  children?: React.ReactNode; // Optional prop for button's children elements.
  onClick?: () => void; // Optional prop for click event handler.
  secondary?: boolean; // Optional prop to apply secondary button styling.
  danger?: boolean; // Optional prop to apply danger button styling.
  disabled?: boolean; // Optional prop to disable the button.
}

// Define a functional component 'Button' with props conforming to 'ButtonProps'.
const Button: React.FC<ButtonProps> = ({
  type = "button", // Default the button type to "button".
  fullWidth, // Destructure and assign props to variables for use within the component.
  children, // Children elements to be rendered inside the button.
  onClick, // Click event handler function.
  secondary, // Flag to indicate secondary styling.
  danger, // Flag to indicate danger styling.
  disabled, // Flag to indicate if the button is disabled.
}) => {
  // Return the button element.
  return (
    <button
      onClick={onClick} // Set the onClick handler to the provided function.
      type={type} // Set the button type.
      disabled={disabled} // Set the disabled state of the button.
      // Use `clsx` to conditionally apply classes based on the component's props.
      className={clsx(
        // Base classes for all button variants.
        `
        flex 
        justify-center 
        rounded-md 
        px-3 
        py-2 
        text-sm 
        font-semibold 
        focus-visible:outline 
        focus-visible:outline-2 
        focus-visible:outline-offset-2 
        `,
        disabled && "opacity-50 cursor-default", // Apply styles if the button is disabled.
        fullWidth && "w-full", // Apply full width if specified.
        secondary ? "text-gray-900" : "text-white", // Conditional class for secondary variant.
        danger &&
          "bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600", // Conditional classes for danger variant.
        !secondary &&
          !danger &&
          "bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600" // Default classes for primary variant when neither secondary nor danger are specified.
      )}
    >
      {children}
    </button>
  );
};

// Export 'Button' as the default export of this module.
export default Button;
