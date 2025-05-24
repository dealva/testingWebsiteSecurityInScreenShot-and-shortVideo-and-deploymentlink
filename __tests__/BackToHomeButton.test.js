/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import BackToHomeButton from "@/components/common/BackToHomeButton";
import { redirect } from "next/navigation";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("BackToHomeButton", () => {
  it("renders the Home button", () => {
    render(<BackToHomeButton />);
    expect(screen.getByRole("button", { name: /home/i })).toBeInTheDocument();
  });

  it("calls redirect('/home') when clicked", () => {
    render(<BackToHomeButton />);
    const button = screen.getByRole("button", { name: /home/i });
    fireEvent.click(button);
    expect(redirect).toHaveBeenCalledWith("/home");
  });

});
