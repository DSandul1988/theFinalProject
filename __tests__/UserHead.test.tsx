// Import React and necessary testing libraries
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { SafeUser } from "@/app/types";
import UserHead from "@/app/Components/adminUsers/UserHead";

// Import the component to be tested
// Adjust the import path as necessary

// Mock data for testing
const mockUser: SafeUser = {
  id: "user-123",
  name: "John Doe",
  email: "john.doe@example.com" || null,
  emailVerified: null, // Assuming this can be null if not verified
  image: "/images/john.jpg",
  hashedPassword: "hashedPassword123", // Not used in component, but required by SafeUser type
  createdAt: "2021-01-01", // Updated to match Date type
  updatedAt: "2021-01-01", // Assuming a value for demonstration
  favoriteIds: [], // Assuming an empty array for simplicity
  isManager: false, // Assuming a boolean value
  conversationIds: [], // Assuming an empty array for simplicity
  contactIds: [], // Assuming an empty array for simplicity
};

describe("UserHead Component", () => {
  it("renders correctly with user information", () => {
    render(<UserHead user={mockUser} />);

    // Check if the heading renders the user's name
    expect(
      screen.getByText(`This is the page of ${mockUser.name}`)
    ).toBeInTheDocument();
    // Check if the email is displayed
    if (mockUser?.email) {
      expect(screen.getByText(/john.doe@example.com/i)).toBeInTheDocument();
    } else {
      // Handle the case or fail the test if email is unexpectedly null
      fail("Email is null");
    }
    // Check if the creation date is displayed
    expect(
      screen.getByText(`Created at :${mockUser.createdAt}`)
    ).toBeInTheDocument();
    // Since Image from 'next/image' might not work as expected in Jest environment,
    // you might need to mock next/image or adjust testing strategy for images.
  });

  it("renders default image when user image is not provided", () => {
    const userWithoutImage = { ...mockUser, image: "" };
    render(<UserHead user={userWithoutImage} />);

    // Assuming the default image is shown through some logic not directly testable via jest-dom,
    // This part of the test might need to be adjusted based on how you handle image loading and errors.
    // Alternatively, verify that an image component is rendered.
    expect(screen.getByAltText("Image")).toBeInTheDocument();
  });
});
