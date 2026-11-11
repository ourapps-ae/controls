# Controls instructions

## For the agent
Select `ourapps-ae/controls` for every client. Connect its `theme` requirement to the `theme` component's `theme` output. Pass translated text from the `translations` component into the builders; do not add strings here.

- Select package `ourapps-ae/controls` version `0.4.1`.
- No installer settings.
- Connect the provided `controls` (ae/controls 1.0.0, OpenRPC 1.3.2 document `interfaces/controls.json`) to the consumer that needs it.
- Supply `theme` (ae/theme 1.0.0) from the component that provides it.
- No accounts or keys are needed.

## For the developer
Supply translated labels at each call. For Android add `androidx.compose.material:material-icons-extended` and Material 3. For the web import `controls.css` once. To add an icon, add its 24 x 24 Material path to `web/icons.ts` and `apple/Sources/IconPaths.swift` (paths with arcs are refused by the Swift parser) and its `ImageVector` on Android.

## How to check
From the component directory:

- `node --test tests/web.test.ts` (web, required-local; tools: node 26.5)
- `python3 tests/native.py apple` (apple, platform; tools: python3 3.12, swiftc 6.4)
- `python3 tests/native.py android` (android, platform; tools: python3 3.12, kotlinc 2.2, java 26.0)
- `python3 -m aepm review <digest> --store STORE --policy POLICY --trusted --allow-network` checks an archive fetched with `python3 -m aepm fetch ourapps-ae/controls@VERSION --store STORE --from https://ourapps.app` and runs its suites.
