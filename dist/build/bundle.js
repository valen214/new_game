var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function s(e){e.forEach(t)}function i(e){return"function"==typeof e}function a(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function r(e,t){e.appendChild(t)}function o(e,t,n){e.insertBefore(t,n||null)}function h(e){e.parentNode.removeChild(e)}function c(e){return document.createElement(e)}function l(e){return document.createTextNode(e)}function d(){return l(" ")}function u(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function m(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}let p;function g(e){p=e}const f=[],B=[],w=[],A=[],y=Promise.resolve();let v=!1;function L(e){w.push(e)}let O=!1;const C=new Set;function N(){if(!O){O=!0;do{for(let e=0;e<f.length;e+=1){const t=f[e];g(t),b(t.$$)}for(f.length=0;B.length;)B.pop()();for(let e=0;e<w.length;e+=1){const t=w[e];C.has(t)||(C.add(t),t())}w.length=0}while(f.length);for(;A.length;)A.pop()();v=!1,O=!1,C.clear()}}function b(e){if(null!==e.fragment){e.update(),s(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(L)}}const E=new Set;function I(e,t){-1===e.$$.dirty[0]&&(f.push(e),v||(v=!0,y.then(N)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function R(a,r,o,c,l,d,u=[-1]){const m=p;g(a);const f=r.props||{},B=a.$$={fragment:null,ctx:null,props:d,update:e,not_equal:l,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(m?m.$$.context:[]),callbacks:n(),dirty:u};let w=!1;if(B.ctx=o?o(a,f,(e,t,...n)=>{const s=n.length?n[0]:t;return B.ctx&&l(B.ctx[e],B.ctx[e]=s)&&(B.bound[e]&&B.bound[e](s),w&&I(a,e)),t}):[],B.update(),w=!0,s(B.before_update),B.fragment=!!c&&c(B.ctx),r.target){if(r.hydrate){const e=function(e){return Array.from(e.childNodes)}(r.target);B.fragment&&B.fragment.l(e),e.forEach(h)}else B.fragment&&B.fragment.c();r.intro&&((A=a.$$.fragment)&&A.i&&(E.delete(A),A.i(y))),function(e,n,a){const{fragment:r,on_mount:o,on_destroy:h,after_update:c}=e.$$;r&&r.m(n,a),L(()=>{const n=o.map(t).filter(i);h?h.push(...n):s(n),e.$$.on_mount=[]}),c.forEach(L)}(a,r.target,r.anchor),N()}var A,y;g(m)}class Y{static createUI(){let e=BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");Y.info_text=new BABYLON.GUI.TextBlock("info_text",""),Object.assign(Y.info_text,{horizontalAlignment:BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,verticalAlignment:BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,left:.1,top:.1,width:.3,height:"40px",fontSize:24,color:"white"}),e.addControl(Y.info_text);var t=function(){var t=new BABYLON.GUI.Rectangle;return t.width=.2,t.height="40px",t.cornerRadius=20,t.color="white",t.thickness=4,t.background="green",e.addControl(t),t},n=new BABYLON.GUI.TextBlock("info_text","HELLO WORLD");Object.assign(n,{horizontalAlignment:BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,verticalAlignment:BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,left:.1,top:.1,width:.3,height:"40px",fontSize:24,color:"white"}),e.addControl(n),t().horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,t().horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT}}const k=new Map;var T,S,P,x,_,K;function D(e){T=e,k.set("game",T)}Object.defineProperty(window,"GLOBAL",{get:()=>k}),Object.defineProperty(window,"game",{get:()=>T});class G{constructor(e,t,n,s){this.code=e,this.keyCode=t,this.key=n,this.which=s,[e,t,n,s].filter(e=>!!e).forEach(e=>{G.TO_KEYCODE.set(e,this)})}static getUnknownKeyCode(e){let t=[e.code,e.keyCode,e.key,e.which];for(let e of t)if(G.TO_KEYCODE.has(e))return console.warn("KeyCode.ts: getUnknownKeyCode():",`KeyCode(${e}) is found,`,"please use toKeyCode()"),G.TO_KEYCODE.get(e);return new G(e.code,e.keyCode,e.key,e.which)}}function U(e){return G.TO_KEYCODE.get(e.code)||G.TO_KEYCODE.get(e.keyCode)||G.TO_KEYCODE.get(e.key)||G.TO_KEYCODE.get(e.which)||G.getUnknownKeyCode(e)}G.TO_KEYCODE=new Map,G.A=new G("KeyA",63),G.S=new G("KeyS",83,"s"),G.D=new G("KeyD"),G.W=new G("KeyW"),G.RSHIFT=new G("ShiftRight",16,"Shift"),G.LSHIFT=new G("ShiftLeft",16,"Shift"),G.LCTRL=new G("ControlLeft",17,"Control"),G.SPACE=new G("Space",32," "),function(e){e[e.LEFT=0]="LEFT",e[e.RIGHT=1]="RIGHT",e[e.FORWARD=2]="FORWARD",e[e.BACK=3]="BACK",e[e.DOWN=4]="DOWN",e[e.UP=5]="UP"}(S||(S={})),function(e){e.KEY="key",e.MOUSE="mouse"}(P||(P={}));class M{constructor(e,t){this.canvas=e,this.processMovement=t,this.listeners=new Map,this.pressed=new Set,this.keyMap=new Map([[S.LEFT,new Set([G.A])],[S.RIGHT,new Set([G.D])],[S.FORWARD,new Set([G.W])],[S.BACK,new Set([G.S])],[S.DOWN,new Set([G.LCTRL])],[S.UP,new Set([G.SPACE])]]),this.attached=!1,this.detached=!1,this.sensitivity=5,this.onKeyDown=e=>{let t=U(e);t&&this.pressed.add(t),this.attached&&!this.noPreventDefault&&e.preventDefault()},this.onKeyUp=e=>{let t=U(e);this.pressed.delete(t),this.attached&&!this.noPreventDefault&&e.preventDefault()},this.onBlur=()=>{this.pressed.clear()},this.lastCheck=performance.now()}registerActionManager(e){let t=new BABYLON.ActionManager(e);return e.actionManager=t,t.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger,e=>this.onKeyDown(e.sourceEvent))),t.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger,e=>this.onKeyUp(e.sourceEvent))),e.onBeforeRenderObservable.add((e,t)=>{this.checkInputs()}),this}getClassName(){return"GameInput"}getTypeName(){return"GameInput"}getSimpleName(){return"GameInput"}attachControl(e,t){console.assert(e===this.canvas,"GameInput.ts:","attachControl():","attached canvas is different from given canvas","\n\telem:",e,"\n\tthis.canvas:",this.canvas),this.attached||(this.attached=!0,this.noPreventDefault=t,e.tabIndex=1,e.addEventListener("keydown",this.onKeyDown,!1),e.addEventListener("keyup",this.onKeyUp,!1),this.checkInputs(),BABYLON.Tools.RegisterTopRootEvents(this.canvas,[{name:"blur",handler:this.onBlur}]))}detachControl(e){this.attached&&(e.removeEventListener("keydown",this.onKeyDown),e.removeEventListener("keyup",this.onKeyUp),BABYLON.Tools.UnregisterTopRootEvents(this.canvas,[{name:"blur",handler:this.onBlur}]),this.listeners.clear(),this.pressed.clear(),this.attached=!1)}add(e,t){let n;switch(e){case"dir":n=P.MOUSE;break;case"key":n=P.KEY;break;default:throw e in P&&(n=e),new Error("unknown input event type "+e)}let s=this.listeners.get(n);return s?s.push(t):this.listeners.set(n,[t]),this}checkInputs(){if(!this.attached)return;let e=performance.now()-this.lastCheck;this.lastCheck=performance.now();const t=this.camera;let n=this.listeners.get(P.MOUSE);if(null==n?void 0:n.length)for(let e=0;e<n.length;++e)n[e]({camera:t});if(n=this.listeners.get(P.KEY),null==n?void 0:n.length){let s=new Set;for(let[e,t]of this.keyMap.entries())[...t].some(e=>this.pressed.has(e))&&s.add(e);for(let i=0;i<n.length;++i)n[i]({camera:t,frameTime:e,activeKeyAction:s,_this:this})}}}!function(e){e[e.IDLE=0]="IDLE",e[e.WALK=1]="WALK",e[e.RUN=2]="RUN"}(x||(x={}));class j{constructor(e){this.scene=e,this.meshes=j.meshes,this.skeletons=j.skeletons;var t=this.skeletons[0];t.animationPropertiesOverride=new BABYLON.AnimationPropertiesOverride,t.animationPropertiesOverride.enableBlending=!0,t.animationPropertiesOverride.blendingSpeed=.05,t.animationPropertiesOverride.loopMode=1,this.idleRange=t.getAnimationRange("YBot_Idle"),this.walkRange=t.getAnimationRange("YBot_Walk"),this.runRange=t.getAnimationRange("YBot_Run");t.getAnimationRange("YBot_LeftStrafeWalk"),t.getAnimationRange("YBot_RightStrafeWalk");this.beginIdle(),window.a=this.scene,window.b=this.skeletons,window.c=this}beginIdle(){this.idleRange&&this.state!==x.IDLE&&(this.state=x.IDLE,this.scene.beginAnimation(this.skeletons[0],this.idleRange.from,this.idleRange.to,!0))}beginWalk(){this.walkRange&&this.state!==x.WALK&&(this.state=x.WALK,this.scene.beginAnimation(this.skeletons[0],this.walkRange.from,this.walkRange.to,!0))}beginRun(){this.runRange&&this.state!==x.RUN&&(this.state=x.RUN,this.scene.beginAnimation(this.skeletons[0],this.runRange.from,this.runRange.to,!0))}addShadow(e){e.addShadowCaster(this.scene.meshes[0],!0);for(var t=0;t<this.meshes.length;t++)this.meshes[t].receiveShadows=!1;return this}static async createHuman(e){return j.imported||await BABYLON.SceneLoader.ImportMeshAsync("","./assets/","dummy3.babylon",e).then(({meshes:e,particleSystems:t,skeletons:n})=>{j.meshes=e,j.skeletons=n}),new j(e)}}j.imported=!1,function(e){e[e.IDLE=0]="IDLE",e[e.WALK=1]="WALK",e[e.RUN=2]="RUN"}(_||(_={}));class F{constructor(e){this.scene=e,this.meshes=F.meshes,this.skeletons=F.skeletons;var t=this.skeletons[0];t.animationPropertiesOverride=new BABYLON.AnimationPropertiesOverride,t.animationPropertiesOverride.enableBlending=!0,t.animationPropertiesOverride.blendingSpeed=.05,t.animationPropertiesOverride.loopMode=1,this.idleRange=t.getAnimationRange("YBot_Idle"),this.walkRange=t.getAnimationRange("walk"),this.runRange=t.getAnimationRange("YBot_Run");t.getAnimationRange("YBot_LeftStrafeWalk"),t.getAnimationRange("YBot_RightStrafeWalk");console.log(this),setTimeout(()=>{},1e3),t.createAnimationRange("startWalk",0,1),t.createAnimationRange("walk",1,3),this.beginWalk()}beginIdle(){if(this.idleRange&&this.state!==_.IDLE){this.state=_.IDLE;let e=F.animationGroups[0];e.stop(),e.goToFrame(0)}}beginWalk(){if(this.state!==_.WALK){this.state=_.WALK;let e=F.animationGroups[0];e.stop(),e.start(!1,1,0,1),new Promise(t=>{e.onAnimationEndObservable.addOnce(t)}).then(()=>{e.start(!0,2,1,4)})}}addShadow(e){e.addShadowCaster(this.scene.meshes[0],!0);for(var t=0;t<this.meshes.length;t++)this.meshes[t].receiveShadows=!1;return this}static async createHumanoid(e){return F.imported||await BABYLON.SceneLoader.ImportMeshAsync("","./assets/","humanoid.glb",e).then(({meshes:e,particleSystems:t,skeletons:n,animationGroups:s})=>{F.meshes=e,F.skeletons=n,F.animationGroups=s,console.log(s)}),new F(e)}}F.imported=!1;class W{constructor(e,t){this.usingFirstPersonCamera=null,this.scene=e,this.canvas=t,this.universalCamera=new BABYLON.UniversalCamera("PlayerUniversalCamera",new BABYLON.Vector3(0,0,0),e),this.arcCamera=new BABYLON.ArcRotateCamera("PlayerArcCamera",0,0,10,BABYLON.Vector3.Zero(),e),this.arcCamera.zoomOnFactor=.01,this.arcCamera.lowerRadiusLimit=.01,this.arcCamera.wheelPrecision=50}setTarget(e){return this.target=e,e instanceof BABYLON.Mesh&&(this.universalCamera.position=e.position),this}useFirstPersonCamera(){this.usingFirstPersonCamera||(this.arcCamera.detachControl(this.canvas),this.arcCamera.inputs.removeByType("GameInput"),this.scene.activeCamera=this.universalCamera,this.universalCamera.attachControl(this.canvas,!0),this.universalCamera.inputs.add(this.getGameInput()),this.universalCamera.setTarget(this.arcCamera.getForwardRay().direction.add(this.universalCamera.position)),this.usingFirstPersonCamera=!0)}useThirdPersonCamera(){var e;!1!==this.usingFirstPersonCamera&&(this.universalCamera.detachControl(this.canvas),this.universalCamera.inputs.removeByType("GameInput"),this.scene.activeCamera=this.arcCamera,this.arcCamera.attachControl(this.canvas,!0),null===(e=this.arcCamera.inputs)||void 0===e||e.add(this.getGameInput()),this.usingFirstPersonCamera=!1)}getGameInput(){return new M(this.canvas).add("key",e=>{var t,n;let s=function({activeKeyAction:e,frameTime:t,camera:n,_this:s}){let i=n.getForwardRay().direction,a=new BABYLON.Vector2(i.x,i.z).normalize(),r=.001*t,o=0,h=0,c=0;e.has(S.LEFT)&&(c-=1),e.has(S.RIGHT)&&(c+=1),e.has(S.FORWARD)&&(o+=1),e.has(S.BACK)&&(o-=1);let l=new BABYLON.Vector2(c,o).normalize().scale(r*s.sensitivity);return e.has(S.UP)&&(h+=1),e.has(S.DOWN)&&(h-=1),new BABYLON.Vector3(l.y*a.x+l.x*a.y,h*r,l.y*a.y-l.x*a.x)}(e);s.x||s.z?(this.target instanceof j||this.target instanceof F)&&this.target.beginWalk():this.target instanceof j&&this.target.beginIdle();let i=(null===(t=this.target)||void 0===t?void 0:t.meshes)&&(null===(n=this.target)||void 0===n?void 0:n.meshes[0]);i&&(i.moveWithCollisions(s.multiplyByFloats(1,0,1)),this.usingFirstPersonCamera?this.universalCamera.position=i.position:this.arcCamera.target=i.position)}).add("dir",({camera:e})=>{var t,n;e||(e=this.scene.activeCamera);let s=e.getForwardRay().direction,i=(null===(t=this.target)||void 0===t?void 0:t.meshes)&&(null===(n=this.target)||void 0===n?void 0:n.meshes[0]);i instanceof BABYLON.Mesh&&i.lookAt(i.position.add(new BABYLON.Vector3(s.x,0,s.z)))})}}!function(e){e.createBox=function(e,{name:t,height:n=1,width:s=1,pos:i=[0,0,0],physics:a=null}){var r=BABYLON.MeshBuilder.CreateBox(t,{height:n,width:s},e);if(r.position.set(i[0],i[1],i[2]),a){let t=a.type;null==t&&(t=BABYLON.PhysicsImpostor.BoxImpostor),r.physicsImpostor=new BABYLON.PhysicsImpostor(r,t,a,e)}return r},e.createSphere=function(e,{name:t,diameter:n=1,pos:s=[0,0,0],physics:i=null}){var a=BABYLON.MeshBuilder.CreateSphere(t,{diameter:n},e);if(a.position.set(s[0],s[1],s[2]),i){let t=i.type;null==t&&(t=BABYLON.PhysicsImpostor.SphereImpostor),a.physicsImpostor=new BABYLON.PhysicsImpostor(a,t,i,e)}return a}}(K||(K={}));var $,z,H,V=K;class Z extends BABYLON.Scene{constructor(e,t){super(e,t),this.load(),this.getEngine(),BABYLON.SceneLoader}load(){const e=this.getEngine().getRenderingCanvas();this.gravity=new BABYLON.Vector3(0,-9.81,0),this.collisionsEnabled=!0,this.enablePhysics(this.gravity,new BABYLON.AmmoJSPlugin),V.createBox(this,{name:"box1"}),F.createHumanoid(this);new BABYLON.HemisphericLight("hemispheric light 1",new BABYLON.Vector3(1,1,0),this);var t=new BABYLON.DirectionalLight("directional light 1",new BABYLON.Vector3(0,-.5,-1),this);t.position=new BABYLON.Vector3(0,5,5);var n=new BABYLON.ShadowGenerator(1024,t);n.useBlurExponentialShadowMap=!0,n.blurKernel=32;const s=new W(this,e);this.player=s,j.createHuman(this).then(e=>{e.addShadow(n),console.log("HUMAN:",e),k.set("human",e),s.setTarget(e).useThirdPersonCamera()}).then(()=>{let t=!1;e.addEventListener("keydown",e=>{e.code,t||"Escape"!==e.code||(t=!0,s.usingFirstPersonCamera?s.useThirdPersonCamera():s.useFirstPersonCamera())}),e.addEventListener("keyup",e=>{"Escape"===e.code&&(t=!1)})});var i=this.createDefaultEnvironment({enableGroundShadow:!0});i.setMainColor(BABYLON.Color3.Gray()),i.ground.position.y+=.01;V.createSphere(this,{name:"sphere",diameter:2,physics:{type:BABYLON.PhysicsImpostor.CylinderImpostor,mass:10,friction:1,restitution:0}});var a=BABYLON.MeshBuilder.CreateGround("ground",{height:20,width:20},this);a.position.set(0,-5,0),a.physicsImpostor=new BABYLON.PhysicsImpostor(a,BABYLON.PhysicsImpostor.BoxImpostor,{mass:0,friction:.5,restitution:.7},this)}}class q{constructor(){}}async function J(e){H=e,($=new BABYLON.Engine(H,!0,{preserveDrawingBuffer:!0,stencil:!0})).enableOfflineSupport=!1,BABYLON.Animation.AllowMatricesInterpolation=!0,z=new Z($),Y.createUI(),$.runRenderLoop((function(){!function(e,t){t.activeCamera,t.render(),Y.info_text.text=t.getMeshByName("sphere").position.asArray().map((e,t)=>`${"xyz"[t]}: ${e.toFixed(2)}`).join(", ")}(0,z)}));let t=new q;t.engine=$,t.scene=z,t.canvas=H,D(t)}function Q(e,t){let n=document.getElementsByTagName("head")[0],s=document.createElement("script");s.src=e,s.onload=t,n.appendChild(s)}window.addEventListener("resize",(function(e){let t=document.getElementsByTagName("body")[0].getBoundingClientRect();H&&(H.width=t.width,H.height=t.height),null==$||$.resize()}));const X="https://preview.babylonjs.com",ee=["https://code.jquery.com/pep/0.4.2/pep.min.js","https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.2/dat.gui.min.js",X+"/ammo.js",X+"/cannon.js",X+"/Oimo.js",X+"/libktx.js",X+"/earcut.min.js"],te=[X+"/inspector/babylon.inspector.bundle.js",X+"/materialsLibrary/babylonjs.materials.min.js",X+"/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js",X+"/postProcessesLibrary/babylonjs.postProcess.min.js",X+"/loaders/babylonjs.loaders.js",X+"/serializers/babylonjs.serializers.min.js",X+"/gui/babylon.gui.min.js"],ne=(async()=>{let e=ee.map(e=>new Promise(t=>Q(e,t)));await new Promise(e=>Q("https://preview.babylonjs.com/babylon.js",e));let t=te.map(e=>new Promise(t=>Q(e,t)));await Promise.all([...e,...t])})();function se(e){let t,n,s,i,a,p,g,f,B,w;return{c(){t=c("button"),t.textContent="Start",n=d(),s=c("h1"),i=l("Hello "),a=l(e[0]),p=l("!"),g=d(),f=c("p"),f.innerHTML='Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.',u(s,"class","svelte-w6s1zu")},m(h,c){var l,d,u,m;o(h,t,c),o(h,n,c),o(h,s,c),r(s,i),r(s,a),r(s,p),o(h,g,c),o(h,f,c),B||(l=t,d="click",u=e[5],l.addEventListener(d,u,m),w=()=>l.removeEventListener(d,u,m),B=!0)},p(e,t){1&t&&m(a,e[0])},d(e){e&&h(t),e&&h(n),e&&h(s),e&&h(g),e&&h(f),B=!1,w()}}}function ie(e){let t,n,s,i;return{c(){t=c("div"),n=l(e[2]),s=d(),i=c("canvas"),u(t,"class","fps-box svelte-w6s1zu"),u(i,"id","renderCanvas"),u(i,"touch-action","none"),u(i,"class","svelte-w6s1zu")},m(a,h){o(a,t,h),r(t,n),o(a,s,h),o(a,i,h),e[4](i)},p(e,t){4&t&&m(n,e[2])},d(n){n&&h(t),n&&h(s),n&&h(i),e[4](null)}}}function ae(t){let n;function s(e,t){return e[1]?ie:se}let i=s(t),a=i(t);return{c(){n=c("main"),a.c(),u(n,"class","svelte-w6s1zu")},m(e,t){o(e,n,t),a.m(n,null)},p(e,[t]){i===(i=s(e))&&a?a.p(e,t):(a.d(1),a=i(e),a&&(a.c(),a.m(n,null)))},i:e,o:e,d(e){e&&h(n),a.d()}}}function re(e,t,n){let{name:s}=t,i=!0,a="";setInterval(()=>{n(2,a=null==$?void 0:$.getFps().toFixed(2))},500);let r=Object.defineProperty({},"canvas",{async set(e){await ne,console.log("all resource loaded, starting game"),J(e)}});return e.$set=e=>{"name"in e&&n(0,s=e.name)},[s,i,a,r,function(e){B[e?"unshift":"push"](()=>{r.canvas=e,n(3,r)})},()=>n(1,i=!0)]}return new class extends class{$destroy(){!function(e,t){const n=e.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(){}}{constructor(e){super(),R(this,e,re,ae,a,{name:0})}}({target:document.body,props:{name:"World"}})}();
//# sourceMappingURL=bundle.js.map
