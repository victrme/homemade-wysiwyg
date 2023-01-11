import tinyNotes from "../../src/index"
import markdown from "./markdown"
import "../../src/style.css"
import "./style.css"

window.addEventListener("load", function () {
	const editor = tinyNotes("wrapper")
	editor.set(markdown)
})