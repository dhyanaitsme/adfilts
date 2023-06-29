// MrBukLau's Scriptlets

"use strict";

/**********************/
/* Generic Scriptlets */
/**********************/
/// bypass-streaming-url-shortener.js
/// alias bsus.js
(function() {
    window.addEventListener("DOMContentLoaded", function() {
        document.querySelector("a[id^='newskip-btn-']").click();
    });
})();

/// remove-shadowroot-elem.js
/// alias rsre.js
/// world ISOLATED
// example.com##+js(rsre, [selector])
function removeShadowRootElem(
	selector = ''
) {
	  if ( selector === '' ) { return; }
	  const queryShadowRootElement = (shadowRootElement, rootElement) => {
		if (!rootElement) {
		    return queryShadowRootElement(shadowRootElement, document.documentElement);
		}
		const els = rootElement.querySelectorAll(shadowRootElement);
		for (const el of els) { if (el) { return el; } }
		const probes = rootElement.querySelectorAll('*');
		for (const probe of probes) {
		     if (probe.shadowRoot) {
			 const shadowElement = queryShadowRootElement(shadowRootElement, probe.shadowRoot);
			 if (shadowElement) { return shadowElement; }
		     }
		}
		return null;
	  };
	  const rmshadowelem = () => {
		try {
			const elem = queryShadowRootElement(selector);
			if (elem) { elem.remove(); }
		} catch { }
	  };
	  const observer = new MutationObserver(rmshadowelem);
	  observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true, });
	  if ( document.readyState === "complete" ) { self.setTimeout(observer.disconnect(), 67);  }
}

/// set-attr.js
/// alias sa.js
/// world ISOLATED
// example.com##+js(sa, attr, value, [selector])
function setAttr(
	token = '',
	attrValue = '',
	selector = '',
	runAt = ''
) {
	if ( token === '' ) { return; }
	const tokens = token.split(/\s*\|\s*/);
	if ( selector === '' ) { selector = `[${tokens.join('],[')}]`; }
	let timer;
	const setattr = () => {
	timer = undefined;
	const nodes = document.querySelectorAll(selector);
	try {
		for (const node of nodes) {
			for ( const attr of tokens ) {
			      if ( attr !== attrValue) {
				   node.setAttribute(attr, attrValue);
			      }
			}
		}
	} catch { }
	};
	const mutationHandler = mutations => {
	if ( timer !== undefined ) { return; }
	let skip = true;
	for ( let i = 0; i < mutations.length && skip; i++ ) {
	    const { type, addedNodes, removedNodes } = mutations[i];
	    if ( type === 'attributes' ) { skip = false; }
	    for ( let j = 0; j < addedNodes.length && skip; j++ ) {
		if ( addedNodes[j].nodeType === 1 ) { skip = false; break; }
	    }
	    for ( let j = 0; j < removedNodes.length && skip; j++ ) {
		if ( removedNodes[j].nodeType === 1 ) { skip = false; break; }
	    }
	}
	if ( skip ) { return; }
	timer = self.requestIdleCallback(setattr, { timeout: 10 });
	};
	const start = ( ) => {
	setattr();
	if ( /\bloop\b/.test(runAt) === false ) { return; }
	const observer = new MutationObserver(mutationHandler);
	observer.observe(document.documentElement, {
	    attributes: true,
	    attributeFilter: tokens,
	    childList: true,
	    subtree: true,
	});
	};
	if ( document.readyState !== 'complete' && /\bcomplete\b/.test(runAt) ) {
        self.addEventListener('load', start, { once: true });
    	} else if ( document.readyState !== 'loading' || /\basap\b/.test(runAt) ) {
        start();
    	} else {
        self.addEventListener('DOMContentLoaded', start, { once: true });
    	}
}

