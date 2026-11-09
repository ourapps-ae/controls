package ae.controls

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

// Pulsing white halo: the one rule for "you can tap this".
@Composable
fun Modifier.pulseHalo(active: Boolean, cornerRadius: Dp? = null): Modifier {
    if (!active) return this
    val pulse by rememberInfiniteTransition(label = "pulse").animateFloat(0.35f, 1f, infiniteRepeatable(tween(700), RepeatMode.Reverse), label = "pulseA")
    return drawBehind {
        val pad = 6.dp.toPx()
        val colour = Color.White.copy(alpha = 0.55f * pulse)
        if (cornerRadius == null) drawCircle(colour, radius = size.minDimension / 2 + pad)
        else drawRoundRect(colour, topLeft = Offset(-pad, -pad), size = Size(size.width + 2 * pad, size.height + 2 * pad), cornerRadius = CornerRadius(cornerRadius.toPx() + pad))
    }
}
