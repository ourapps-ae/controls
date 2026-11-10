import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { FakeElement, installFakeDocument, keydownListeners, pressKey } from "./fake-dom.ts";
import { ICON_NAMES, ICON_PATHS, badgedIcon, icon } from "../implementation/web/icons.ts";
import { THEME_VARIABLES, banner, button, buttonClass, dialog, helpPage, iconButton, iconButtonClass, normaliseHelpSections, panel, toggle, toggleView } from "../implementation/web/controls.ts";
import { formatCount, mmss } from "../implementation/web/format.ts";
import { h } from "../implementation/web/dom.ts";
import { settingsRow } from "../examples/consumer.ts";

installFakeDocument();
const el = (x: unknown) => x as unknown as FakeElement;

test("h builds elements from attributes, events and children", () => {
  let clicked = 0;
  const b = el(h("button", { class: "x y", disabled: false, title: "t", "data-n": 3, skip: null, onClick: () => clicked++, style: { width: "5px" } }, "a", null, false, "b"));
  assert.equal(b.className, "x y");
  assert.equal(b.getAttribute("title"), "t");
  assert.equal(b.getAttribute("data-n"), "3");
  assert.equal(b.getAttribute("skip"), null);
  assert.equal(b.style.width, "5px");
  assert.equal(b.text, "ab");
  b.click();
  assert.equal(clicked, 1);
  assert.equal(el(h("button", { disabled: true })).disabled, true);
});

test("button and icon button classes follow the variant", () => {
  assert.equal(buttonClass(), "btn");
  assert.equal(buttonClass("ghost", { block: true }), "btn ghost block");
  assert.equal(buttonClass("link", { danger: true, glow: true }), "btn link danger glow");
  assert.equal(iconButtonClass("filled"), "icbtn gold");
  assert.equal(iconButtonClass("outlined", true), "icbtn ghost glow");
  assert.equal(iconButtonClass("plain"), "icbtn plain");
});

test("an icon button has an accessible name, an icon and no halo while disabled", () => {
  let n = 0;
  const b = el(iconButton({ icon: "play", label: "Start", variant: "filled", glow: true, onClick: () => n++, attrs: { "data-guide": "start" } }));
  assert.equal(b.getAttribute("aria-label"), "Start");
  assert.equal(b.getAttribute("title"), "Start");
  assert.equal(b.getAttribute("data-guide"), "start");
  assert.deepEqual(b.classes(), ["icbtn", "gold", "glow"]);
  assert.equal((b.children[0] as FakeElement).children[0] instanceof FakeElement, true);
  b.click();
  assert.equal(n, 1);
  const off = el(iconButton({ icon: "play", label: "Start", glow: true, disabled: true, onClick: () => n++ }));
  assert.equal(off.classes().includes("glow"), false);
  off.click();
  assert.equal(n, 1, "a disabled button ignores taps");
  assert.equal(el(button({ label: "Join", variant: "ghost", onClick: () => {} })).text, "Join");
});

test("every icon has path data, and badged icons carry a second icon", () => {
  assert.ok(ICON_NAMES.length === 19);
  for (const name of ICON_NAMES) assert.match(ICON_PATHS[name], /^M[\d.\- ]/, name);
  const svg = el(icon("bulb", 30));
  assert.equal(svg.getAttribute("viewBox"), "0 0 24 24");
  assert.equal(svg.getAttribute("width"), "30");
  const badged = el(badgedIcon("robot", "plus", 22));
  assert.equal(badged.classes()[0], "ic-badged");
  assert.equal(badged.find((e) => e.tagName === "svg").length, 2);
});

test("a toggle shows its state and asks for the opposite", () => {
  assert.deepEqual(toggleView(true, { icon: "mic", iconOff: "micOff", label: "Mic on", labelOff: "Mic off" }), { class: "toggle on", icon: "mic", label: "Mic on" });
  assert.deepEqual(toggleView(false, { icon: "volumeUp" , label: "Sound" }), { class: "toggle off", icon: "volumeUp", label: "Sound" });
  const seen: boolean[] = [];
  const t = el(toggle({ on: true, icon: "mic", iconOff: "micOff", label: "Mic on", labelOff: "Mic off", onChange: (v) => seen.push(v) }));
  assert.equal(t.getAttribute("aria-pressed"), "true");
  t.click();
  assert.deepEqual(seen, [false]);
  const off = el(toggle({ on: false, icon: "mic", iconOff: "micOff", label: "Mic on", labelOff: "Mic off", onChange: (v) => seen.push(v) }));
  assert.equal(off.getAttribute("aria-label"), "Mic off");
  off.click();
  assert.deepEqual(seen, [false, true]);
  const dead = el(toggle({ on: false, icon: "videocam", label: "Camera", disabled: true, onChange: (v) => seen.push(v) }));
  dead.click();
  assert.equal(seen.length, 2);
});