/// rename-attr.js
/// alias rna.js
/// world ISOLATED
// example.com##+js(rna, [selector], oldattr, newattr)
function renameAttr(
	selector = '',
	oldattr = '',
	newattr = '',
	runAt = ''
) {
	if ( selector === '' || oldattr === '' || newattr === '' ) { return; }
	let timer;
	const renameattr = ( ) => {
		timer = undefined;
		const elems = document.querySelectorAll( selector );
		try {
			for ( const elem of elems ) {
				if ( elem.hasAttribute( oldattr ) ) {
				     const value = elem.getAttribute( oldattr );
				     elem.removeAttribute( oldattr );
				     elem.setAttribute( newattr, value );
				}
			}
		} catch { }
	};
	const mutationHandler = mutations => {
		if ( timer !== undefined ) { return; }
		let skip = true;
		for ( let i = 0; i < mutations.length && skip; i++ ) {
		    const { type, addedNodes, removedNodes } = mutations[i];
		    if ( type === 'attributes' ) { skip = false; }
		    for ( let j = 0; j < addedNodes.length && skip; j++ ) {
			if ( addedNodes[j].nodeType === 1 ) { skip = false; break; }
		    }
		    for ( let j = 0; j < removedNodes.length && skip; j++ ) {
			if ( removedNodes[j].nodeType === 1 ) { skip = false; break; }
		    }
		}
		if ( skip ) { return; }
		timer = self.requestIdleCallback(renameattr, { timeout: 10 });
	};
	const start = ( ) => {
		renameattr();
		if ( /\bloop\b/.test(runAt) === false ) { return; }
		const observer = new MutationObserver(mutationHandler);
		observer.observe(document.documentElement, {
		    attributes: true,
		    childList: true,
		    subtree: true,
		});
	};
	if ( document.readyState !== 'complete' && /\bcomplete\b/.test(runAt) ) {
        self.addEventListener('load', start, { once: true });
    	} else if ( document.readyState !== 'loading' || /\basap\b/.test(runAt) ) {
        start();
    	} else {
        self.addEventListener('DOMContentLoaded', start, { once: true });
    	}
}

/// add-class.js
/// alias ac.js
/// world ISOLATED
// example.com##+js(ac, class, [selector])
function addClass(
	needle = '',
	selector = ''
) {
	if ( needle === '' ) { return; }
	const needles = needle.split(/\s*\|\s*/);
	if ( selector === '' ) { selector = '.' + needles.map(a => CSS.escape(a)).join(',.'); }
	const addclass = ev => {
		if (ev) { self.removeEventListener(ev.type, addclass, true);  }
		const nodes = document.querySelectorAll(selector);
		try {
			for ( const node of nodes ) {
			      node.classList.add(...needles);
			}
		} catch { }
	};
	if (document.readyState === 'loading') {
	      self.addEventListener('DOMContentLoaded', addclass, true);
	} else {
	      addclass();
	}
}

/// replace-class.js
/// alias rpc.js
/// world ISOLATED
// example.com##+js(rpc, [selector], oldclass, newclass)
function replaceClass(
	selector = '',
	oldclass = '',
	newclass = '',
	runAt = ''
) {
	if ( selector === '' || oldclass === '' || newclass === '' ) { return; }
	let timer;
	const replaceclass = ( ) => {
	  timer = undefined;
	  const nodes = document.querySelectorAll(selector);
	  try {
		for ( const node of nodes ) {
		      if ( node.classList.contains(oldclass) ) {
			   node.classList.replace(oldclass, newclass);
		      }
		}
	  } catch { }
	};
	const mutationHandler = mutations => {
	if ( timer !== undefined ) { return; }
	let skip = true;
	for ( let i = 0; i < mutations.length && skip; i++ ) {
	    const { type, addedNodes, removedNodes } = mutations[i];
	    if ( type === 'attributes' ) { skip = false; }
	    for ( let j = 0; j < addedNodes.length && skip; j++ ) {
		if ( addedNodes[j].nodeType === 1 ) { skip = false; break; }
	    }
	    for ( let j = 0; j < removedNodes.length && skip; j++ ) {
		if ( removedNodes[j].nodeType === 1 ) { skip = false; break; }
	    }
	}
	if ( skip ) { return; }
	timer = self.requestIdleCallback(replaceclass, { timeout: 10 });
	};
	const start = ( ) => {
	replaceclass();
	if ( /\bloop\b/.test(runAt) === false ) { return; }
	const observer = new MutationObserver(mutationHandler);
	observer.observe(document.documentElement, {
	    attributes: true,
	    childList: true,
	    subtree: true,
	});
	};
	if ( document.readyState !== 'complete' && /\bcomplete\b/.test(runAt) ) {
        self.addEventListener('load', start, { once: true });
    	} else if ( document.readyState !== 'loading' || /\basap\b/.test(runAt) ) {
        start();
    	} else {
        self.addEventListener('DOMContentLoaded', start, { once: true });
    	}
}

