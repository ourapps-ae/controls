// The package's example images: buttons, toggles, panels, a banner, a dialog and a help page built by the controls
// themselves, rendered by classes/render_images.py in headless Chrome.
import { h } from "../implementation/web/dom.ts";
import { banner, button, dialog, helpPage, iconButton, panel, toggle } from "../implementation/web/controls.ts";
import { ICON_NAMES, icon } from "../implementation/web/icons.ts";
import { mmss } from "../implementation/web/format.ts";

type Scene = { name: string; caption: string; width: number; height: number; look?: string; render: (root: HTMLElement) => void };

const noop = () => {};

function column(root: HTMLElement): void {
  Object.assign(root.style, { display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", justifyContent: "center", padding: "32px" });
}

function line(...children: Node[]): HTMLElement {
  const row = h("div", {}, ...children);
  Object.assign(row.style, { display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap", justifyContent: "center" });
  return row;
}

function buttons(root: HTMLElement): void {
  column(root);
  root.append(
    line(button({ label: "Sit down", onClick: noop }), button({ label: "Start the game", onClick: noop, glow: true }), button({ label: "Leave", onClick: noop, variant: "ghost" }),
      button({ label: "Remove player", onClick: noop, danger: true }), button({ label: "Not yet", onClick: noop, disabled: true }), button({ label: "How to play", onClick: noop, variant: "link" })),
    line(iconButton({ icon: "play", label: "Play", onClick: noop, variant: "filled" }), iconButton({ icon: "plus", label: "Add", onClick: noop }),
      iconButton({ icon: "bulb", label: "Help", onClick: noop, variant: "plain", glow: true }), iconButton({ icon: "edit", label: "Edit name", onClick: noop, disabled: true }),
      toggle({ on: true, icon: "volumeUp", iconOff: "volumeOff", label: "Sound on", labelOff: "Sound off", onChange: noop }),
      toggle({ on: false, icon: "mic", iconOff: "micOff", label: "Microphone on", labelOff: "Microphone off", onChange: noop }),
      toggle({ on: true, icon: "videocam", iconOff: "videocamOff", label: "Camera on", labelOff: "Camera off", onChange: noop })),
    panel({ title: "Casino", active: true }, h("p", {}, "4 players · next level in ", mmss(312000)), button({ label: "Enter", onClick: noop, block: true })),
    banner("Waiting for 1 more player.", button({ label: "Invite", onClick: noop, variant: "ghost" })));
}

export const scenes: Scene[] = [
  { name: "controls-night", caption: "Buttons, icon buttons, toggles, a panel and a banner in the night look", width: 1000, height: 600, look: "night", render: buttons },
  { name: "controls-lounge", caption: "The same controls in the lounge look", width: 1000, height: 600, look: "lounge", render: buttons },
  {
    name: "dialog", caption: "A dialog with its title, text and two actions", width: 900, height: 560, look: "night",
    render: (root) => {
      column(root);
      root.append(dialog({ title: "Leave the table?", body: [h("p", {}, "Your seat is kept for a minute. After that the next person may take it.")],
        actions: [button({ label: "Stay", onClick: noop, variant: "ghost" }), button({ label: "Leave", onClick: noop, danger: true })], onClose: noop }).el);
    },
  },
  {
    name: "help-page", caption: "A help page built from titled sections, with its close button", width: 900, height: 420, look: "night",
    render: (root) => {
      const frame = h("div", {});
      Object.assign(frame.style, { position: "relative", width: "820px", height: "340px", margin: "40px auto", });
      root.append(frame);
      const page = helpPage({ title: "How to play", closeLabel: "Close", onClose: noop, footer: "Version 1.2.0", sections: [
        { title: "Your turn", body: "When it is your turn the buttons light up: fold, check or call, or raise by the amount on the slider." },
        { title: "Blinds", body: "Two players post blinds before each hand. They rise every level; the clock shows the time left." },
        { title: "Leaving", body: "Close the app and your seat waits a minute for you to come back." },
      ] });
      page.style.boxSizing = "border-box";
      frame.append(page);
    },
  },
  {
    name: "icons", caption: "Every icon in the set at 32 pixels", width: 900, height: 300, look: "night",
    render: (root) => {
      column(root);
      root.append(line(...ICON_NAMES.map((name) => icon(name, 32))));
    },
  },
];
