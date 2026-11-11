# Source mapping

Reference revision: `19905b75dbea89fbfd424d67fe26c81aaed0e018`. Extracted from the `recipe/` folder of `ourapps-ae/OurPoker`; paths and line ranges are of the files there.

## Web

- `implementation/web/dom.ts` <- `web/src/dom.ts:1-16` (`h`). Left behind: `cardEl`, `PIPS`, `setCardTheme`, `loadArtManifest` (`18-91`, to `card-graphics`), `chips` (`93-95`, here as `formatCount` in `format.ts`), the `L` import.
- `implementation/web/icons.ts` <- `web/src/icons.ts:1-50`. Path data copied as it is (`ICON_PATHS`, `3-23`); `icon` from `27-39`; `addBotIcon` (`42-50`) became `badgedIcon(name, badge)` with the classes `ic-badged` and `ic-badge`.
- `implementation/web/controls.ts` <- new functions over markup the recipe builds inline: icon buttons `web/src/screens.ts:51, 91, 120-123, 134, 205-206` (`icbtn gold|ghost|plain`, `glow`), toggles `screens.ts:161-163`, help page `screens.ts:181-187`, panels and banners (`web/src/style.css:58-62`) and `.btn` variants (`69-74`). Generalised: `L(...)` text and `play("click")` calls are caller-supplied labels and `onClick`; `data-guide` is an `attrs` entry; the help section list is a parameter; `dialog` is new (the recipe's `.modal` markup, `style.css:112-113`, had no builder).
- `implementation/web/format.ts` <- `web/src/dom.ts:93-95` (`chips`, renamed `formatCount`) and `web/src/board.ts:12-15` (`time`, as `mmss`, with a floor of 0).
- `implementation/web/controls.css` <- `web/src/style.css:52-67, 69-76, 78-81, 83-88, 96-109 (icon buttons and toggles only), 112-115`. Generalised: `--gold`, `--bg`, `--text`, `--surface`, `--edge`, `--danger` became the theme's `--primary`, `--background`, `--text`, `--surface`, `--edge`, `--danger`; hard-coded gold and red tints became `color-mix` of those. Left behind: cards, table, chips, seats, timers, hands panel, guide styles (`119-359` mostly) and `.pill`, `.list`, `.room`, `.seatno`, `.bulb`, which belong to screens in the recipe.

## Apple

- `implementation/apple/Sources/IconPaths.swift` <- `ios/OurPoker/Sources/IconButtons.swift:5-9` (3 paths) extended to all 19 paths of `web/src/icons.ts` (`generated-platform`, produced by script from `icons.ts`, checked equal in `tests/apple/main.swift`).
- `implementation/apple/Sources/SVGPath.swift` <- the parser inside `IconButtons.swift:12-56` (`SVGIcon.path`). Split into a pure parser returning commands (new, testable without SwiftUI) and the shape; unsupported commands now give nil instead of being skipped; the tokeniser is hand-written because the recipe's regex literal needs a compiler flag.
- `implementation/apple/Sources/SVGIcon.swift` <- `IconButtons.swift:12-56` (shape part).
- `implementation/apple/Sources/IconButtons.swift` <- `IconButtons.swift:58-115` (`AddBotIcon` -> `BadgedIcon`, `BackGlyph`, `RoundIconButton`, `HelpBulb`) and `MediaToggles.swift:66-72` (`mediaButton` -> `ToggleButton`). Generalised: `Palette.gold` and the fixed ink and disabled colours come from the theme; `L("how_to_play")` is a `label` parameter; `Sound.play(.click)` calls are left to the caller.
- `implementation/apple/Sources/Panels.swift` <- `ios/OurPoker/Sources/Panels.swift:5-68` (`phoneColumn`, `Panel`, `PromptBanner`). Left behind: `isPad` (line 3), and `phoneColumn`'s tvOS help button text and click sound became parameters.
- `implementation/apple/Sources/PulseHalo.swift` <- `ios/OurPoker/Sources/PulseHalo.swift:1-29` copied with a `canImport(UIKit)` guard added.
- `implementation/apple/Sources/HelpPage.swift` <- `ios/OurPoker/Sources/HelpScreen.swift:1-29`. The recipe's fixed `helpSections` ids and `L(...)` lookups became a `[HelpSection]` parameter.
- `implementation/apple/Sources/ControlsStyle.swift` <- new (`generated-platform`): the theme environment value and `controlButtonStyle` (the recipe's `platformButtonStyle`, `Platform.swift:35-41`).
- `implementation/apple/Sources/Format.swift` <- new (`generated-platform`) from the web `formatCount` and `mmss`.

## Android

- `implementation/android/src/main/java/ae/controls/IconButtons.kt` <- `android/app/src/main/java/app/ourapps/ourpoker/ui/IconButtons.kt:1-89` (`HelpBulb`, `RoundIconButton`, `BackIcon`, `AddBotIcon` -> `BadgedIcon`), plus `ToggleButton` (new, from the toggle look in `MediaToggles.kt`, not copied line by line). `Ink`, the disabled grey and `MaterialTheme.colorScheme.primary` come from the theme.
- `implementation/android/src/main/java/ae/controls/Panels.kt` <- `ui/Panels.kt:1-58`. `PanelColour`, `PanelEdge`, the radius and spacing come from the theme.
- `implementation/android/src/main/java/ae/controls/PulseHalo.kt` <- `ui/Cards.kt:180-191`.
- `implementation/android/src/main/java/ae/controls/HelpPage.kt` <- `ui/HelpScreen.kt:1-53`. `HELP_SECTIONS` and `stringResource(R.string...)` became a parameter.
- `implementation/android/src/main/java/ae/controls/Format.kt` <- `ui/Strings.kt:12 (chips), 65-68 (mmss)`; `textFor` generalises the `getIdentifier` lookups at `Strings.kt:14-60`. Left behind: `promptText`, `eventText`, `errorText`, `actionText`, `roomName` (poker texts, `Strings.kt:14-63`).
- `implementation/android/src/main/java/ae/controls/ControlsTheme.kt` <- new (`generated-platform`).

## Tests

`tests/web.test.ts`, `tests/fake-dom.ts`, `tests/fixtures/icons.json`, `tests/fixtures/format.json`, `tests/apple/main.swift`, `tests/android/Main.kt`, `tests/native.py`, `examples/consumer.ts` are new.
