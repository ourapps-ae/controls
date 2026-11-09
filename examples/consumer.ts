// A consumer that needs no game: a row with a sound toggle and a help button.
import { h } from "../implementation/web/dom.ts";
import { iconButton, toggle } from "../implementation/web/controls.ts";

export function settingsRow(o: { soundOn: boolean; onSound: (on: boolean) => void; help: () => void; labels: { soundOn: string; soundOff: string; help: string } }): HTMLElement {
  return h("div", { class: "toggles" },
    toggle({ on: o.soundOn, icon: "volumeUp", iconOff: "volumeOff", label: o.labels.soundOn, labelOff: o.labels.soundOff, onChange: o.onSound }),
    iconButton({ icon: "bulb", label: o.labels.help, variant: "plain", onClick: o.help }));
}
