package ae.controls

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

// One titled section of a help page; text is already translated.
data class HelpSection(val title: String, val body: String)

// A scrolling help page: a heading with a close button, titled sections and a footer line.
@Composable
fun HelpPage(title: String, sections: List<HelpSection>, closeLabel: String, onClose: () -> Unit, footer: String? = null) {
    Column(Modifier.fillMaxSize().safeDrawingPadding().verticalScroll(rememberScrollState()).padding(24.dp)) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Text(title, style = MaterialTheme.typography.headlineMedium)
            IconButton(onClick = onClose) { Icon(Icons.Filled.Close, contentDescription = closeLabel) }
        }
        for (section in sections) {
            Spacer(Modifier.height(16.dp))
            Text(section.title, style = MaterialTheme.typography.titleMedium, color = controlsColours().primary)
            Spacer(Modifier.height(4.dp))
            Text(section.body, style = MaterialTheme.typography.bodyMedium)
        }
        if (footer != null) {
            Spacer(Modifier.height(24.dp))
            Text(footer, style = MaterialTheme.typography.bodySmall)
        }
    }
}