/// move-attr-prop.js
/// alias map.js
/// world ISOLATED
// example.com##+js(map, [selector], [selector2], attr, attr2)
function moveAttrProp(
	selector = '',
	element = '',
	newattr = '',
	oldattr = ''
) {
	if ( selector === '' || element === '') { return; }
	const map = ev => {
		if (ev) { self.removeEventListener(ev.type, map, true); }
		try {
			const elem = document.querySelectorAll(selector);
			const elem2 = document.querySelectorAll(element);
			for (let i = 0; i < elem.length; i++) {
			     elem[i].setAttribute(newattr, elem2[i].getAttribute(oldattr));
			}
		} catch { }
	};
	if (document.readyState === 'loading') {
		    self.addEventListener('DOMContentLoaded', map, true);
	} else {
		    map();
	}
}

/// append-elem.js
/// alias ape.js
/// world ISOLATED
// example.com##+js(ape, [selector], element, attribute, value)
function appendElem(
	selector = '',
	elem = '',
	attr = '',
	value = ''
) {
	if ( selector === '' ) { return; }
	const appendNode = ev => {
		if (ev) { self.removeEventListener(ev.type, appendNode, true); }
		try {
			const elements = document.querySelectorAll(selector);
			for ( const element of elements ) {
			      const node = document.createElement(elem);
			      node.setAttribute(attr, value);
			      element.append(node);
			}
		} catch { }
	};
	if (document.readyState === 'complete') {
		    appendNode();
	} else {
		    self.addEventListener('load', appendNode, true);
	}
}

/// removeLocalItem.js
/// alias rli.js
/// world ISOLATED
// example.com##+js(rli, key)
function removeLocalItem(
	key = '',
	runAt = ''
) {
	    if ( key === '' ) { return; }
	    const keys = key.split(/\s*\|\s*/);
	    let timer;
	    const removeItem = () => {
		  timer = undefined;
		  if ( key === '*' ) { return localStorage.clear(); }
		  try {
			   for (const keyName of keys) {
				localStorage.removeItem(keyName);
			   }
		  } catch { }
	    };
	    const mutationHandler = mutations => {
		if ( timer !== undefined ) { return; }
		let skip = true;
		for ( let i = 0; i < mutations.length && skip; i++ ) {
		    const { type, addedNodes, removedNodes } = mutations[i];
		    if ( type === 'attributes' ) { skip = false; }
		    for ( let j = 0; j < addedNodes.length && skip; j++ ) {
			if ( addedNodes[j].nodeType === 1 ) { skip = false; break; }
		    }
		    for ( let j = 0; j < removedNodes.length && skip; j++ ) {
			if ( removedNodes[j].nodeType === 1 ) { skip = false; break; }
		    }
		}
		if ( skip ) { return; }
		timer = self.requestIdleCallback(removeItem, { timeout: 10 });
	    };
	    const start = ( ) => {
		removeItem();
		if ( /\bloop\b/.test(runAt) === false ) { return; }
		const observer = new MutationObserver(mutationHandler);
		observer.observe(document.documentElement, {
		    attributes: true,
		    childList: true,
		    subtree: true,
		});
	    };
	    if ( document.readyState !== 'complete' && /\bcomplete\b/.test(runAt) ) {
            self.addEventListener('load', start, { once: true });
    	    } else if ( document.readyState !== 'loading' || /\basap\b/.test(runAt) ) {
            start();
    	    } else {
            self.addEventListener('DOMContentLoaded', start, { once: true });
    	    }
}

/// callfunction.js
/// alias cf.js
/// world ISOLATED
// example.com##+js(cf, funcName, funcDelay)
function callFunction(
	funcCall = '',
	funcDelay = ''
) {
	      if ( funcCall === '' || funcDelay === '' ) { return; }
	      const funcInvoke = ev => {
			if (ev) { self.removeEventListener(ev.type, funcInvoke, true); }
			try {
				setTimeout(window[funcCall], funcDelay);
			} catch { }
	      };
	      if (document.readyState === 'interactive' || document.readyState === 'complete') {
		    funcInvoke();
	      } else {
		    self.addEventListener('DOMContentLoaded', funcInvoke, true);
	      }
}

