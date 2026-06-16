import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  NoProjectsEmpty,
  NoQuotesEmpty,
  NoReviewsEmpty,
  NoNotificationsEmpty,
  NoSearchResultsEmpty,
  NoDataEmpty,
} from "@/components/shared/empty-states";

describe("pre-built empty states", () => {
  it("NoProjectsEmpty renders correct title and description", () => {
    render(<NoProjectsEmpty />);
    expect(screen.getByText("No projects yet")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Post a new project to get started and connect with skilled contractors"
      )
    ).toBeInTheDocument();
  });

  it("NoQuotesEmpty renders correct title and description", () => {
    render(<NoQuotesEmpty />);
    expect(screen.getByText("No quotes received")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Contractors will submit quotes once you post your project"
      )
    ).toBeInTheDocument();
  });

  it("NoReviewsEmpty renders correct title and description", () => {
    render(<NoReviewsEmpty />);
    expect(screen.getByText("No reviews yet")).toBeInTheDocument();
  });

  it("NoNotificationsEmpty renders all caught up message", () => {
    render(<NoNotificationsEmpty />);
    expect(screen.getByText("All caught up!")).toBeInTheDocument();
    expect(
      screen.getByText("No new notifications at the moment")
    ).toBeInTheDocument();
  });

  it("NoSearchResultsEmpty renders search message", () => {
    render(<NoSearchResultsEmpty />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("NoDataEmpty renders unavailable data message", () => {
    render(<NoDataEmpty />);
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });
});
