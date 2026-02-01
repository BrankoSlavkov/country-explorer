import { beforeEach, describe, expect, it, vi } from "vitest";
import { KEY, LocalStorageFavorites } from "../favorites";

describe("LocalStorageFavorites", () => {
  let favorites: LocalStorageFavorites;

  beforeEach(() => {
    localStorage.clear();
    favorites = new LocalStorageFavorites();
  });

  it("starts with empty favorites", () => {
    expect(favorites.getSnapshot()).toEqual({});
  });

  it("adds a favorite", () => {
    favorites.toggle("USA");
    expect(favorites.has("USA")).toBe(true);
  });

  it("removes a favorite", () => {
    favorites.toggle("USA");
    favorites.toggle("USA");

    expect(favorites.has("USA")).toBe(false);
  });

  it("persists to localStorage", () => {
    favorites.toggle("USA");

    expect(localStorage.getItem(KEY)).toEqual(JSON.stringify({ USA: true }));
  });

  it("notifies subscribers on change", () => {
    const listener = vi.fn();
    favorites.subscribe(listener);

    favorites.toggle("USA");

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("updates state from storage events (cross-tab sync)", () => {
    favorites.toggle("USA");

    localStorage.setItem(KEY, JSON.stringify({ CAN: true }));

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: KEY,
        newValue: JSON.stringify({ CAN: true }),
      }),
    );

    expect(favorites.has("USA")).toBe(false);
    expect(favorites.has("CAN")).toBe(true);
  });

  it("falls back to empty object when localStorage contains invalid JSON", () => {
    localStorage.setItem(KEY, "{invalid-json");

    const favorites = new LocalStorageFavorites();

    expect(favorites.getSnapshot()).toEqual({});
  });

  it("clears favorites when storage key is removed in another tab", () => {
    favorites.toggle("USA");

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: KEY,
        newValue: null,
      }),
    );

    expect(favorites.getSnapshot()).toEqual({});
  });

  it("ignores storage events for other keys", () => {
    favorites.toggle("USA");

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "some-other-key",
        newValue: JSON.stringify({ CAN: true }),
      }),
    );

    expect(favorites.has("USA")).toBe(true);
    expect(favorites.has("CAN")).toBe(false);
  });

  it("stops notifying unsubscribed listeners", () => {
    const listener = vi.fn();
    const unsubscribe = favorites.subscribe(listener);

    unsubscribe();
    favorites.toggle("USA");

    expect(listener).not.toHaveBeenCalled();
  });

  it("handles multiple favorites", () => {
    favorites.toggle("USA");
    favorites.toggle("CAN");
    favorites.toggle("MEX");

    expect(favorites.getSnapshot()).toEqual({
      USA: true,
      CAN: true,
      MEX: true,
    });
    expect(favorites.has("USA")).toBe(true);
    expect(favorites.has("CAN")).toBe(true);
    expect(favorites.has("MEX")).toBe(true);
  });
});
