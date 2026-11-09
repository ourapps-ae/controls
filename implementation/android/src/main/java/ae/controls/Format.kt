package ae.controls

import java.text.NumberFormat
import java.util.Locale

// Number and time text shared by every screen.

// 1,234,567 in every language, so amounts read the same on every device.
fun formatCount(n: Int): String = NumberFormat.getIntegerInstance(Locale.US).format(n)

// Minutes and seconds, rounding a part second up: 61000 is 1:01, 0 is 0:00.
fun mmss(ms: Long): String {
    val s = ((ms + 999) / 1000).coerceAtLeast(0)
    return "%d:%02d".format(s / 60, s % 60)
}

// A string looked up by name at run time (server keys, error codes): the translated text, or `fallback`
// when the application has no string of that name. `lookup` returns null for an unknown name.
fun textFor(name: String, fallback: String, lookup: (String) -> String?): String = lookup(name) ?: fallback
