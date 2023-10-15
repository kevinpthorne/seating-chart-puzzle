export function createElement(tag, options, attributes) {
    const el = document.createElement(tag, options);
    for (const [name, value] of Object.entries(attributes)) {
        el.setAttribute(name, value);
    }
    return el;
}