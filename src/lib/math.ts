import katex from "katex"

export function renderMath(el: HTMLElement) {
    katex.renderMathInElement(el, {
        delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
        ],
        throwOnError: false,
    })
}