test("panels and banners", () => {
  const p = el(panel({ title: "Players", active: true, className: "wide" }, "body"));
  assert.deepEqual(p.classes(), ["panel", "active", "wide"]);
  assert.equal(p.text, "Playersbody");
  assert.equal(el(panel({})).children.length, 0);
  const b = el(banner("Your turn", h("span", {}, "!")));
  assert.equal(b.getAttribute("role"), "status");
  assert.equal(b.text, "Your turn!");
});

test("a dialog closes on Escape, on the dim area and by hand, and calls onClose once", () => {
  let closed = 0;
  const before = keydownListeners();
  const page = new FakeElement("body");
  const d = dialog({ title: "Leave?", body: ["Really?"], actions: [button({ label: "Stay", onClick: () => {} })], onClose: () => closed++ });
  page.append(el(d.el));
  assert.equal(keydownListeners(), before + 1);
  assert.equal(el(d.el).getAttribute("role"), "dialog");
  assert.equal(el(d.el).text, "Leave?Really?Stay");
  el(d.el).dispatch("click", { target: new FakeElement("div") });
  assert.equal(closed, 0, "a tap inside does not close");
  pressKey("Enter");
  assert.equal(closed, 0);
  pressKey("Escape");
  assert.equal(closed, 1);
  d.close();
  assert.equal(closed, 1, "closing twice runs onClose once");
  assert.equal(keydownListeners(), before);
  assert.equal(page.children.length, 0);
  const second = dialog({ body: [], onClose: () => closed++ });
  el(second.el).dispatch("click");
  assert.equal(closed, 2, "a tap on the dim area closes");
});

test("help pages drop empty sections and close", () => {
  assert.deepEqual(normaliseHelpSections([{ title: " A ", body: " one\ntwo " }, { title: "", body: "  " }]), [{ title: "A", body: "one\ntwo" }]);
  let closed = false;
  const page = el(helpPage({ title: "How to play", sections: [{ title: "Idea", body: "Be nice" }, { title: "", body: "" }], footer: "Enjoy", closeLabel: "Done", onClose: () => { closed = true; } }));
  assert.equal(page.find((e) => e.tagName === "h3").length, 1);
  assert.equal(page.find((e) => e.tagName === "p")[0].text, "Be nice");
  assert.ok(page.text.endsWith("Enjoy"));
  page.find((e) => e.getAttribute("aria-label") === "Done")[0].click();
  assert.ok(closed);
});

test("numbers and times", () => {
  assert.equal(formatCount(1234567), "1,234,567");
  assert.equal(mmss(61000), "1:01");
  assert.equal(mmss(0), "0:00");
  assert.equal(mmss(-5), "0:00");
  assert.equal(mmss(59001), "1:00");
});

test("the stylesheet reads only variables the theme provides", () => {
  const css = readFileSync(new URL("../implementation/web/controls.css", import.meta.url), "utf8");
  const used = new Set([...css.matchAll(/var\((--[a-z-]+)\)/g)].map((m) => m[1]));
  assert.ok(used.size >= 6);
  for (const name of used) assert.ok((THEME_VARIABLES as readonly string[]).includes(name), name);
});

test("a consumer builds a settings row without a game", () => {
  const row = el(settingsRow({ soundOn: true, onSound: () => {}, help: () => {}, labels: { soundOn: "Sound on", soundOff: "Sound off", help: "How to play" } }));
  assert.equal(row.find((e) => e.tagName === "button").length, 2);
  assert.equal(row.find((e) => e.getAttribute("aria-label") === "Sound on").length, 1);
});

test("the native fixtures match the TypeScript icons and formatting", () => {
  const icons = JSON.parse(readFileSync(new URL("fixtures/icons.json", import.meta.url), "utf8"));
  assert.deepEqual(icons, ICON_PATHS);
  const format = JSON.parse(readFileSync(new URL("fixtures/format.json", import.meta.url), "utf8"));
  for (const [n, text] of format.count) assert.equal(formatCount(n), text);
  for (const [ms, text] of format.mmss) assert.equal(mmss(ms), text);
});

test("the OpenRPC interface names the web functions, icons and theme variables", async () => {
  const doc = JSON.parse(readFileSync(new URL("../interfaces/controls.json", import.meta.url), "utf8"));
  assert.equal(doc.openrpc, "1.3.2");
  assert.deepEqual([doc.info.title, doc.info.version], ["ae/controls", "1.0.0"]);
  assert.deepEqual(doc.components.schemas.IconName.enum, ICON_NAMES);
  assert.deepEqual(doc.components.schemas.ThemeVariables.const, [...THEME_VARIABLES]);
  const web = { ...(await import("../implementation/web/controls.ts")), ...(await import("../implementation/web/icons.ts")), ...(await import("../implementation/web/format.ts")), ...(await import("../implementation/web/dom.ts")) };
  const nativeOnly = ["helpBulb", "backIcon", "pulseHalo", "controlsTheme", "phoneColumn", "textFor"];
  for (const method of doc.methods) {
    if (nativeOnly.includes(method.name)) assert.doesNotMatch(method.description, /^Web/, method.name);
    else assert.equal(typeof (web as Record<string, unknown>)[method.name], "function", method.name);
  }
});
