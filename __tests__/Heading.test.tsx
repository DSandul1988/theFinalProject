import React from "react";
import { render, screen } from "@testing-library/react";
import Heading from "@/app/Components/Heading";

describe("Heading Component", () => {
  it("renders the title correctly", () => {
    const title = "Test Title";
    render(<Heading title={title} />);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("renders the subtitle when provided", () => {
    const title = "Test Title";
    const subtitle = "Test Subtitle";
    render(<Heading title={title} subtitle={subtitle} />);
    expect(screen.getByText(subtitle)).toBeInTheDocument();
  });

  it("does not render a subtitle when none is provided", () => {
    const title = "Test Title";
    render(<Heading title={title} />);
    const subtitle = screen.queryByText(/Test Subtitle/i);
    expect(subtitle).toBeNull();
  });

  it("applies text-center class when center prop is true", () => {
    const title = "Centered Title";
    render(<Heading title={title} center />);
    const divElement = screen.getByText(title).parentElement;
    expect(divElement).toHaveClass("text-center");
  });

  it("applies text-start class when center prop is false or undefined", () => {
    const title = "Left Aligned Title";
    render(<Heading title={title} />);
    const divElement = screen.getByText(title).parentElement;
    expect(divElement).toHaveClass("text-start");
  });

  it("renders the creation date when provided", () => {
    const title = "Title";
    const createdAt = "2022-01-01";
    render(<Heading title={title} createdAt={createdAt} />);
    const dateText = screen.getByText(/The user was created at:/i);
    expect(dateText).toBeInTheDocument();
  });

  it("renders the email when provided", () => {
    const title = "Title";
    const email = "test@example.com";
    render(<Heading title={title} email={email} />);
    const emailText = screen.getByText(/The user email is:/i);
    expect(emailText).toBeInTheDocument();
  });

  it("does not render creation date or email when not provided", () => {
    const title = "Title";
    render(<Heading title={title} />);
    const createdAtText = screen.queryByText(/The user was created at:/i);
    const emailText = screen.queryByText(/The user email is:/i);
    expect(createdAtText).toBeNull();
    expect(emailText).toBeNull();
  });
});
