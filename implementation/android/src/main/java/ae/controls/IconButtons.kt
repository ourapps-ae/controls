package ae.controls

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

// An icon in the corner of a screen that opens help.
@Composable
fun HelpBulb(label: String, onClick: () -> Unit, modifier: Modifier = Modifier) {
    IconButton(onClick = onClick, modifier = modifier) {
        Icon(Icons.Filled.Lightbulb, contentDescription = label, tint = controlsColours().primary)
    }
}

// A round icon button: filled for the main action, outlined for the others. `content` draws a custom
// glyph in the colour it is given. `glow` pulses a halo while enabled.
@Composable
fun RoundIconButton(
    icon: ImageVector?,
    label: String,
    enabled: Boolean,
    filled: Boolean,
    onClick: () -> Unit,
    glow: Boolean = false,
    size: Dp = 40.dp,
    content: (@Composable (Color) -> Unit)? = null,
) {
    val colours = controlsColours()
    val fg = if (filled) colours.onPrimary else colours.primary
    Box(
        Modifier.size(size)
            .pulseHalo(glow && enabled, size / 2)
            .clip(CircleShape)
            .background(if (!filled) Color.Transparent else if (enabled) colours.primary else colours.primary.copy(alpha = 0.45f))
            .then(if (filled) Modifier else Modifier.border(1.dp, colours.primary.copy(alpha = 0.5f), CircleShape))
            .graphicsLayer { alpha = if (enabled) 1f else if (filled) 0.7f else 0.4f }
            .clickable(enabled = enabled, role = Role.Button, onClick = onClick)
            .semantics { contentDescription = label },
        contentAlignment = Alignment.Center,
    ) {
        if (content != null) content(fg) else if (icon != null) Icon(icon, contentDescription = null, tint = fg)
    }
}

// A round on/off switch (microphone, camera, sound): filled when on, struck through when off.
@Composable
fun ToggleButton(on: Boolean, onIcon: ImageVector, offIcon: ImageVector, label: String, onToggle: (Boolean) -> Unit, enabled: Boolean = true) {
    val colours = controlsColours()
    Box(
        Modifier.size(44.dp).clip(CircleShape)
            .background(if (on) colours.primary.copy(alpha = 0.25f) else colours.danger.copy(alpha = 0.45f))
            .graphicsLayer { alpha = if (enabled) 1f else 0.5f }
            .clickable(enabled = enabled, role = Role.Switch, onClick = { onToggle(!on) })
            .semantics { contentDescription = label },
        contentAlignment = Alignment.Center,
    ) {
        Icon(if (on) onIcon else offIcon, contentDescription = null, tint = if (on) colours.primary else Color.White)
    }
}

// Going back up a level: the leave icon turned to point left. Back is always on the left and
// going deeper in on the right.
@Composable
fun BackIcon(tint: Color) {
    Icon(Icons.AutoMirrored.Filled.Logout, contentDescription = null, tint = tint, modifier = Modifier.rotate(180f))
}

// An icon with a small badge in the corner, such as a plus on a robot for "add a computer player".
@Composable
fun BadgedIcon(icon: ImageVector, badge: ImageVector, tint: Color) {
    val colours = controlsColours()
    Box {
        Icon(icon, contentDescription = null, tint = tint)
        Box(
            Modifier.align(Alignment.TopEnd).offset(6.dp, (-5).dp).size(13.dp).background(tint, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            Icon(badge, contentDescription = null, tint = colours.onPrimary, modifier = Modifier.size(11.dp))
        }
    }
}
