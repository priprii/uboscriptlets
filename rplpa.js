/// rplpa.js
/// alias rplpa
/// world ISOLATED
/// dependency run-at.fn
// example.com##+js(rplpa, selector, attr, search, replace)
function rplpa(
    selector = '',
    attr = '',
    search = '',
    replace = ''
) {
    if ( selector === '' || attr === '' || search === '' ) { return; }

    const apply = () => {
        const elems = document.querySelectorAll(selector);
        for ( const el of elems ) {
            if ( !el.hasAttribute(attr) ) { continue; }

            const val = el.getAttribute(attr);
            if ( typeof val !== 'string' ) { continue; }
            if ( val.includes(search) === false ) { continue; }

            el.setAttribute(attr, val.replaceAll(search, replace));
        }
    };

    let scheduled = false;
    const observer = new MutationObserver(() => {
        if ( scheduled ) { return; }
        scheduled = true;
        requestAnimationFrame(() => {
            scheduled = false;
            apply();
        });
    });

    runAt(() => {
        apply();
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [ attr ],
        });
    }, 'interactive');
}
