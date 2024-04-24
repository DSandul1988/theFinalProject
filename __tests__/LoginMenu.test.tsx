import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import LoginMenuItem from "@/app/Components/NavigationBar/LoginMenuItem";

describe("LoginMenuItem", () => {
  it("should call onClick when clicked", async () => {
    const handleClick = jest.fn();
    const label = "Test Item";

    // Render the component with the mocked click handler and a label
    render(<LoginMenuItem onClick={handleClick} label={label} />);

    // Find the menu item by text and click it
    const menuItem = screen.getByText(label);
    await userEvent.click(menuItem);

    // Verify that the onClick handler was called once
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