/// no-alert-if.js
/// alias noaif.js
/// world ISOLATED
// example.com##+js(noaif, text)
function noAlertIf(
        needle = ''
) {
                const needleNot = needle.charAt(0) === '!';
                if ( needleNot ) { needle = needle.slice(1); }
                if ( /^\/.*\/$/.test(needle) ) {
                    needle = needle.slice(1, -1);
                } else if ( needle !== '' ) {
                    needle = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                }
                const log = needleNot === false && needle === '' ? console.log : undefined;
                const reNeedle = new RegExp(needle);
                self.alert = new Proxy(self.alert, {
                        apply: (target, thisArg, args) => {
		            let params;
			    try {
                            	  params = String(args);
			    } catch { }
                            let defuse = false;
                            if ( log !== undefined ) {
                                 log('uBO: alert("%s")', params);
                            } else if ( reNeedle.test(params) !== needleNot ) {
                                 defuse = reNeedle.test(params) !== needleNot;
                            }
                            if ( !defuse ) {
                                 return target.apply(thisArg, args);
                            }
                        }
                });
}

/// removeSessionItem.js
/// alias rsi.js
/// world ISOLATED
// example.com##+js(rsi, key)
function removeSessionItem(
        key = '',
	runAt = ''
) {
	    if ( key === '' ) { return; }
	    const keys = key.split(/\s*\|\s*/);
	    let timer;
	    const removeItem = () => {
		  timer = undefined;
		  if ( key === '*' ) { return sessionStorage.clear(); }
		  try {
			   for (const keyName of keys) {
				sessionStorage.removeItem(keyName);
			   }
		  } catch { }
	    };
	    const mutationHandler = mutations => {
		if ( timer !== undefined ) { return; }
		let skip = true;
		for ( let i = 0; i < mutations.length && skip; i++ ) {
		    const { type, addedNodes, removedNodes } = mutations[i];
		    if ( type === 'attributes' ) { skip = false; }
		    for ( let j = 0; j < addedNodes.length && skip; j++ ) {
			if ( addedNodes[j].nodeType === 1 ) { skip = false; break; }
		    }
		    for ( let j = 0; j < removedNodes.length && skip; j++ ) {
			if ( removedNodes[j].nodeType === 1 ) { skip = false; break; }
		    }
		}
		if ( skip ) { return; }
		timer = self.requestIdleCallback(removeItem, { timeout: 10 });
	    };
	    const start = ( ) => {
		removeItem();
		if ( /\bloop\b/.test(runAt) === false ) { return; }
		const observer = new MutationObserver(mutationHandler);
		observer.observe(document.documentElement, {
		    attributes: true,
		    childList: true,
		    subtree: true,
		});
	    };
	    if ( document.readyState !== 'complete' && /\bcomplete\b/.test(runAt) ) {
            self.addEventListener('load', start, { once: true });
    	    } else if ( document.readyState !== 'loading' || /\basap\b/.test(runAt) ) {
            start();
    	    } else {
            self.addEventListener('DOMContentLoaded', start, { once: true });
    	    }
}

/// setSessionItem.js
/// alias ssi.js
/// world ISOLATED
// example.com##+js(ssi, key, value)
function setSessionItem(
	key = '',
	value = '',
	runAt = ''
) {
	    if ( key === '' ) { return; }
	    const keys = key.split(/\s*\|\s*/);
	    let timer;
	    const setItem = () => {
		  timer = undefined;
		  try {
			   for (const keyName of keys) {
				if (sessionStorage.getItem(keyName) === value) { break; }
				    sessionStorage.setItem(keyName, value);
			   }
		  } catch { }
	    };
	    const mutationHandler = mutations => {
		if ( timer !== undefined ) { return; }
		let skip = true;
		for ( let i = 0; i < mutations.length && skip; i++ ) {
		    const { type, addedNodes, removedNodes } = mutations[i];
		    if ( type === 'attributes' ) { skip = false; }
		    for ( let j = 0; j < addedNodes.length && skip; j++ ) {
			if ( addedNodes[j].nodeType === 1 ) { skip = false; break; }
		    }
		    for ( let j = 0; j < removedNodes.length && skip; j++ ) {
			if ( removedNodes[j].nodeType === 1 ) { skip = false; break; }
		    }
		}
		if ( skip ) { return; }
		timer = self.requestIdleCallback(setItem, { timeout: 10 });
	    };
	    const start = ( ) => {
		setItem();
		if ( /\bloop\b/.test(runAt) === false ) { return; }
		const observer = new MutationObserver(mutationHandler);
		observer.observe(document.documentElement, {
		    attributes: true,
		    childList: true,
		    subtree: true,
		});
	    };
	    if ( document.readyState !== 'complete' && /\bcomplete\b/.test(runAt) ) {
        self.addEventListener('load', start, { once: true });
    	} else if ( document.readyState !== 'loading' || /\basap\b/.test(runAt) ) {
        start();
    	} else {
        self.addEventListener('DOMContentLoaded', start, { once: true });
    	}
}

