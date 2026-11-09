// A very small stand-in for the browser page: enough elements, attributes, events and text for the builders.
export class FakeElement {
  tagName: string;
  children: (FakeElement | string)[] = [];
  attrs: Record<string, string> = {};
  className = "";
  style: Record<string, string> = {};
  disabled = false;
  parent: FakeElement | null = null;
  listeners: Record<string, ((e: unknown) => void)[]> = {};
  constructor(tagName: string) { this.tagName = tagName; }
  setAttribute(k: string, v: string) { this.attrs[k] = v; }
  getAttribute(k: string) { return this.attrs[k] ?? null; }
  append(...nodes: (FakeElement | string)[]) { for (const n of nodes) { if (typeof n !== "string") n.parent = this; this.children.push(n); } }
  addEventListener(type: string, fn: (e: unknown) => void) { (this.listeners[type] ??= []).push(fn); }
  remove() { if (this.parent) this.parent.children = this.parent.children.filter((c) => c !== this); this.parent = null; }
  dispatch(type: string, event: Record<string, unknown> = {}) { for (const fn of this.listeners[type] ?? []) fn({ target: this, ...event }); }
  click() { if (!this.disabled) this.dispatch("click"); }
  get text(): string { return this.children.map((c) => (typeof c === "string" ? c : c.text)).join(""); }
  find(predicate: (e: FakeElement) => boolean): FakeElement[] {
    const out: FakeElement[] = [];
    for (const c of this.children) if (typeof c !== "string") { if (predicate(c)) out.push(c); out.push(...c.find(predicate)); }
    return out;
  }
  classes(): string[] { return this.className.split(/\s+/).filter(Boolean); }
}

const documentListeners: Record<string, ((e: unknown) => void)[]> = {};
export function installFakeDocument() {
  (globalThis as any).document = {
    createElement: (tag: string) => new FakeElement(tag),
    createElementNS: (_ns: string, tag: string) => new FakeElement(tag),
    addEventListener: (type: string, fn: (e: unknown) => void) => { (documentListeners[type] ??= []).push(fn); },
    removeEventListener: (type: string, fn: (e: unknown) => void) => { documentListeners[type] = (documentListeners[type] ?? []).filter((f) => f !== fn); },
  };
}
export const pressKey = (key: string) => { for (const fn of [...(documentListeners.keydown ?? [])]) fn({ key }); };
export const keydownListeners = () => (documentListeners.keydown ?? []).length;
