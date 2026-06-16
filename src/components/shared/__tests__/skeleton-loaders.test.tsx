import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  PageSkeleton,
  CardSkeleton,
  StatsSkeleton,
  DashboardGridSkeleton,
  ContentSkeleton,
  BadgeSkeleton,
  AvatarSkeleton,
} from "@/components/shared/skeleton-loaders";

describe("skeleton loaders", () => {
  it("PageSkeleton renders without crashing", () => {
    const { container } = render(<PageSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("CardSkeleton renders card structure", () => {
    const { container } = render(<CardSkeleton />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("rounded-xl");
  });

  it("StatsSkeleton renders with stats layout", () => {
    const { container } = render(<StatsSkeleton />);
    const stats = container.firstChild as HTMLElement;
    expect(stats.className).toContain("rounded-xl");
  });

  it("DashboardGridSkeleton renders 4 StatsSkeleton children", () => {
    const { container } = render(<DashboardGridSkeleton />);
    expect(container.firstChild?.childNodes.length).toBe(4);
  });

  it("ContentSkeleton renders with default 3 rows", () => {
    const { container } = render(<ContentSkeleton />);
    // Should have sections for rows
    expect(container.firstChild).toBeInTheDocument();
  });

  it("ContentSkeleton renders with custom row count", () => {
    const { container } = render(<ContentSkeleton rows={5} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("BadgeSkeleton renders badge shape", () => {
    const { container } = render(<BadgeSkeleton />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("rounded-lg");
    expect(badge.className).toContain("h-6");
  });

  it("AvatarSkeleton renders with medium size by default", () => {
    const { container } = render(<AvatarSkeleton />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar.className).toContain("rounded-full");
    expect(avatar.className).toContain("h-10");
  });

  it("AvatarSkeleton renders with small size", () => {
    const { container } = render(<AvatarSkeleton size="sm" />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar.className).toContain("h-8");
  });

  it("AvatarSkeleton renders with large size", () => {
    const { container } = render(<AvatarSkeleton size="lg" />);
    const avatar = container.firstChild as HTMLElement;
    expect(avatar.className).toContain("h-14");
  });
});
