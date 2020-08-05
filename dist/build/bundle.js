
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
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

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
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
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
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
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
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
        flushing = false;
        seen_callbacks.clear();
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
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
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
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
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
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    class GameUI {
        static createUI() {
            let uiTexture = BABYLON.GUI
                .AdvancedDynamicTexture
                .CreateFullscreenUI("UI");
            GameUI.info_text = new BABYLON.GUI.TextBlock("info_text", "");
            Object.assign(GameUI.info_text, {
                horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                verticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
                left: 0.1,
                top: 0.1,
                width: 0.3,
                height: "40px",
                fontSize: 24,
                color: "white",
            });
            uiTexture.addControl(GameUI.info_text);
            var createRectangle = function () {
                var rect1 = new BABYLON.GUI.Rectangle();
                rect1.width = 0.2;
                rect1.height = "40px";
                rect1.cornerRadius = 20;
                rect1.color = "white";
                rect1.thickness = 4;
                rect1.background = "green";
                uiTexture.addControl(rect1);
                return rect1;
            };
            var text = new BABYLON.GUI.TextBlock("info_text", "HELLO WORLD");
            Object.assign(text, {
                horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                verticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,
                left: 0.1,
                top: 0.1,
                width: 0.3,
                height: "40px",
                fontSize: 24,
                color: "white",
            });
            uiTexture.addControl(text);
            createRectangle().horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            createRectangle().horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        }
    }

    function GameRenderLoop(engine, scene, camera) {
        scene.render();
        GameUI.info_text.text = scene.getMeshByName("sphere")
            .position.asArray().map((x, i) => {
            return `${"xyz"[i]}: ${x.toFixed(2)}`;
        }).join(", ");
    }

    var STATE;
    (function (STATE) {
        STATE[STATE["IDLE"] = 0] = "IDLE";
        STATE[STATE["WALK"] = 1] = "WALK";
        STATE[STATE["RUN"] = 2] = "RUN";
    })(STATE || (STATE = {}));
    class Human {
        constructor(scene) {
            this.scene = scene;
            this.meshes = Human.meshes;
            this.skeletons = Human.skeletons;
            var skeleton = this.skeletons[0];
            skeleton.animationPropertiesOverride = new BABYLON.AnimationPropertiesOverride();
            skeleton.animationPropertiesOverride.enableBlending = true;
            skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
            skeleton.animationPropertiesOverride.loopMode = 1;
            this.idleRange = skeleton.getAnimationRange("YBot_Idle");
            this.walkRange = skeleton.getAnimationRange("YBot_Walk");
            this.runRange = skeleton.getAnimationRange("YBot_Run");
            var leftRange = skeleton.getAnimationRange("YBot_LeftStrafeWalk");
            var rightRange = skeleton.getAnimationRange("YBot_RightStrafeWalk");
            this.beginIdle();
            window["a"] = this.scene;
            window["b"] = this.skeletons;
            window["c"] = this;
        }
        beginIdle() {
            if (this.idleRange && this.state !== STATE.IDLE) {
                this.state = STATE.IDLE;
                this.scene.beginAnimation(this.skeletons[0], this.idleRange.from, this.idleRange.to, true);
            }
        }
        beginWalk() {
            if (this.walkRange && this.state !== STATE.WALK) {
                this.state = STATE.WALK;
                this.scene.beginAnimation(this.skeletons[0], this.walkRange.from, this.walkRange.to, true);
            }
        }
        beginRun() {
            if (this.runRange && this.state !== STATE.RUN) {
                this.state = STATE.RUN;
                this.scene.beginAnimation(this.skeletons[0], this.runRange.from, this.runRange.to, true);
            }
        }
        addShadow(shadowGen) {
            shadowGen.addShadowCaster(this.scene.meshes[0], true);
            for (var index = 0; index < this.meshes.length; index++) {
                this.meshes[index].receiveShadows = false;
            }
            return this;
        }
        static async createHuman(scene) {
            if (!Human.imported) {
                await BABYLON.SceneLoader.ImportMeshAsync("", "./assets/", "dummy3.babylon", scene).then(({ meshes, particleSystems, skeletons }) => {
                    Human.meshes = meshes;
                    Human.skeletons = skeletons;
                });
            }
            return new Human(scene);
        }
    }
    Human.imported = false;

    const GLOABL = new Map();
    Object.defineProperty(window, "GLOBAL", {
        get() {
            return GLOABL;
        }
    });
    var game;
    function setGame(_game) {
        game = _game;
        GLOABL.set("game", game);
    }
    Object.defineProperty(window, "game", {
        get() {
            return game;
        }
    });

    class GameScene {
        static createScene(engine) {
            let scene = new GameScene();
            scene.scene = createScene(engine);
            var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene.scene);
            light2.position = new BABYLON.Vector3(0, 5, 5);
            // Shadows
            var shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
            shadowGenerator.useBlurExponentialShadowMap = true;
            shadowGenerator.blurKernel = 32;
            Human.createHuman(scene.scene).then(human => {
                human.addShadow(shadowGenerator);
                scene.mainCharacter = human;
                console.log("HUMAN:", human);
                GLOABL.set("human", human);
            });
            return scene;
        }
        ;
    }
    function createBox(scene, { name, height = 1, width = 1, pos = [0, 0, 0], mass = 1, }) {
        var box = BABYLON.MeshBuilder.CreateBox(name, {
            height, width
        }, scene);
        box.position.set(pos[0], pos[1], pos[2]);
        box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass, friction: 0.5, restitution: 0.7,
        }, scene);
        return box;
    }
    function createScene(engine) {
        let scene = new BABYLON.Scene(engine);
        scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        scene.collisionsEnabled = true;
        let physicsPlugin = new BABYLON.AmmoJSPlugin();
        scene.enablePhysics(scene.gravity, physicsPlugin);
        createBox(scene, {
            name: "box1"
        });
        let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        var helper = scene.createDefaultEnvironment({
            enableGroundShadow: true
        });
        helper.setMainColor(BABYLON.Color3.Gray());
        helper.ground.position.y += 0.01;
        let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
            diameter: 2
        }, scene);
        // sphere.checkCollisions = true;
        sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.CylinderImpostor, {
            mass: 10.0, friction: 1.0, restitution: 0
        }, scene);
        var ground = BABYLON.MeshBuilder.CreateGround("ground", {
            height: 20, width: 20
        }, scene);
        ground.position.set(0, -5, 0);
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0, friction: 0.5, restitution: 0.7,
        }, scene);
        return scene;
    }

    /**
     * https://keycode.info/
     */
    class KEY_CODE {
        constructor(code, keyCode, key, which) {
            this.code = code;
            this.keyCode = keyCode;
            this.key = key;
            this.which = which;
            [code, keyCode, key, which].filter(k => !!k).forEach(e => {
                KEY_CODE.TO_KEYCODE.set(e, this);
            });
        }
        static getUnknownKeyCode(e) {
            let list = [e.code, e.keyCode, e.key, e.which];
            for (let k of list) {
                if (KEY_CODE.TO_KEYCODE.has(k)) {
                    console.warn(`KeyCode.ts: getUnknownKeyCode():`, `KeyCode(${k}) is found,`, "please use toKeyCode()");
                    return KEY_CODE.TO_KEYCODE.get(k);
                }
            }
            let kc = new KEY_CODE(e.code, e.keyCode, e.key, e.which);
            return kc;
        }
    }
    /**
     * TODO: handle duplicate problem
     */
    KEY_CODE.TO_KEYCODE = new Map();
    KEY_CODE.A = new KEY_CODE("KeyA", 63);
    KEY_CODE.S = new KEY_CODE("KeyS", 83, "s");
    KEY_CODE.D = new KEY_CODE("KeyD");
    KEY_CODE.W = new KEY_CODE("KeyW");
    KEY_CODE.RSHIFT = new KEY_CODE("ShiftRight", 16, "Shift");
    KEY_CODE.LSHIFT = new KEY_CODE("ShiftLeft", 16, "Shift");
    KEY_CODE.LCTRL = new KEY_CODE("ControlLeft", 17, "Control");
    KEY_CODE.SPACE = new KEY_CODE("Space", 32, " ");
    function toKeyCode(e) {
        return (KEY_CODE.TO_KEYCODE.get(e.code) ||
            KEY_CODE.TO_KEYCODE.get(e.keyCode) ||
            KEY_CODE.TO_KEYCODE.get(e.key) ||
            KEY_CODE.TO_KEYCODE.get(e.which)) || KEY_CODE.getUnknownKeyCode(e);
    }

    /*
    Object.fromEntries:
    https://github.com/microsoft/TypeScript/issues/30933
    */
    var KEY_ACTION;
    (function (KEY_ACTION) {
        KEY_ACTION[KEY_ACTION["LEFT"] = 0] = "LEFT";
        KEY_ACTION[KEY_ACTION["RIGHT"] = 1] = "RIGHT";
        KEY_ACTION[KEY_ACTION["FORWARD"] = 2] = "FORWARD";
        KEY_ACTION[KEY_ACTION["BACK"] = 3] = "BACK";
        KEY_ACTION[KEY_ACTION["DOWN"] = 4] = "DOWN";
        KEY_ACTION[KEY_ACTION["UP"] = 5] = "UP";
    })(KEY_ACTION || (KEY_ACTION = {}));
    var EVENT_TYPE;
    (function (EVENT_TYPE) {
        EVENT_TYPE["KEY"] = "key";
        EVENT_TYPE["MOUSE"] = "mouse";
    })(EVENT_TYPE || (EVENT_TYPE = {}));
    /*
    drop ICameraInput later
    */
    class GameInput {
        constructor(canvas, processMovement) {
            this.canvas = canvas;
            this.processMovement = processMovement;
            this.listeners = new Map();
            this.pressed = new Set();
            this.keyMap = new Map([
                [KEY_ACTION.LEFT, new Set([KEY_CODE.A])],
                [KEY_ACTION.RIGHT, new Set([KEY_CODE.D])],
                [KEY_ACTION.FORWARD, new Set([KEY_CODE.W])],
                [KEY_ACTION.BACK, new Set([KEY_CODE.S])],
                [KEY_ACTION.DOWN, new Set([KEY_CODE.LCTRL])],
                [KEY_ACTION.UP, new Set([KEY_CODE.SPACE])],
            ]);
            this.attached = false;
            this.detached = false;
            this.sensitivity = 5.0;
            this.onKeyDown = (e) => {
                let k = toKeyCode(e);
                if (k)
                    this.pressed.add(k);
                if (this.attached && !this.noPreventDefault) {
                    e.preventDefault();
                }
            };
            this.onKeyUp = (e) => {
                let k = toKeyCode(e);
                this.pressed.delete(k);
                if (this.attached && !this.noPreventDefault) {
                    e.preventDefault();
                }
            };
            this.onBlur = () => {
                this.pressed.clear();
            };
            this.lastCheck = performance.now();
        }
        registerActionManager(scene) {
            let actionManager = new BABYLON.ActionManager(scene);
            scene.actionManager = actionManager;
            actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, e => this.onKeyDown(e.sourceEvent)));
            actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, e => this.onKeyUp(e.sourceEvent)));
            scene.onBeforeRenderObservable.add((eventData, eventState) => {
                this.checkInputs();
            });
            return this;
        }
        getClassName() {
            return "GameInput";
        }
        getTypeName() {
            return "GameInput";
        }
        getSimpleName() {
            return "GameInput";
        }
        attachControl(element, noPreventDefault) {
            console.assert(element === this.canvas, "GameInput.ts:", "attachControl():", "attached canvas is different from given canvas", "\n\telem:", element, "\n\tthis.canvas:", this.canvas);
            if (!this.attached) {
                this.attached = true;
                this.noPreventDefault = noPreventDefault;
                element.tabIndex = 1;
                element.addEventListener("keydown", this.onKeyDown, false);
                element.addEventListener("keyup", this.onKeyUp, false);
                this.checkInputs();
                BABYLON.Tools.RegisterTopRootEvents(this.canvas, [
                    { name: "blur", handler: this.onBlur }
                ]);
            }
        }
        ;
        detachControl(element) {
            if (this.attached) {
                element.removeEventListener("keydown", this.onKeyDown);
                element.removeEventListener("keyup", this.onKeyUp);
                BABYLON.Tools.UnregisterTopRootEvents(this.canvas, [
                    { name: "blur", handler: this.onBlur }
                ]);
                this.listeners.clear();
                this.pressed.clear();
                this.attached = false;
            }
        }
        add(type, listener) {
            let _type;
            switch (type) {
                case "dir":
                    _type = EVENT_TYPE.MOUSE;
                    break;
                case "key":
                    _type = EVENT_TYPE.KEY;
                    break;
                default:
                    if (type in EVENT_TYPE) {
                        _type = type;
                    }
                    throw new Error(`unknown input event type ${type}`);
            }
            let list = this.listeners.get(_type);
            if (list) {
                list.push(listener);
            }
            else {
                this.listeners.set(_type, [listener]);
            }
            return this;
        }
        checkInputs() {
            if (!this.attached)
                return;
            let frameTime = performance.now() - this.lastCheck;
            this.lastCheck = performance.now();
            const camera = this.camera;
            let listeners = this.listeners.get(EVENT_TYPE.MOUSE);
            if (listeners === null || listeners === void 0 ? void 0 : listeners.length) {
                for (let i = 0; i < listeners.length; ++i) {
                    listeners[i]({ camera });
                }
            }
            listeners = this.listeners.get(EVENT_TYPE.KEY);
            if (listeners === null || listeners === void 0 ? void 0 : listeners.length) {
                let activeKeyAction = new Set();
                for (let [key_action, key_code_set] of this.keyMap.entries()) {
                    if ([...key_code_set].some(k => this.pressed.has(k))) {
                        activeKeyAction.add(key_action);
                    }
                }
                for (let i = 0; i < listeners.length; ++i) {
                    listeners[i]({
                        camera,
                        frameTime,
                        activeKeyAction,
                        _this: this,
                    });
                }
            }
        }
    }
    function processMovementVector({ activeKeyAction, frameTime, camera, _this }) {
        let dir = camera.getForwardRay().direction;
        let normal_dir = new BABYLON.Vector2(dir.x, dir.z).normalize();
        let time_scalar = frameTime * 0.001;
        let z_movement = 0;
        let y_movement = 0;
        let x_movement = 0;
        if (activeKeyAction.has(KEY_ACTION.LEFT)) {
            x_movement -= 1;
        }
        if (activeKeyAction.has(KEY_ACTION.RIGHT)) {
            x_movement += 1;
        }
        if (activeKeyAction.has(KEY_ACTION.FORWARD)) {
            z_movement += 1;
        }
        if (activeKeyAction.has(KEY_ACTION.BACK)) {
            z_movement -= 1;
        }
        let normal_move = new BABYLON.Vector2(x_movement, z_movement).normalize().scale(time_scalar * _this.sensitivity);
        if (activeKeyAction.has(KEY_ACTION.UP)) {
            y_movement += 1;
        }
        if (activeKeyAction.has(KEY_ACTION.DOWN)) {
            y_movement -= 1;
        }
        return new BABYLON.Vector3(normal_move.y * normal_dir.x + normal_move.x * normal_dir.y, y_movement * time_scalar, normal_move.y * normal_dir.y - normal_move.x * normal_dir.x);
    }

    // import GameControl from "./GameControl";
    var engine;
    var scene;
    var canvas;
    var gameScene;
    class Game {
        constructor() {
        }
    }
    function getFps() {
        return engine === null || engine === void 0 ? void 0 : engine.getFps().toFixed(2);
    }
    async function startGame(_canvas) {
        canvas = _canvas;
        engine = new BABYLON.Engine(canvas, true, {
            preserveDrawingBuffer: true, stencil: true
        });
        engine.enableOfflineSupport = false;
        BABYLON.Animation.AllowMatricesInterpolation = true;
        gameScene = GameScene.createScene(engine);
        scene = gameScene.scene;
        let camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0, 0, 0), scene);
        let arcCamera = new BABYLON.ArcRotateCamera("ArcCamera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
        let getGameInput = () => new GameInput(canvas).add("key", obj => {
            var _a, _b, _c;
            let vec = processMovementVector(obj);
            if (vec.x || vec.z) {
                (_a = gameScene.mainCharacter) === null || _a === void 0 ? void 0 : _a.beginWalk();
            }
            else {
                (_b = gameScene.mainCharacter) === null || _b === void 0 ? void 0 : _b.beginIdle();
            }
            let mesh = (_c = gameScene.mainCharacter) === null || _c === void 0 ? void 0 : _c.meshes[0];
            if (mesh) {
                /*
                mesh.applyImpulse();
          
                mesh.position = mesh.position.add(
                    new BABYLON.Vector3(vec.x, 0, vec.z));
                */
                mesh.moveWithCollisions(vec.multiplyByFloats(1.0, 0, 1.0));
                if (usingFreeCamera) {
                    camera.position = mesh.position;
                }
                else {
                    arcCamera.target = mesh.position;
                }
            }
        }).add("dir", ({ camera }) => {
            var _a;
            if (!camera)
                camera = scene.activeCamera;
            let d = camera.getForwardRay().direction;
            let a = (_a = gameScene.mainCharacter) === null || _a === void 0 ? void 0 : _a.meshes[0];
            if (a) {
                a.lookAt(a.position.add(new BABYLON.Vector3(d.x, 0, d.z)));
            }
        });
        let usingFreeCamera = false;
        let useFreeCamera = () => {
            if (usingFreeCamera)
                return;
            arcCamera.detachControl(canvas);
            arcCamera.inputs.removeByType("GameInput");
            scene.activeCamera = camera;
            camera.attachControl(canvas, true);
            camera.inputs.add(getGameInput());
            camera.setTarget(arcCamera.getForwardRay().direction.add(camera.position));
            usingFreeCamera = true;
        };
        let useArcCamera = (force) => {
            var _a;
            if (!usingFreeCamera && !force)
                return;
            camera.detachControl(canvas);
            camera.inputs.removeByType("GameInput");
            scene.activeCamera = arcCamera;
            arcCamera.attachControl(canvas, true);
            (_a = arcCamera.inputs) === null || _a === void 0 ? void 0 : _a.add(getGameInput());
            // arcCamera.position = camera.cameraDirection.scale(-arcCamera.radius);
            // arcCamera.target = camera.position;
            usingFreeCamera = false;
        };
        useArcCamera(true);
        let escape = false;
        canvas.addEventListener("keydown", e => {
            if (e.code === "KeyF") {
                if (usingFreeCamera) ;
                else {
                    // arcCamera.position.addInPlaceFromFloats(0, 1, 0);
                    // arcCamera.setPosition(new BABYLON.Vector3(0, 0, -10));
                    console.log(arcCamera.getTarget());
                }
            }
            if (!escape && e.code === "Escape") {
                escape = true;
                if (usingFreeCamera) {
                    useArcCamera();
                }
                else {
                    useFreeCamera();
                }
            }
        });
        canvas.addEventListener("keyup", e => {
            if (e.code === "Escape") {
                escape = false;
            }
        });
        GameUI.createUI();
        engine.runRenderLoop(function () {
            GameRenderLoop(engine, scene);
        });
        let game = new Game();
        game.engine = engine;
        game.scene = scene;
        game.gameScene = gameScene;
        game.canvas = canvas;
        setGame(game);
    }
    window.addEventListener("resize", function (e) {
        let rect = document.getElementsByTagName("body")[0].getBoundingClientRect();
        if (canvas) {
            canvas.width = rect.width;
            canvas.height = rect.height;
        }
        engine === null || engine === void 0 ? void 0 : engine.resize();
    });

    function waitFor(number, onFinished, options) {
        let total = number;
        let return_values = new Array(number);
        return new Array(number).fill(0).map((_, i) => {
            return (arg) => {
                --total;
                return_values[i] = arg;
                if (!total) {
                    onFinished(...return_values);
                }
            };
        });
    }
    /*

    function test(){
      let [ load1, load2 ] = SCOPE.waitFor(2, (a, b) => {
        console.log("2 tasks finished:", a, b)
      });

      load1(2);
      load2(5);
    }

    function test2(){
      let onAllFinished: CallbackFunction = (a, b, c) => {
        console.log("everyone has finished eating:", a, b, c);
      };
      let [ finish1, finish2, finish3 ] = SCOPE.waitFor(3, onAllFinished);

      finish1("Tom");

      (async () => {
        await new Promise(res => setTimeout(res, 1000));
        finish3();
      })();

      finish2("Peter");
    }

    function test3(){

    }


    test();
    test2();
    test3();

    /*****/

    /* src\App.svelte generated by Svelte v3.24.0 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src\\App.svelte";

    // (79:1) {:else}
    function create_else_block(ctx) {
    	let button;
    	let t1;
    	let h1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let p;
    	let t6;
    	let a;
    	let t8;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Start";
    			t1 = space();
    			h1 = element("h1");
    			t2 = text("Hello ");
    			t3 = text(/*name*/ ctx[0]);
    			t4 = text("!");
    			t5 = space();
    			p = element("p");
    			t6 = text("Visit the ");
    			a = element("a");
    			a.textContent = "Svelte tutorial";
    			t8 = text(" to learn how to build Svelte apps.");
    			add_location(button, file, 79, 2, 2222);
    			attr_dev(h1, "class", "svelte-w6s1zu");
    			add_location(h1, file, 80, 2, 2279);
    			attr_dev(a, "href", "https://svelte.dev/tutorial");
    			add_location(a, file, 81, 17, 2319);
    			add_location(p, file, 81, 4, 2306);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(h1, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t6);
    			append_dev(p, a);
    			append_dev(p, t8);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 1) set_data_dev(t3, /*name*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(p);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(79:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (74:2) {#if started}
    function create_if_block(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let canvas;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(/*fps*/ ctx[2]);
    			t1 = space();
    			canvas = element("canvas");
    			attr_dev(div, "class", "fps-box svelte-w6s1zu");
    			add_location(div, file, 74, 4, 2067);
    			attr_dev(canvas, "id", "renderCanvas");
    			attr_dev(canvas, "touch-action", "none");
    			attr_dev(canvas, "class", "svelte-w6s1zu");
    			add_location(canvas, file, 75, 4, 2104);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, canvas, anchor);
    			/*canvas_binding*/ ctx[4](canvas);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*fps*/ 4) set_data_dev(t0, /*fps*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(canvas);
    			/*canvas_binding*/ ctx[4](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(74:2) {#if started}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let t;
    	let main;

    	function select_block_type(ctx, dirty) {
    		if (/*started*/ ctx[1]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			t = space();
    			main = element("main");
    			if_block.c();
    			attr_dev(main, "class", "svelte-w6s1zu");
    			add_location(main, file, 72, 0, 2040);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);
    			if_block.m(main, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(main, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
    			if_block.d();
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

    const BABYLON_BASE = "https://preview.babylonjs.com";

    function instance($$self, $$props, $$invalidate) {
    	let { name } = $$props;

    	const BABYLON_SCRIPT = [
    		"https://code.jquery.com/pep/0.4.2/pep.min.js",
    		"https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.2/dat.gui.min.js",
    		`${BABYLON_BASE}/ammo.js`,
    		`${BABYLON_BASE}/cannon.js`,
    		`${BABYLON_BASE}/Oimo.js`,
    		`${BABYLON_BASE}/libktx.js`,
    		`${BABYLON_BASE}/earcut.min.js`,
    		`${BABYLON_BASE}/babylon.js`,
    		`${BABYLON_BASE}/inspector/babylon.inspector.bundle.js`,
    		`${BABYLON_BASE}/materialsLibrary/babylonjs.materials.min.js`,
    		`${BABYLON_BASE}/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js`,
    		`${BABYLON_BASE}/postProcessesLibrary/babylonjs.postProcess.min.js`,
    		`${BABYLON_BASE}/loaders/babylonjs.loaders.js`,
    		`${BABYLON_BASE}/serializers/babylonjs.serializers.min.js`,
    		`${BABYLON_BASE}/gui/babylon.gui.min.js`
    	];

    	let started = true;
    	let fps = "";

    	setInterval(
    		() => {
    			$$invalidate(2, fps = getFps());
    		},
    		500
    	);

    	let [loadCanvas, ...babylonLoaded] = waitFor(BABYLON_SCRIPT.length + 1, (canvas, _, _1, gui) => {
    		console.log("all resource loaded, starting game");
    		console.log(gui);
    		startGame(canvas);
    	});

    	let canvasContainer = Object.defineProperty({}, "canvas", {
    		set(value) {
    			loadCanvas(value);
    		}
    	});

    	const BABYLON_LOADER = BABYLON_SCRIPT.map((url, i) => [url, babylonLoaded[i]]);

    	(async () => {
    		function injectScript(src, onload) {
    			let head = document.getElementsByTagName("head")[0];
    			let script = document.createElement("script");
    			script.src = src;
    			script.onload = onload;
    			head.appendChild(script);
    		}

    		for (var i = 0; i < BABYLON_LOADER.length; ++i) {
    			await new Promise(res => {
    					let [src, onload] = BABYLON_LOADER[i];

    					injectScript(src, () => {
    						onload();
    						res();
    					});
    				});
    		}
    	})();

    	const writable_props = ["name"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	function canvas_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			canvasContainer.canvas = $$value;
    			$$invalidate(3, canvasContainer);
    		});
    	}

    	const click_handler = () => $$invalidate(1, started = true);

    	$$self.$set = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		startGame,
    		getFps,
    		waitFor,
    		name,
    		BABYLON_BASE,
    		BABYLON_SCRIPT,
    		started,
    		fps,
    		loadCanvas,
    		babylonLoaded,
    		canvasContainer,
    		BABYLON_LOADER
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("started" in $$props) $$invalidate(1, started = $$props.started);
    		if ("fps" in $$props) $$invalidate(2, fps = $$props.fps);
    		if ("loadCanvas" in $$props) loadCanvas = $$props.loadCanvas;
    		if ("babylonLoaded" in $$props) babylonLoaded = $$props.babylonLoaded;
    		if ("canvasContainer" in $$props) $$invalidate(3, canvasContainer = $$props.canvasContainer);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, started, fps, canvasContainer, canvas_binding, click_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console_1.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'World'
        }
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
