import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { EmptyState } from "@/components/shared/empty-states";

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("EmptyState", () => {
  const defaultProps = {
    icon: <span data-testid="test-icon">🔧</span>,
    title: "No items found",
    description: "There are no items to display right now.",
  };

  it("renders the title and description", () => {
    renderWithRouter(<EmptyState {...defaultProps} />);
    expect(screen.getByText("No items found")).toBeInTheDocument();
    expect(
      screen.getByText("There are no items to display right now.")
    ).toBeInTheDocument();
  });

  it("renders the icon", () => {
    renderWithRouter(<EmptyState {...defaultProps} />);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("renders an action button when actionText and actionHref are provided", () => {
    renderWithRouter(
      <EmptyState
        {...defaultProps}
        actionText="Create Item"
        actionHref="/new"
      />
    );
    const button = screen.getByRole("link", { name: /create item/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/new");
  });

  it("calls onActionClick when button is clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    renderWithRouter(
      <EmptyState
        {...defaultProps}
        actionText="Retry"
        onActionClick={handleClick}
      />
    );

    await user.click(screen.getByRole("button", { name: /retry/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not render an action button when no action props are provided", () => {
    renderWithRouter(<EmptyState {...defaultProps} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
