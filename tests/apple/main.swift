import Foundation

func fail(_ message: String) -> Never {
    FileHandle.standardError.write(Data("FAIL: \(message)\n".utf8))
    exit(1)
}
func check(_ condition: Bool, _ message: @autoclosure () -> String) { if !condition { fail(message()) } }
func fixture(_ name: String) -> Any {
    guard let data = FileManager.default.contents(atPath: "tests/fixtures/\(name)"), let value = try? JSONSerialization.jsonObject(with: data) else { fail("cannot read \(name)") }
    return value
}

// Icons: the Swift path data equals the web's, and every path parses to points inside the 24 x 24 box.
let icons = fixture("icons.json") as! [String: String]
check(icons == IconPath.all, "icon paths differ from web/icons.ts")
var commands = 0
for (name, d) in icons {
    guard let parsed = SVGPath.parse(d) else { fail("icon \(name) does not parse") }
    let closes = d.filter { $0 == "z" || $0 == "Z" }.count
    let moves = d.filter { $0 == "M" || $0 == "m" }.count
    check(parsed.filter { $0 == .close }.count == closes, "\(name): closed shapes")
    check(parsed.filter { if case .move = $0 { return true } else { return false } }.count == moves, "\(name): subpaths")
    for c in parsed {
        let points: [Double]
        switch c {
        case let .move(x, y), let .line(x, y): points = [x, y]
        case let .curve(a, b, c, d, e, f): points = [a, b, c, d, e, f]
        case .close: points = []
        }
        check(points.allSatisfy { $0 >= -1 && $0 <= 25 }, "\(name): point outside the icon box \(points)")
    }
    commands += parsed.count
}

// Parsing details: relative and absolute moves, H and V, S reflecting the last control point, and unsupported commands refused.
check(SVGPath.parse("M1 2L3 4z") == [.move(1, 2), .line(3, 4), .close], "absolute line")
check(SVGPath.parse("m1 2 3 4") == [.move(1, 2), .line(4, 6)], "relative move then implicit line")
check(SVGPath.parse("M2 2H5V7h-1v-2") == [.move(2, 2), .line(5, 2), .line(5, 7), .line(4, 7), .line(4, 5)], "H and V")
check(SVGPath.parse("M0 0C1 1 2 1 3 0S5 -1 6 0") == [.move(0, 0), .curve(c1x: 1, c1y: 1, c2x: 2, c2y: 1, x: 3, y: 0), .curve(c1x: 4, c1y: -1, c2x: 5, c2y: -1, x: 6, y: 0)], "smooth curve reflects the control point")
check(SVGPath.parse("M0 0A5 5 0 0 1 10 0") == nil, "arcs are refused")
check(SVGPath.tokenise("M1.5-.5.5.5") == ["M", "1.5", "-.5", ".5", ".5"], "tokeniser splits on signs and second decimal points")
check(SVGPath.parse("M1") == nil, "a move missing its second number is refused")

// Text.
let format = fixture("format.json") as! [String: [[Any]]]
for row in format["count"]! { check(formatCount(row[0] as! Int) == row[1] as! String, "formatCount \(row[0])") }
for row in format["mmss"]! { check(mmss(row[0] as! Int) == row[1] as! String, "mmss \(row[0])") }

print("\(icons.count) icons (\(commands) commands), \(format["count"]!.count + format["mmss"]!.count) text assertions passed")