/// insert-child-before.js
/// alias icb.js
/// world ISOLATED
// example.com##+js(icb, element, node)
function insertChildBefore(
	selector = '',
	element = '',
	runAt = ''
) {
	if ( selector === '' || element === '' ) { return; }
	let timer;
	const insertelem = () => {
		timer = undefined;
		try {
			const elems = document.querySelectorAll(selector);
			const nodes = document.querySelectorAll(element);
			for (let i = 0; i < elems.length; i++) {
			    elems[i].before(nodes[i]);
			}
		} catch { }
	};
	const mutationHandler = mutations => {
		if ( timer !== undefined ) { return; }
		let skip = true;
		for ( let i = 0; i < mutations.length && skip; i++ ) {
		    const { type, addedNodes, removedNodes } = mutations[i];
		    if ( type === 'attributes' ) { skip = false; }
		    for ( let j = 0; j < addedNodes.length && skip; j++ ) {
			if ( addedNodes[j].nodeType === 1 ) { skip = false; break; }
		    }
		    for ( let j = 0; j < removedNodes.length && skip; j++ ) {
			if ( removedNodes[j].nodeType === 1 ) { skip = false; break; }
		    }
		}
		if ( skip ) { return; }
		timer = self.requestIdleCallback(insertelem, { timeout: 10 });
	};
	const start = ( ) => {
		insertelem();
		if ( /\bloop\b/.test(runAt) === false ) { return; }
		const observer = new MutationObserver(mutationHandler);
		observer.observe(document.documentElement, {
		    attributes: true,
		    childList: true,
		    subtree: true,
		});
	};
	if ( document.readyState !== 'complete' && /\bcomplete\b/.test(runAt) ) {
        self.addEventListener('load', start, { once: true });
    	} else if ( document.readyState !== 'loading' || /\basap\b/.test(runAt) ) {
        start();
    	} else {
        self.addEventListener('DOMContentLoaded', start, { once: true });
    }
}

/// insert-child-after.js
/// alias ica.js
/// world ISOLATED
// example.com##+js(ica, element, node)
function insertChildAfter(
	selector = '',
	element = '',
	runAt = ''
) {
	if ( selector === '' || element === '' ) { return; }
	let timer;
	const insertelem = () => {
		timer = undefined;
		try {
			const elems = document.querySelectorAll(selector);
			const nodes = document.querySelectorAll(element);
			for (let i = 0; i < elems.length; i++) {
			    elems[i].after(nodes[i]);
			}
		} catch { }
	};
	const mutationHandler = mutations => {
		if ( timer !== undefined ) { return; }
		let skip = true;
		for ( let i = 0; i < mutations.length && skip; i++ ) {
		    const { type, addedNodes, removedNodes } = mutations[i];
		    if ( type === 'attributes' ) { skip = false; }
		    for ( let j = 0; j < addedNodes.length && skip; j++ ) {
			if ( addedNodes[j].nodeType === 1 ) { skip = false; break; }
		    }
		    for ( let j = 0; j < removedNodes.length && skip; j++ ) {
			if ( removedNodes[j].nodeType === 1 ) { skip = false; break; }
		    }
		}
		if ( skip ) { return; }
		timer = self.requestIdleCallback(insertelem, { timeout: 10 });
	};
	const start = ( ) => {
		insertelem();
		if ( /\bloop\b/.test(runAt) === false ) { return; }
		const observer = new MutationObserver(mutationHandler);
		observer.observe(document.documentElement, {
		    attributes: true,
		    childList: true,
		    subtree: true,
		});
	};
	if ( document.readyState !== 'complete' && /\bcomplete\b/.test(runAt) ) {
        self.addEventListener('load', start, { once: true });
    	} else if ( document.readyState !== 'loading' || /\basap\b/.test(runAt) ) {
        start();
    	} else {
        self.addEventListener('DOMContentLoaded', start, { once: true });
    }
}

