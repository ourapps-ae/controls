import ae.controls.formatCount
import ae.controls.mmss
import ae.controls.textFor

// Mirrors the text checks of tests/apple/main.swift; the Compose views are compiled by the application build.
fun check(condition: Boolean, message: String) { if (!condition) { System.err.println("FAIL: $message"); System.exit(1) } }

fun main() {
    check(formatCount(1234567) == "1,234,567" && formatCount(0) == "0" && formatCount(1000) == "1,000", "formatCount")
    val rows = listOf(0L to "0:00", 1L to "0:01", 999L to "0:01", 1000L to "0:01", 59001L to "1:00", 61000L to "1:01", 600000L to "10:00", -5L to "0:00")
    for ((ms, text) in rows) check(mmss(ms) == text, "mmss $ms is ${mmss(ms)}, not $text")
    check(textFor("err_x", "fallback") { null } == "fallback" && textFor("err_x", "fallback") { "translated" } == "translated", "textFor")
    println("android controls checks passed")
}
