# Controls component

## Purpose and facilities
`controls` is the set of small interface pieces every screen is made from: text buttons (primary, outlined, link), round icon buttons (filled, outlined, plain) with an optional pulsing halo meaning "you can tap this", round on/off toggles (microphone, camera, sound), panels (with an active state), accent banners, modal dialogs, and a scrolling help page. It also holds the Material icon paths used by the web and Apple parts, a badged-icon helper, and number and time text (`formatCount`, `mmss`). All visible text is passed in already translated; nothing in it is specific to a game.

Facilities: `controls` (Buttons, icon buttons, toggles, panels, banners, dialogs and help pages).

## User inputs
No installer settings. Colours, radii and spacing come from the `theme` component (CSS variables on the web, a `ThemeSet` on Apple and Android).

## Artefacts and dependencies
`component.json` maps every `implementation/` source into `components/controls/`:

- `implementation/android/src/main/java/ae/controls/ControlsTheme.kt` -> `components/controls/android/src/main/java/ae/controls/ControlsTheme.kt`
- `implementation/android/src/main/java/ae/controls/Format.kt` -> `components/controls/android/src/main/java/ae/controls/Format.kt`
- `implementation/android/src/main/java/ae/controls/HelpPage.kt` -> `components/controls/android/src/main/java/ae/controls/HelpPage.kt`
- `implementation/android/src/main/java/ae/controls/IconButtons.kt` -> `components/controls/android/src/main/java/ae/controls/IconButtons.kt`
- `implementation/android/src/main/java/ae/controls/Panels.kt` -> `components/controls/android/src/main/java/ae/controls/Panels.kt`
- `implementation/android/src/main/java/ae/controls/PulseHalo.kt` -> `components/controls/android/src/main/java/ae/controls/PulseHalo.kt`
- `implementation/apple/Sources/ControlsStyle.swift` -> `components/controls/apple/Sources/ControlsStyle.swift`
- `implementation/apple/Sources/Format.swift` -> `components/controls/apple/Sources/Format.swift`
- `implementation/apple/Sources/HelpPage.swift` -> `components/controls/apple/Sources/HelpPage.swift`
- `implementation/apple/Sources/IconButtons.swift` -> `components/controls/apple/Sources/IconButtons.swift`
- `implementation/apple/Sources/IconPaths.swift` -> `components/controls/apple/Sources/IconPaths.swift`
- `implementation/apple/Sources/Panels.swift` -> `components/controls/apple/Sources/Panels.swift`
- `implementation/apple/Sources/PulseHalo.swift` -> `components/controls/apple/Sources/PulseHalo.swift`
- `implementation/apple/Sources/SVGIcon.swift` -> `components/controls/apple/Sources/SVGIcon.swift`
- `implementation/apple/Sources/SVGPath.swift` -> `components/controls/apple/Sources/SVGPath.swift`
- `implementation/web/controls.css` -> `components/controls/web/controls.css`
- `implementation/web/controls.ts` -> `components/controls/web/controls.ts`
- `implementation/web/dom.ts` -> `components/controls/web/dom.ts`
- `implementation/web/format.ts` -> `components/controls/web/format.ts`
- `implementation/web/icons.ts` -> `components/controls/web/icons.ts`

Dependencies: none.
`tools.lock.json` pins verification tools: node 26.5.0, python3 3.12.8, swiftc 6.4.2, kotlinc 2.2.0, java 26.0.1. Licence wording remains deferred.

## Provided interfaces
- `interfaces/controls.json` defines `controls` (ae/controls) version 1.0.0 as an OpenRPC 1.3.2 document: one method per builder, each description naming the web function, the SwiftUI view and the Compose function (or saying the form exists on one platform only), with options, icon names, help sections and the theme variables read as JSON Schema 2020-12 under `components.schemas`. Callbacks and DOM nodes are described as host values, not serialised.

## Required interfaces
- `theme` (ae/theme) version 1.0.0, supplied by the recipe or application. Its interface document is a copy of the theme component's OpenRPC document; controls reads the theme's CSS variables listed in `ThemeVariables` of `interfaces/controls.json` (web) and the `ThemeSet` values (Swift, Kotlin).

## Integration
Web: import `h` from `web/dom.ts` and the builders from `web/controls.ts`, `icon` and `badgedIcon` from `web/icons.ts`, and link `web/controls.css` after the theme's `theme.css`. Mark elements a guided tour should ring with `attrs: { "data-guide": "name" }`. Apple: compile the Swift files together with the theme's Swift files; set `.controlsTheme(ThemeSet.named(...))` once near the root; use `Panel`, `PromptBanner`, `RoundIconButton`, `ToggleButton`, `HelpBulb`, `BadgedIcon`, `HelpPage`, `.pulseHalo(_:)` and `.phoneColumn()`. Android: add the Kotlin files to a Compose module with Material 3 and the extended Material icons, wrap the tree in `ControlsTheme(theme) { ... }`, and use the same names. Sound on tap, analytics and navigation are the application's: pass them in `onClick`.

## Visual definition and connected examples
`visual/definition.json` maps its ports to the provided and required interfaces. `visual/examples/connected.json` connects the component to an illustrative application consumer. Both image formats and a text description are retained under `visual/output/`.

## Infrastructure
None. Local drawing only; no accounts, network or deployment.

## Verification
Node tests run the builders against a small stand-in page (`tests/fake-dom.ts`): classes per variant, accessible names, disabled buttons ignoring taps, toggles asking for the opposite state, dialogs closing on Escape and on the dim area exactly once, help pages dropping empty sections, number and time text, that `controls.css` reads only variables the theme provides, and that the OpenRPC interface's icon names and theme variables equal the code's and every method not marked native-only is an exported web function. The Apple check compiles and runs `tests/apple/main.swift` for macOS (all 19 icon paths parse to points inside the icon box, and the parser's relative, absolute, H, V and smooth-curve cases; text formatting against `tests/fixtures/format.json`) and type-checks every Swift file, with the theme component's, against the iOS simulator SDK. The Android check compiles `Format.kt` and runs `tests/android/Main.kt`; kotlinc was not available where this was written, so it has not been run, and the Compose views are only compiled by the application's Gradle build. Pixel output is not compared.

- `node --test tests/web.test.ts` (web, required-local; tools: node 26.5.0)
- `python3 tests/native.py apple` (apple, platform; tools: python3 3.12.8, swiftc 6.4.2)
- `python3 tests/native.py android` (android, platform; tools: python3 3.12.8, kotlinc 2.2.0, java 26.0.1)

## Scenarios and presentation
A lobby uses a filled icon button with a halo for "start" once enough people are seated; a settings row shows sound, microphone and camera toggles; "how to play" opens the help page with the recipe's translated sections; a leave action opens a dialog with two buttons.

## Updates and removal
Patch updates replace files only. The component keeps no data; removal deletes its files and the application's imports of them.
