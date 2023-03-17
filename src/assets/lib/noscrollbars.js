//@ts-nocheck
window.addEventListener("load", () => {
    const oe = document.createElement('div');
    oe.style.overflow = 'scroll'; // make scrollbars visible
    document.body.appendChild(oe);

    // Creating inner element in container
    const ie = document.createElement('div');
    oe.appendChild(ie);

    // The difference in with, is the Scrollbar
    const delta = (oe.offsetWidth - ie.offsetWidth);
    console.log("Scrollbars", delta);

    // Clean DOM
    oe.parentNode.removeChild(oe);

    const el = document.querySelector(".noscrollbars");
    if(el)
        el.style.setProperty("--scrollbarwidth", delta + "px");
})