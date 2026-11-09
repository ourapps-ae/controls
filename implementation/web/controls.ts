// Buttons, icon buttons, toggles, panels, banners, dialogs and help pages. Text is always passed in
// by the caller (already translated); colours come from the theme's CSS variables (controls.css).
import { h } from "./dom.ts";
import type { Child } from "./dom.ts";
import { icon } from "./icons.ts";
import type { IconName } from "./icons.ts";

export type ButtonVariant = "primary" | "ghost" | "link";
export type IconButtonVariant = "filled" | "outlined" | "plain";
export type Attrs = Record<string, string>;

// A pulsing halo on anything the person may tap right now: the one rule for "this is a choice".
export const GLOW = "glow";

export function buttonClass(variant: ButtonVariant = "primary", opts: { block?: boolean; danger?: boolean; glow?: boolean } = {}): string {
  return ["btn", variant === "primary" ? "" : variant, opts.block ? "block" : "", opts.danger ? "danger" : "", opts.glow ? GLOW : ""].filter(Boolean).join(" ");
}

export function iconButtonClass(variant: IconButtonVariant = "outlined", glow = false): string {
  const kind = variant === "filled" ? "gold" : variant === "outlined" ? "ghost" : "plain";
  return `icbtn ${kind}${glow ? " " + GLOW : ""}`;
}

export function button(o: { label: string; onClick: () => void; variant?: ButtonVariant; block?: boolean; danger?: boolean; glow?: boolean; disabled?: boolean; attrs?: Attrs }): HTMLButtonElement {
  return h("button", { ...o.attrs, class: buttonClass(o.variant, o), disabled: o.disabled, onClick: o.onClick }, o.label);
}

// A round icon button: filled for the main action, outlined for the others, plain for quiet ones.
// `label` is the accessible name and the tooltip. `glow` shows only while enabled.
export function iconButton(o: { icon?: IconName; content?: Node; label: string; onClick: () => void; variant?: IconButtonVariant; glow?: boolean; disabled?: boolean; size?: number; attrs?: Attrs }): HTMLButtonElement {
  const glow = Boolean(o.glow) && !o.disabled;
  return h("button", { ...o.attrs, class: iconButtonClass(o.variant, glow), title: o.label, "aria-label": o.label, disabled: o.disabled, onClick: o.onClick },
    o.content ?? (o.icon ? icon(o.icon, o.size ?? 24) : null));
}

// What a toggle shows for each state, kept separate so it can be tested without a page.
export function toggleView(on: boolean, o: { icon: IconName; iconOff?: IconName; label: string; labelOff?: string }): { class: string; icon: IconName; label: string } {
  return { class: `toggle ${on ? "on" : "off"}`, icon: on ? o.icon : o.iconOff ?? o.icon, label: on ? o.label : o.labelOff ?? o.label };
}

// A round on/off switch (microphone, camera, sound). Tapping asks for the opposite state.
export function toggle(o: { on: boolean; icon: IconName; iconOff?: IconName; label: string; labelOff?: string; onChange: (next: boolean) => void; disabled?: boolean; attrs?: Attrs }): HTMLButtonElement {
  const v = toggleView(o.on, o);
  return h("button", { ...o.attrs, class: v.class, title: v.label, "aria-label": v.label, "aria-pressed": String(o.on), disabled: o.disabled, onClick: () => o.onChange(!o.on) }, icon(v.icon, 22));
}

// A rounded panel that groups related content; an active panel is where the next tap belongs.
export function panel(o: { title?: string; active?: boolean; className?: string; attrs?: Attrs }, ...children: Child[]): HTMLElement {
  return h("div", { ...o.attrs, class: ["panel", o.active ? "active" : "", o.className ?? ""].filter(Boolean).join(" ") },
    o.title ? h("div", { class: "title" }, o.title) : null, ...children);
}

// The accent instruction line in its own slim banner, with optional controls at its end.
export function banner(text: string, ...trailing: Child[]): HTMLElement {
  return h("div", { class: "banner", role: "status" }, h("span", { class: "text" }, text), ...trailing);
}

export type DialogHandle = { el: HTMLElement; close: () => void };

// A modal over the page. Escape and a tap on the dim area close it; `onClose` runs once.
export function dialog(o: { title?: string; body: Child[]; actions?: Child[]; onClose?: () => void }): DialogHandle {
  let closed = false;
  let backdrop: HTMLElement;
  const close = () => {
    if (closed) return;
    closed = true;
    document.removeEventListener("keydown", onKey);
    backdrop.remove();
    o.onClose?.();
  };
  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
  backdrop = h("div", { class: "modal", role: "dialog", "aria-modal": "true", onClick: (e: Event) => { if (e.target === backdrop) close(); } },
    h("div", { class: "panel" },
      o.title ? h("h2", {}, o.title) : null,
      ...o.body,
      o.actions?.length ? h("div", { class: "row", style: { marginTop: "12px", justifyContent: "flex-end" } }, ...o.actions) : null));
  document.addEventListener("keydown", onKey);
  return { el: backdrop, close };
}

export type HelpSection = { title: string; body: string };

// Sections with no text are dropped; text keeps its line breaks.
export function normaliseHelpSections(sections: HelpSection[]): HelpSection[] {
  return sections.map((s) => ({ title: s.title.trim(), body: s.body.trim() })).filter((s) => s.title || s.body);
}

// A scrolling help page: a heading with a close button, titled sections, and a footer line.
export function helpPage(o: { title: string; sections: HelpSection[]; footer?: string; closeLabel: string; onClose: () => void }): HTMLElement {
  return h("div", { class: "panel help" },
    h("div", { class: "row spread" }, h("h2", {}, o.title), h("button", { class: "iconbtn", title: o.closeLabel, "aria-label": o.closeLabel, onClick: o.onClose }, "\u2715")),
    ...normaliseHelpSections(o.sections).flatMap((s) => [h("h3", {}, s.title), h("p", {}, s.body)]),
    o.footer ? h("div", { class: "muted" }, o.footer) : null);
}

// The theme's CSS variables that controls.css reads; the theme component provides every one.
export const THEME_VARIABLES = ["--primary", "--on-primary", "--background", "--surface", "--edge", "--text", "--muted", "--danger", "--good"] as const;
