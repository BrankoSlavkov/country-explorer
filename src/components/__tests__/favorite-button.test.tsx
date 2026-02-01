import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { localStorageFavorites } from "~/lib/favorites";
import { FavoriteButton } from "../favorite-button";

describe("FavoriteButton", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows 'Add to favorites' for non-favorited country", () => {
    render(<FavoriteButton countryCode="USA" />);

    expect(screen.getByLabelText("Add to favorites")).toBeInTheDocument();
  });

  it("shows 'Remove from favorites' for favorited country", () => {
    localStorageFavorites.toggle("USA");
    render(<FavoriteButton countryCode="USA" />);

    expect(screen.getByLabelText("Remove from favorites")).toBeInTheDocument();

    localStorageFavorites.toggle("USA"); // cleanup
  });

  it("toggles favorite state on click", async () => {
    const user = userEvent.setup();
    render(<FavoriteButton countryCode="USA" />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Add to favorites");

    await user.click(button);
    expect(button).toHaveAttribute("aria-label", "Remove from favorites");

    await user.click(button);
    expect(button).toHaveAttribute("aria-label", "Add to favorites");
  });
});
