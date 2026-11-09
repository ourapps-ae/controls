package ae.controls

import ae.theme.ComposeColours
import ae.theme.ThemeSet
import ae.theme.composeColours
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.remember

// The theme the controls draw with; provide it once near the top of the tree.
val LocalControlsTheme = compositionLocalOf { ThemeSet.named(null) }

@Composable
fun ControlsTheme(theme: ThemeSet, content: @Composable () -> Unit) {
    CompositionLocalProvider(LocalControlsTheme provides theme, content = content)
}

@Composable
fun controlsColours(): ComposeColours {
    val theme = LocalControlsTheme.current
    return remember(theme) { theme.composeColours() }
}