/// response-prune.js
/// alias resp.js
/// dependency pattern-to-regex.fn
// example.com##+js(resp, url, needle, text)
function responsePrune(
         resURL = '',
         needle = '',
         textContent = ''
) {
	  resURL= patternToRegex(resURL, "gms");
	  needle = patternToRegex(needle, "gms");
          if ( textContent === '' ) { textContent = ''; }
          const pruner = stringText => {
               stringText  = stringText.replace(needle, textContent);
               return stringText;
          };
          const urlFromArg = arg => {
              if ( typeof arg === 'string' ) { return arg; }
              if ( arg instanceof Request ) { return arg.url; }
              return String(arg);
          };
          const realFetch = self.fetch;
          self.fetch = new Proxy(self.fetch, {
              apply: (target, thisArg, args) => {
                  if ( resURL.test(urlFromArg(args[0])) === false ) {
                      return Reflect.apply(target, thisArg, args);
                  }
                  return realFetch(...args).then(realResponse =>
                      realResponse.text().then(text =>
                          new Response(pruner(text), {
                              status: realResponse.status,
                              statusText: realResponse.statusText,
                              headers: realResponse.headers,
                          })
                      )
                  );
              }
          });
          self.XMLHttpRequest.prototype.open = new Proxy(self.XMLHttpRequest.prototype.open, {
              apply: async (target, thisArg, args) => {
                  if ( resURL.test(urlFromArg(args[1])) === false ) {
                      return Reflect.apply(target, thisArg, args);
                  }
                  thisArg.addEventListener('readystatechange', function() {
                	if ( thisArg.readyState !== 4 ) { return; }
                	const type = thisArg.responseType;
                	if ( type !== '' && type !== 'text' ) { return; }
                	const textin = thisArg.responseText;
                	const textout = pruner(textin);
                	if ( textout === textin ) { return; }
                	Object.defineProperty(thisArg, 'response', { value: textout });
                	Object.defineProperty(thisArg, 'responseText', { value: textout });
            	  });
                  return Reflect.apply(target, thisArg, args);
              }
          });
}

/// get-url-parameter.js
/// alias gup.js
(function() {
    if (window.location.href.includes("?url=") || window.location.href.includes("&url=")) {
        let urlParams = new URLSearchParams(window.location.search);
        let urlReplacement = urlParams.get("url");
        if (window.location.href.match("url=http")) {
            window.location.replace(urlReplacement);
        } else {
            window.location.replace("https://" + urlReplacement);
        }
    }
})();

/***********************/
/* Specific Scriptlets */
/***********************/
/// amazon-url-cleaner.js
/// alias auc.js
(function() {
    window.addEventListener("load", function() {
        let asin = document.getElementById("ASIN");
        if (asin) {
            let url = document.location.protocol + "//" + document.location.host + "/dp/" + asin.value + "/";
            if (url === document.location.href) {
                return;
            }
            window.history.replaceState(null, null, url);
        }
    });
})();

