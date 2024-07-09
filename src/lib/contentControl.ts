import PocketEditor from "../index"

export function checkModifs(text: string, mods: Record<string, string>) {
	for (const [name, str] of Object.entries(mods)) {
		if (text.startsWith(str + " ")) {
			return name
		}
	}

	return ""
}

export function toHTML(self: PocketEditor, markdown: string) {
	// create fragment to append only once to real DOM
	const fragment = document.createDocumentFragment()

	// remove tabs for now
	markdown = markdown.replaceAll("\t", "")

	for (const line of markdown.split("\n\n")) {
		if (line.indexOf("\n") === -1) {
			fragment.appendChild(self.createLine({ text: line, modif: checkModifs(line, self.mods) }))
			continue
		}

		// Modifs that use line breaks (list & todos)
		for (const subline of line.split("\n")) {
			fragment.appendChild(self.createLine({ text: subline, modif: checkModifs(subline, self.mods) }))
		}
	}

	return fragment
}

export function toMarkdown(lines: Element[]) {
	function addModif(line: Element) {
		if (line.classList.contains("list")) return "- "
		if (line.classList.contains("h1")) return "# "
		if (line.classList.contains("h2")) return "## "
		if (line.classList.contains("h3")) return "### "
		if (line.classList.contains("todo")) return "[ ] "
		if (line.classList.contains("todo-checked")) return "[x] "

		return ""
	}

	let plaintext = ""
	let modif = ""

	const isList = (line?: Element) => {
		return line?.classList.contains("list") || line?.classList.contains("todo")
	}

	lines.forEach((line, i) => {
		// Add markdown
		modif = addModif(line)
		plaintext += modif + line.textContent

		// Add line break
		const isWithinList = isList(lines[i + 1]) && isList(line)
		const isLastLine = lines.length - 1 === i
		plaintext += isLastLine ? "" : isWithinList ? "\n" : "\n\n"
	})

	return plaintext
}

export default { toHTML, toMarkdown }
