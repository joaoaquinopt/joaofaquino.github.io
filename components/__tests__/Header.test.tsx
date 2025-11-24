/* eslint-disable @next/next/no-img-element */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Header from "../Header";
import { TranslationProvider } from "../TranslationProvider";

const usePathnameMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: React.ComponentPropsWithoutRef<"a">) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, priority: _priority, ...props }: React.ComponentPropsWithoutRef<"img"> & { priority?: boolean }) => (
    <img alt={alt} {...props} />
  ),
}));

describe("Header", () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
    usePathnameMock.mockReturnValue("/");
  });

  const renderHeader = () =>
    render(
      <TranslationProvider>
        <Header />
      </TranslationProvider>
    );

  it("renders navigation links with localized labels", () => {
    renderHeader();

    const nav = screen.getByRole("navigation", { name: /Navegação principal/i });
    const navEntries = [
      { href: "/", label: /Jornada/i },
      { href: "/progress", label: /Progresso/i },
      { href: "/equipment", label: /Equipamentos/i },
      { href: "/gallery", label: /Galeria/i },
      { href: "/contact", label: /Contacto/i },
    ];

    for (const { href, label } of navEntries) {
      const link = screen.getByRole("link", { name: label });
      expect(link).toHaveAttribute("href", href);
      expect(nav).toContainElement(link);
    }
  });

  it("marks the current route as active", () => {
    usePathnameMock.mockReturnValue("/progress");
    renderHeader();

    const activeLink = screen.getByRole("link", { name: /Progresso/i });
    expect(activeLink).toHaveStyle({ color: "#58A6FF" });

    const inactiveLink = screen.getByRole("link", { name: /Jornada/i });
    expect(inactiveLink).toHaveStyle({ color: "#fff" });
  });

  it("toggles the mobile menu and closes when a link is clicked", async () => {
    renderHeader();

    const toggle = screen.getByRole("button", { name: /menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    const links = screen.getAllByRole("link", { name: /Jornada/i });
    expect(links).toHaveLength(2);

    await userEvent.click(links[1]);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getAllByRole("link", { name: /Jornada/i })).toHaveLength(1);
  });
});