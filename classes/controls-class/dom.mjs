class Element extends EventTarget {
  attributes = new Map();
  children = [];
  className = '';
  style = {};
  disabled = false;
  removed = false;
  constructor(name) { super(); this.tagName = name; }
  setAttribute(name, value) { this.attributes.set(name, value); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  append(...children) { this.children.push(...children); }
  remove() { this.removed = true; }
  click() { if (!this.disabled) this.dispatchEvent(new Event('click')); }
}
export function installDocument() {
  const events = new EventTarget();
  globalThis.document = {
    createElement: name => new Element(name),
    createElementNS: (_namespace, name) => new Element(name),
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
  };
  return key => events.dispatchEvent(Object.assign(new Event('keydown'), { key }));
}
