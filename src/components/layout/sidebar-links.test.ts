// @vitest-environment jsdom
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, test } from "vitest";
import { SidebarLinks } from "./sidebar-links";
import { SiteFooter } from "./site-footer";
import { SiteNavigation } from "./site-navigation";

function render(element: ReturnType<typeof createElement>) {
  const parsed = new DOMParser().parseFromString(
    renderToStaticMarkup(element),
    "text/html",
  );
  document.body.replaceChildren(...parsed.body.childNodes);
}

afterEach(() => document.body.replaceChildren());

test("navigation exposes the expanded Writing group and real Resume destination", () => {
  render(createElement(SiteNavigation, { pathname: "/" }));
  expect(
    [...document.querySelectorAll("a")].map((link) => [
      link.textContent,
      link.getAttribute("href"),
    ]),
  ).toEqual([
    ["Home", "/"],
    ["Blog", "/blog"],
    ["Series", "/series"],
    ["Tags", "/tags"],
    ["Projects", "/projects"],
    ["About", "/about"],
    ["Resume", "/resume"],
  ]);
  expect(document.body.textContent).toContain("Writing");
  expect(document.querySelector('[aria-disabled="true"]')).toBeNull();
});

test.each([
  ["/tags", true],
  ["/tags/linux", true],
  ["/tags-unrelated", false],
  ["/series", false],
])("Tags active state on %s is %s", (pathname, current) => {
  render(createElement(SiteNavigation, { pathname }));
  expect(
    document.querySelector('a[href="/tags"]')?.getAttribute("aria-current"),
  ).toBe(current ? "page" : null);
});

test("sidebar keeps GitHub and base-path-aware RSS, not duplicate footer links", () => {
  render(createElement(SidebarLinks, { basePath: "/garden" }));
  expect(
    [...document.querySelectorAll("a")].map((link) => [
      link.getAttribute("aria-label"),
      link.getAttribute("href"),
    ]),
  ).toEqual([
    ["GitHub", "https://github.com/ukeSJTU"],
    ["RSS feed", "/garden/rss.xml"],
  ]);
  expect(
    document.querySelector('a[aria-label="GitHub"]')?.getAttribute("rel"),
  ).toContain("noopener");
  expect(
    document.querySelector('a[aria-label="RSS feed"]')?.getAttribute("target"),
  ).toBeNull();
});

test("footer has content licensing and source without redundant social navigation", () => {
  render(createElement(SiteFooter));
  expect(
    [...document.querySelectorAll("a")].map((link) => link.textContent),
  ).toEqual(["Content: CC BY 4.0", "Source"]);
  expect(document.querySelector('a[rel~="license"]')).not.toBeNull();
  for (const link of document.querySelectorAll("a")) {
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  }
});
