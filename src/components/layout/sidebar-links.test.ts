// @vitest-environment jsdom

import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, test } from "vitest";
import { SidebarLinks } from "./sidebar-links";
import { SiteFooter } from "./site-footer";

function renderLinks(pathname = "/", basePath = "") {
  document.body.innerHTML = renderToStaticMarkup(
    createElement(SidebarLinks, { pathname, basePath }),
  );
}

afterEach(() => document.body.replaceChildren());

test("contact and subscription icons precede secondary navigation with real destinations", () => {
  renderLinks();
  const navigation = [...document.querySelectorAll("nav")];
  expect(navigation.map((nav) => nav.getAttribute("aria-label"))).toEqual([
    "Contact and subscriptions",
    "Secondary navigation",
  ]);

  const links = [...navigation[0].querySelectorAll("a")];
  expect(
    links.map((link) => [
      link.getAttribute("aria-label"),
      link.getAttribute("href"),
    ]),
  ).toEqual([
    ["Email", "mailto:ez4uke@gmail.com"],
    ["GitHub", "https://github.com/ukeSJTU"],
    ["X (Twitter)", "https://x.com/ukeraser"],
    ["CodePen", "https://codepen.io/ukeraser"],
    ["RSS feed", "/rss.xml"],
  ]);
  for (const link of links) {
    expect(link.title).toBe(link.getAttribute("aria-label"));
    expect(link.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  }

  expect(
    [...navigation[1].querySelectorAll("a")].map((link) => [
      link.textContent,
      link.getAttribute("href"),
    ]),
  ).toEqual([
    ["Topics", "/topics"],
    ["Source", "https://github.com/ukeSJTU/ukesjtu.github.io"],
  ]);
});

test("only web profiles open new tabs in the icon row", () => {
  renderLinks();
  const links = [
    ...document.querySelectorAll(
      'nav[aria-label="Contact and subscriptions"] a',
    ),
  ];
  expect(links.map((link) => link.getAttribute("target"))).toEqual([
    null,
    "_blank",
    "_blank",
    "_blank",
    null,
  ]);
  for (const link of links.filter(
    (link) => link.getAttribute("target") === "_blank",
  )) {
    expect(link.getAttribute("rel")?.split(" ")).toContain("noopener");
  }
});

test("footer external destinations open new tabs while its RSS stays in the current tab", () => {
  document.body.innerHTML = renderToStaticMarkup(createElement(SiteFooter));
  for (const link of document.querySelectorAll('a[href^="https://"]')) {
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")?.split(" ")).toContain("noopener");
  }
  expect(
    document.querySelector('a[href="/rss.xml"]')?.getAttribute("target"),
  ).toBeNull();
  expect(document.querySelector('a[rel~="license"]')).not.toBeNull();
});

test.each([
  "sidebar",
  "footer",
])("%s Source opens a new tab without an opener", (location) => {
  if (location === "sidebar") {
    renderLinks();
  } else {
    document.body.innerHTML = renderToStaticMarkup(createElement(SiteFooter));
  }
  const source = document.querySelector(
    'a[href="https://github.com/ukeSJTU/ukesjtu.github.io"]',
  );
  assert(source);
  expect(source.getAttribute("target")).toBe("_blank");
  expect(source.getAttribute("rel")?.split(" ")).toContain("noopener");
  expect(source.textContent).toBe("Source");
  expect(source.hasAttribute("aria-label")).toBe(false);
  expect(source.hasAttribute("title")).toBe(false);
});

test("Topics navigates in the current tab", () => {
  renderLinks();
  const topics = document.querySelector('a[href="/topics"]');
  assert(topics);
  expect(topics.getAttribute("target")).toBeNull();
});

test("Resume is a labelled unavailable placeholder, not a broken link or tab stop", () => {
  renderLinks();
  const resume = document.querySelector(
    'nav[aria-label="Secondary navigation"] [aria-disabled="true"]',
  );
  assert(resume);
  expect(resume.textContent).toContain("Resume");
  expect(resume.textContent).toContain("coming soon");
  expect(resume.hasAttribute("href")).toBe(false);
  expect(resume.hasAttribute("tabindex")).toBe(false);
  expect(document.querySelector('a[href="/resume"]')).toBeNull();
  expect(
    document.querySelector('nav[aria-label="Secondary navigation"]')
      ?.firstElementChild,
  ).toBe(resume);
});

test.each([
  ["/topics", true],
  ["/topics/linux", true],
  ["/topics-unrelated", false],
  ["/series", false],
])("Topics active state on %s is %s", (pathname, current) => {
  renderLinks(pathname);
  expect(
    document.querySelector('a[href="/topics"]')?.getAttribute("aria-current"),
  ).toBe(current ? "page" : null);
});

test("RSS retains the configured deployment base path", () => {
  renderLinks("/", "/garden");
  expect(
    document.querySelector('a[aria-label="RSS feed"]')?.getAttribute("href"),
  ).toBe("/garden/rss.xml");
});