/// apple-music-artwork-format-and-size-changer.js
/// alias amafasc.js
(function() {
    if (window.location.href.includes(".mzstatic.com/image/thumb/")) {
        if (window.location.href.match("190x190") && window.location.href.match(".webp")) {
            window.location.replace(window.location.toString().replace("190x190", "2000x2000").replace(".webp", ".jpeg"));
        } else if (window.location.href.match("200x200") && window.location.href.match(".webp")) {
            window.location.replace(window.location.toString().replace("200x200", "2000x2000").replace(".webp", ".jpeg"));
        } else if (window.location.href.match("270x270") && window.location.href.match(".webp")) {
            window.location.replace(window.location.toString().replace("270x270", "2000x2000").replace(".webp", ".jpeg"));
        } else if (window.location.href.match("296x296") && window.location.href.match(".webp")) {
            window.location.replace(window.location.toString().replace("296x296", "2000x2000").replace(".webp", ".jpeg"));
        } else if (window.location.href.match("300x300") && window.location.href.match(".webp")) {
            window.location.replace(window.location.toString().replace("300x300", "2000x2000").replace(".webp", ".jpeg"));
        } else if (window.location.href.match("305x305") && window.location.href.match(".webp")) {
            window.location.replace(window.location.toString().replace("305x305", "2000x2000").replace(".webp", ".jpeg"));
        } else if (window.location.href.match("316x316") && window.location.href.match(".webp")) {
            window.location.replace(window.location.toString().replace("316x316", "2000x2000").replace(".webp", ".jpeg"));
        } else if (window.location.href.match("380x380") && window.location.href.match(".webp")) {
            window.location.replace(window.location.toString().replace("380x380", "2000x2000").replace(".webp", ".jpeg"));
        } else if (window.location.href.match("400x400") && window.location.href.match(".webp")) {
            window.location.replace(window.location.toString().replace("400x400", "2000x2000").replace(".webp", ".jpeg"));
        } else if (window.location.href.match("500x500") && window.location.href.match(".webp")) {
            window.location.replace(window.location.toString().replace("500x500", "2000x2000").replace(".webp", ".jpeg"));
        } else if (window.location.href.match("540x540") && window.location.href.match(".webp")) {
            window.location.replace(window.location.toString().replace("540x540", "2000x2000").replace(".webp", ".jpeg"));
        } else if (window.location.href.match("592x592") && window.location.href.match(".webp")) {
            window.location.replace(window.location.toString().replace("592x592", "2000x2000").replace(".webp", ".jpeg"));
        } else if (window.location.href.match("600x600") && window.location.href.match(".webp")) {
            window.location.replace(window.location.toString().replace("600x600", "2000x2000").replace(".webp", ".jpeg"));
        } else if (window.location.href.match("610x610") && window.location.href.match(".webp")) {
            window.location.replace(window.location.toString().replace("610x610", "2000x2000").replace(".webp", ".jpeg"));
        } else if (window.location.href.match("632x632") && window.location.href.match(".webp")) {
            window.location.replace(window.location.toString().replace("632x632", "2000x2000").replace(".webp", ".jpeg"));
        } else if (window.location.href.match("1000x1000") && window.location.href.match(".webp")) {
            window.location.replace(window.location.toString().replace("1000x1000", "2000x2000").replace(".webp", ".jpeg"));
        }
    }
})();

/// github-gist-target-attribute-setter.js
/// alias ggtas.js
(function() {
    window.addEventListener("load", function() {
        document.querySelectorAll("article[itemprop='text'] > p[dir='auto'] > a[href^='http']").forEach(function(a) {
            a.setAttribute("target", "_blank");
        });
        document.querySelectorAll("article[itemprop='text'] > ul[dir='auto'] > li > a[href^='http']").forEach(function(b) {
            b.setAttribute("target", "_blank");
        });
    });
})();

/// hikarinoakariost-bypasser.js
/// alias hnab.js
(function() {
    if (window.location.href.includes("/hikarinoakari.com/out/")) {
        setTimeout(function() {
            document.querySelector("a[class='link']").click();
        }, 750);
    }
})();

/// nyaa-dark-mode-enabler.js
/// alias ndme.js
(function() {
    window.addEventListener("DOMContentLoaded", function() {
        if (!document.body.classList.contains("dark")) {
            document.querySelector("a[id='themeToggle']").click();
        }
    });
})();

/// old-reddit-redirector.js
/// alias orr.js
(function() {
    if (window.location.href.includes("/www.reddit.com/")) {
        window.location.replace(window.location.toString().replace("/www.reddit.com/", "/r/popular/?geo_filter=GLOBAL/"));
    }
})();

/// ouo-io-bypasser.js
/// alias oib.js
(function() {
    window.addEventListener("load", function() {
        if (document.getElementById("form-captcha") === null) {
            document.getElementsByTagName("form")[0].submit();
        }
        if (document.getElementById("form-captcha").click) {
            document.getElementsByTagName("form")[0].submit();
        }
    });
})();

/// rentry-target-attribute-setter.js
/// alias rtas.js
(function() {
    window.addEventListener("load", function() {
        document.querySelectorAll("a[href^='http']").forEach(function(a) {
            a.setAttribute("target", "_blank");
        });
    });
})();

/// youtube-shorts-redirector.js
/// alias ysr.js
(function() {
    let oldHref = document.location.href;
    if (window.location.href.indexOf("youtube.com/shorts") > -1) {
        window.location.replace(window.location.toString().replace("/shorts/", "/watch?v="));
    }
    window.onload = function() {
        let bodyList = document.querySelector("body");
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function() {
                if (oldHref !== document.location.href) {
                    oldHref = document.location.href;
                    if (window.location.href.indexOf("youtube.com/shorts") > -1) {
                        window.location.replace(window.location.toString().replace("/shorts/", "/watch?v="));
                    }
                }
            });
        });
        let config = {
            childList: true,
            subtree: true
        };
        observer.observe(bodyList, config);
    };
})();
