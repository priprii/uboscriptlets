/// replace-partial-attr.js
/// alias rplpa.js
/// world ISOLATED
/// dependency run-at.fn
// example.com##+js(rplpa, selector, attr, search, replace)
function replacePartialAttr(
	selector = '',
	attr = '',
	search = '',
	replace = ''
) {
	if ( selector === '' || search === '' ) { return; }
	
	const replaceattr = () => {
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
	
	let scheduled = false;
    const observer = new MutationObserver(() => {
        if ( scheduled ) { return; }
        scheduled = true;
        requestAnimationFrame(() => {
            scheduled = false;
            replaceattr();
        });
    });

    runAt(() => {
        replaceattr();
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [ attr ],
        });
    }, 'interactive');
}
