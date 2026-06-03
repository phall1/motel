import { describe, expect, it } from "bun:test"
import { severityTextFromNumber } from "./otlp.ts"

// Pure mapping test — no store/config, so it is isolated from the rest of the
// suite. Guards the OTLP severity_number → text fallback that keeps
// number-only log emitters from all collapsing to INFO.
describe("severityTextFromNumber", () => {
	it("maps each OTLP severity range to its text bucket", () => {
		expect(severityTextFromNumber(1)).toBe("TRACE") // TRACE..TRACE4 = 1-4
		expect(severityTextFromNumber(5)).toBe("DEBUG") // DEBUG = 5-8
		expect(severityTextFromNumber(9)).toBe("INFO") // INFO = 9-12
		expect(severityTextFromNumber(13)).toBe("WARN") // WARN = 13-16
		expect(severityTextFromNumber(17)).toBe("ERROR") // ERROR = 17-20
		expect(severityTextFromNumber(21)).toBe("FATAL") // FATAL = 21-24
		expect(severityTextFromNumber(24)).toBe("FATAL")
	})

	it("returns undefined for absent / out-of-range numbers (caller falls back to INFO)", () => {
		expect(severityTextFromNumber(undefined)).toBeUndefined()
		expect(severityTextFromNumber(0)).toBeUndefined()
		expect(severityTextFromNumber(25)).toBeUndefined()
	})
})
