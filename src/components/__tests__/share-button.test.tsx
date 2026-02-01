import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ShareButton } from "../share-button";

describe("ShareButton", () => {
  const originalShare = navigator.share;

  beforeEach(() => {
    Object.defineProperty(navigator, "share", {
      writable: true,
      value: vi.fn().mockResolvedValue(undefined),
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, "share", {
      writable: true,
      value: originalShare,
    });
  });

  it("renders only when Web Share API is available", () => {
    render(<ShareButton title="Test" />);
    expect(screen.getByLabelText("Share")).toBeInTheDocument();

    Object.defineProperty(navigator, "share", {
      writable: true,
      value: undefined,
    });
    const { container } = render(<ShareButton title="Test" />);
    expect(container.querySelector("button")).toBeNull();
  });

  it("calls navigator.share with title and current URL", async () => {
    const mockShare = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", {
      writable: true,
      value: mockShare,
    });

    const user = userEvent.setup();
    render(<ShareButton title="Test Country" />);

    await user.click(screen.getByLabelText("Share"));

    expect(mockShare).toHaveBeenCalledWith({
      title: "Test Country",
      url: window.location.href,
    });
  });
});
