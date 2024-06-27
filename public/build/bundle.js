
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/BarraSuperior.svelte generated by Svelte v3.59.2 */

    const file$6 = "src/components/BarraSuperior.svelte";

    function create_fragment$6(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			attr_dev(div0, "class", "acao svelte-6jh97u");
    			add_location(div0, file$6, 1, 4, 33);
    			attr_dev(div1, "class", "acao svelte-6jh97u");
    			add_location(div1, file$6, 2, 4, 62);
    			attr_dev(div2, "class", "acao svelte-6jh97u");
    			add_location(div2, file$6, 3, 4, 91);
    			attr_dev(div3, "class", "barra-superior svelte-6jh97u");
    			add_location(div3, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BarraSuperior', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BarraSuperior> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class BarraSuperior extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BarraSuperior",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/CardUsuario.svelte generated by Svelte v3.59.2 */
    const file$5 = "src/components/CardUsuario.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (20:6) {#if dateGit.nome}
    function create_if_block_1(ctx) {
    	let div;
    	let t0;
    	let span;
    	let t1_value = /*dateGit*/ ctx[0].nome + "";
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("Nome: ");
    			span = element("span");
    			t1 = text(t1_value);
    			attr_dev(span, "class", "svelte-1tsi18y");
    			add_location(span, file$5, 20, 32, 562);
    			attr_dev(div, "class", "info svelte-1tsi18y");
    			add_location(div, file$5, 20, 8, 538);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, span);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dateGit*/ 1 && t1_value !== (t1_value = /*dateGit*/ ctx[0].nome + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(20:6) {#if dateGit.nome}",
    		ctx
    	});

    	return block;
    }

    // (30:4) {#if temRepositorios}
    function create_if_block$2(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let ul;
    	let each_value = /*dateGit*/ ctx[0].repositorios_recentes;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Repositorios recentes:";
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "titulo svelte-1tsi18y");
    			add_location(h2, file$5, 31, 8, 934);
    			add_location(ul, file$5, 33, 8, 990);
    			attr_dev(div, "class", "repositorios svelte-1tsi18y");
    			add_location(div, file$5, 30, 6, 899);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dateGit*/ 1) {
    				each_value = /*dateGit*/ ctx[0].repositorios_recentes;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(30:4) {#if temRepositorios}",
    		ctx
    	});

    	return block;
    }

    // (35:10) {#each dateGit.repositorios_recentes as repositorio}
    function create_each_block(ctx) {
    	let li;
    	let a;
    	let t0_value = /*repositorio*/ ctx[2].nome + "";
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = /*repositorio*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "repositorio svelte-1tsi18y");
    			add_location(a, file$5, 36, 14, 1089);
    			add_location(li, file$5, 35, 12, 1070);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dateGit*/ 1 && t0_value !== (t0_value = /*repositorio*/ ctx[2].nome + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*dateGit*/ 1 && a_href_value !== (a_href_value = /*repositorio*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(35:10) {#each dateGit.repositorios_recentes as repositorio}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div7;
    	let barrasuperior;
    	let t0;
    	let div6;
    	let div1;
    	let a;
    	let div0;
    	let style_background_image = `url(${/*dateGit*/ ctx[0].avatar_url})`;
    	let a_href_value;
    	let t1;
    	let div5;
    	let t2;
    	let div2;
    	let t3;
    	let span0;
    	let t4_value = /*dateGit*/ ctx[0].login + "";
    	let t4;
    	let t5;
    	let div3;
    	let t6;
    	let span1;
    	let t7_value = /*dateGit*/ ctx[0].seguidores + "";
    	let t7;
    	let t8;
    	let div4;
    	let t9;
    	let span2;
    	let t10_value = /*dateGit*/ ctx[0].repositorios_publicos + "";
    	let t10;
    	let t11;
    	let current;
    	barrasuperior = new BarraSuperior({ $$inline: true });
    	let if_block0 = /*dateGit*/ ctx[0].nome && create_if_block_1(ctx);
    	let if_block1 = /*temRepositorios*/ ctx[1] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			create_component(barrasuperior.$$.fragment);
    			t0 = space();
    			div6 = element("div");
    			div1 = element("div");
    			a = element("a");
    			div0 = element("div");
    			t1 = space();
    			div5 = element("div");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			div2 = element("div");
    			t3 = text("Usuário: ");
    			span0 = element("span");
    			t4 = text(t4_value);
    			t5 = space();
    			div3 = element("div");
    			t6 = text("Seguidores: ");
    			span1 = element("span");
    			t7 = text(t7_value);
    			t8 = space();
    			div4 = element("div");
    			t9 = text("Repositorios");
    			span2 = element("span");
    			t10 = text(t10_value);
    			t11 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div0, "class", "foto-usuario svelte-1tsi18y");
    			set_style(div0, "background-image", style_background_image);
    			add_location(div0, file$5, 11, 8, 334);
    			attr_dev(a, "href", a_href_value = /*dateGit*/ ctx[0].perfil_url);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$5, 10, 6, 280);
    			attr_dev(div1, "class", "foto-container svelte-1tsi18y");
    			add_location(div1, file$5, 9, 4, 245);
    			attr_dev(span0, "class", "svelte-1tsi18y");
    			add_location(span0, file$5, 22, 33, 641);
    			attr_dev(div2, "class", "info svelte-1tsi18y");
    			add_location(div2, file$5, 22, 6, 614);
    			attr_dev(span1, "class", "svelte-1tsi18y");
    			add_location(span1, file$5, 23, 36, 712);
    			attr_dev(div3, "class", "info svelte-1tsi18y");
    			add_location(div3, file$5, 23, 6, 682);
    			attr_dev(span2, "class", "svelte-1tsi18y");
    			add_location(span2, file$5, 25, 20, 797);
    			attr_dev(div4, "class", "info svelte-1tsi18y");
    			add_location(div4, file$5, 24, 6, 758);
    			attr_dev(div5, "class", "detalhes-usuario svelte-1tsi18y");
    			add_location(div5, file$5, 18, 4, 474);
    			attr_dev(div6, "class", "usuario svelte-1tsi18y");
    			add_location(div6, file$5, 8, 2, 219);
    			attr_dev(div7, "class", "card-usuario svelte-1tsi18y");
    			add_location(div7, file$5, 5, 0, 169);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			mount_component(barrasuperior, div7, null);
    			append_dev(div7, t0);
    			append_dev(div7, div6);
    			append_dev(div6, div1);
    			append_dev(div1, a);
    			append_dev(a, div0);
    			append_dev(div6, t1);
    			append_dev(div6, div5);
    			if (if_block0) if_block0.m(div5, null);
    			append_dev(div5, t2);
    			append_dev(div5, div2);
    			append_dev(div2, t3);
    			append_dev(div2, span0);
    			append_dev(span0, t4);
    			append_dev(div5, t5);
    			append_dev(div5, div3);
    			append_dev(div3, t6);
    			append_dev(div3, span1);
    			append_dev(span1, t7);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, t9);
    			append_dev(div4, span2);
    			append_dev(span2, t10);
    			append_dev(div6, t11);
    			if (if_block1) if_block1.m(div6, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dateGit*/ 1 && style_background_image !== (style_background_image = `url(${/*dateGit*/ ctx[0].avatar_url})`)) {
    				set_style(div0, "background-image", style_background_image);
    			}

    			if (!current || dirty & /*dateGit*/ 1 && a_href_value !== (a_href_value = /*dateGit*/ ctx[0].perfil_url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (/*dateGit*/ ctx[0].nome) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(div5, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if ((!current || dirty & /*dateGit*/ 1) && t4_value !== (t4_value = /*dateGit*/ ctx[0].login + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*dateGit*/ 1) && t7_value !== (t7_value = /*dateGit*/ ctx[0].seguidores + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty & /*dateGit*/ 1) && t10_value !== (t10_value = /*dateGit*/ ctx[0].repositorios_publicos + "")) set_data_dev(t10, t10_value);

    			if (/*temRepositorios*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					if_block1.m(div6, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(barrasuperior.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(barrasuperior.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_component(barrasuperior);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let temRepositorios;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CardUsuario', slots, []);
    	let { dateGit } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (dateGit === undefined && !('dateGit' in $$props || $$self.$$.bound[$$self.$$.props['dateGit']])) {
    			console.warn("<CardUsuario> was created without expected prop 'dateGit'");
    		}
    	});

    	const writable_props = ['dateGit'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CardUsuario> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('dateGit' in $$props) $$invalidate(0, dateGit = $$props.dateGit);
    	};

    	$$self.$capture_state = () => ({ BarraSuperior, dateGit, temRepositorios });

    	$$self.$inject_state = $$props => {
    		if ('dateGit' in $$props) $$invalidate(0, dateGit = $$props.dateGit);
    		if ('temRepositorios' in $$props) $$invalidate(1, temRepositorios = $$props.temRepositorios);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*dateGit*/ 1) {
    			$$invalidate(1, temRepositorios = Boolean(dateGit.repositorios_recentes.length));
    		}
    	};

    	return [dateGit, temRepositorios];
    }

    class CardUsuario extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { dateGit: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CardUsuario",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get dateGit() {
    		throw new Error("<CardUsuario>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dateGit(value) {
    		throw new Error("<CardUsuario>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Titulo.svelte generated by Svelte v3.59.2 */

    const file$4 = "src/components/Titulo.svelte";

    function create_fragment$4(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Svelte Perfies";
    			attr_dev(h1, "class", "titulo svelte-17jlksh");
    			add_location(h1, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Titulo', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Titulo> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Titulo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Titulo",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    function obterUsuario(nomeUsuario) {
        return fetch(`https://api.github.com/users/${nomeUsuario}`);
    }
    function obterRepositorios(nomeUsuario) {
        return fetch(`https://api.github.com/users/${nomeUsuario}/repos?sort=created&per_page=5`);
    }

    function montarUsuario(dadosUsuario, dadosRepositorio) {
        const repositorios_recentes = dadosRepositorio.map((repositorio) => {
            return {
                nome: repositorio.name,
                url: repositorio.url
            };
        });
        return {
            avatar_url: dadosUsuario.avatar_url,
            login: dadosUsuario.login,
            nome: dadosUsuario.name,
            perfil_url: dadosUsuario.html_url,
            repositorios_publicos: dadosUsuario.public_repos,
            seguidores: dadosUsuario.followers,
            repositorios_recentes: repositorios_recentes
        };
    }

    /* src/components/Botao.svelte generated by Svelte v3.59.2 */

    const file$3 = "src/components/Botao.svelte";

    function create_fragment$3(ctx) {
    	let button;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "botao svelte-8fdye6");
    			add_location(button, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Botao', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Botao> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Botao extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Botao",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/Formulario.svelte generated by Svelte v3.59.2 */
    const file$2 = "src/components/Formulario.svelte";

    // (33:2) {#if statusErro === 404}
    function create_if_block$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Usuário não encontrado";
    			attr_dev(span, "class", "erro svelte-1ijldoe");
    			add_location(span, file$2, 33, 4, 1003);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(33:2) {#if statusErro === 404}",
    		ctx
    	});

    	return block;
    }

    // (38:4) <Botao>
    function create_default_slot(ctx) {
    	let t;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			t = text("Buscar\n        ");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/assets/lupa.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "ícone de lupa");
    			add_location(img, file$2, 39, 8, 1128);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(38:4) <Botao>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let form;
    	let input;
    	let t0;
    	let t1;
    	let div;
    	let botao;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*statusErro*/ ctx[1] === 404 && create_if_block$1(ctx);

    	botao = new Botao({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form = element("form");
    			input = element("input");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div = element("div");
    			create_component(botao.$$.fragment);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "input svelte-1ijldoe");
    			attr_dev(input, "placeholder", "Digite o usuário");
    			toggle_class(input, "input-erro", /*statusErro*/ ctx[1] === 404);
    			add_location(input, file$2, 24, 2, 826);
    			attr_dev(div, "class", "botao-container svelte-1ijldoe");
    			add_location(div, file$2, 36, 2, 1063);
    			add_location(form, file$2, 23, 0, 779);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, input);
    			set_input_value(input, /*user*/ ctx[0]);
    			append_dev(form, t0);
    			if (if_block) if_block.m(form, null);
    			append_dev(form, t1);
    			append_dev(form, div);
    			mount_component(botao, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[3]),
    					listen_dev(form, "submit", prevent_default(/*aoSubmeter*/ ctx[2]), false, true, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*user*/ 1 && input.value !== /*user*/ ctx[0]) {
    				set_input_value(input, /*user*/ ctx[0]);
    			}

    			if (!current || dirty & /*statusErro*/ 2) {
    				toggle_class(input, "input-erro", /*statusErro*/ ctx[1] === 404);
    			}

    			if (/*statusErro*/ ctx[1] === 404) {
    				if (if_block) ; else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(form, t1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const botao_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				botao_changes.$$scope = { dirty, ctx };
    			}

    			botao.$set(botao_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(botao.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(botao.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (if_block) if_block.d();
    			destroy_component(botao);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Formulario', slots, []);
    	let user = "";
    	let statusErro = null;
    	const dispatch = createEventDispatcher();

    	async function aoSubmeter() {
    		const resp = await obterUsuario(user);
    		const projetos = await obterRepositorios(user);

    		if (resp.ok && projetos.ok) {
    			const dadosUsuario = await resp.json();
    			const repositorios = await projetos.json();
    			$$invalidate(1, statusErro = null);
    			dispatch("aoAlterarUsuario", montarUsuario(dadosUsuario, repositorios));
    		} else {
    			$$invalidate(1, statusErro = resp.status);
    			dispatch('aoAlterarUsuario', null);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Formulario> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		user = this.value;
    		$$invalidate(0, user);
    	}

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		obterUsuario,
    		obterRepositorios,
    		montarUsuario,
    		Botao,
    		user,
    		statusErro,
    		dispatch,
    		aoSubmeter
    	});

    	$$self.$inject_state = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    		if ('statusErro' in $$props) $$invalidate(1, statusErro = $$props.statusErro);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [user, statusErro, aoSubmeter, input_input_handler];
    }

    class Formulario extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Formulario",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/Header.svelte generated by Svelte v3.59.2 */
    const file$1 = "src/components/Header.svelte";

    function create_fragment$1(ctx) {
    	let header;
    	let titulo;
    	let t;
    	let div;
    	let formulario;
    	let current;
    	titulo = new Titulo({ $$inline: true });
    	formulario = new Formulario({ $$inline: true });
    	formulario.$on("aoAlterarUsuario", /*aoAlterarUsuario_handler*/ ctx[0]);

    	const block = {
    		c: function create() {
    			header = element("header");
    			create_component(titulo.$$.fragment);
    			t = space();
    			div = element("div");
    			create_component(formulario.$$.fragment);
    			attr_dev(div, "class", "busca-usuario svelte-wi7f3z");
    			add_location(div, file$1, 7, 4, 141);
    			attr_dev(header, "class", "svelte-wi7f3z");
    			add_location(header, file$1, 4, 0, 113);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			mount_component(titulo, header, null);
    			append_dev(header, t);
    			append_dev(header, div);
    			mount_component(formulario, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(titulo.$$.fragment, local);
    			transition_in(formulario.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(titulo.$$.fragment, local);
    			transition_out(formulario.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(titulo);
    			destroy_component(formulario);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	function aoAlterarUsuario_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$capture_state = () => ({ Titulo, Formulario });
    	return [aoAlterarUsuario_handler];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    // (12:1) {#if dateGit}
    function create_if_block(ctx) {
    	let cardusuario;
    	let current;

    	cardusuario = new CardUsuario({
    			props: { dateGit: /*dateGit*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cardusuario.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cardusuario, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cardusuario_changes = {};
    			if (dirty & /*dateGit*/ 1) cardusuario_changes.dateGit = /*dateGit*/ ctx[0];
    			cardusuario.$set(cardusuario_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cardusuario.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cardusuario.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cardusuario, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(12:1) {#if dateGit}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let header;
    	let t;
    	let current;
    	header = new Header({ $$inline: true });
    	header.$on("aoAlterarUsuario", /*definirUsuario*/ ctx[1]);
    	let if_block = /*dateGit*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(header.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "app svelte-1uv5r5y");
    			add_location(div, file, 8, 0, 222);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(header, div, null);
    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*dateGit*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*dateGit*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(header);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let dateGit = null;

    	function definirUsuario(evento) {
    		$$invalidate(0, dateGit = evento.detail);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		CardUsuario,
    		Header,
    		dateGit,
    		definirUsuario
    	});

    	$$self.$inject_state = $$props => {
    		if ('dateGit' in $$props) $$invalidate(0, dateGit = $$props.dateGit);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [dateGit, definirUsuario];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
