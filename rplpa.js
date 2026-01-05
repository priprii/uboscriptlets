/// rplpa.js
/// alias rplpa.js
/// world ISOLATED
/// dependency run-at.fn
// example.com##+js(rplpa, [selector], attr, search, replace)
function rplpa(
    selector = '',
    attr = '',
    search = '',
    replace = ''
) {
    if ( selector === '' || attr === '' || search === '' ) { return; }
    const replacepartialattr = ( ) => {
        const elems = document.querySelectorAll(selector);
        try {
            for ( const el of elems ) {
                if ( !el.hasAttribute(attr) ) { continue; }
                const val = el.getAttribute(attr);
                if ( typeof val !== 'string' ) { continue; }
                if ( val.includes(search) === false ) { continue; }
                el.setAttribute(attr, val.replaceAll(search, replace));
            }
        } catch { }
    };
    let observer, timer;
    const onDomChanged = mutations => {
        if ( timer !== undefined ) { return; }
        let shouldWork = false;
        for ( const mutation of mutations ) {
            if ( mutation.addedNodes.length === 0 ) { continue; }
            for ( const node of mutation.addedNodes ) {
                if ( node.nodeType !== 1 ) { continue; }
                shouldWork = true;
                break;
            }
            if ( shouldWork ) { break; }
        }
        if ( shouldWork === false ) { return; }
        timer = self.requestAnimationFrame(( ) => {
            timer = undefined;
            replacepartialattr();
        });
    };
    const start = ( ) => {
        if ( replacepartialattr() === false ) { return; }
        observer = new MutationObserver(onDomChanged);
        observer.observe(document.body, {
            subtree: true,
            childList: true,
        });
    };
    runAt(( ) => { start(); }, 'interactive');
}
