package ae.controls

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

// A rounded panel that groups related content; nest for sub-sections. An active panel is where the
// next tap belongs: primary edge, lighter fill.
@Composable
fun Panel(modifier: Modifier = Modifier, title: String? = null, active: Boolean = false, content: @Composable ColumnScope.() -> Unit) {
    val colours = controlsColours()
    val shape = RoundedCornerShape(LocalControlsTheme.current.radii.lg.dp)
    Card(
        modifier.fillMaxWidth().border(if (active) 2.dp else 1.dp, if (active) colours.primary else colours.edge, shape),
        shape = shape,
        colors = CardDefaults.cardColors(containerColor = if (active) colours.primary.copy(alpha = 0.12f) else colours.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
    ) {
        Column(Modifier.padding(LocalControlsTheme.current.spacing.lg.dp)) {
            if (title != null) {
                Text(title, style = MaterialTheme.typography.titleMedium, color = colours.primary)
                Spacer(Modifier.padding(4.dp))
            }
            content()
        }
    }
}

// The accent instruction line, in its own slim banner, with optional controls at its end.
@Composable
fun PromptBanner(text: String, trailing: @Composable (() -> Unit)? = null) {
    val colours = controlsColours()
    val shape = RoundedCornerShape(LocalControlsTheme.current.radii.lg.dp)
    Card(
        Modifier.fillMaxWidth().border(1.dp, colours.edge, shape),
        shape = shape,
        colors = CardDefaults.cardColors(containerColor = colours.surface),
    ) {
        Row(Modifier.padding(start = 16.dp, end = 8.dp, top = 6.dp, bottom = 6.dp), verticalAlignment = Alignment.CenterVertically) {
            Text(text, style = MaterialTheme.typography.titleSmall, color = colours.primary, modifier = Modifier.weight(1f))
            trailing?.invoke()
        }
    }
}
