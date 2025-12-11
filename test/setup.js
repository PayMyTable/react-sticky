require("@babel/register")();

const { JSDOM } = require("jsdom");

const dom = new JSDOM("", { url: "http://localhost" });
global.window = dom.window;
global.document = dom.window.document;

// Copier toutes les propriétés (y compris non-énumérables)
Object.getOwnPropertyNames(dom.window).forEach(property => {
  if (typeof global[property] === "undefined") {
    global[property] = dom.window[property];
  }
});

// Exposer `Event` globalement (utilisé dans les tests)
global.Event = dom.window.Event;

// Rendre certaines propriétés de layout modifiables sur HTMLElement.prototype
const proto = dom.window.HTMLElement.prototype;

function defineWritableProp(name, defaultValue = 0) {
  const privateName = `_${name}`;
  Object.defineProperty(proto, name, {
    configurable: true,
    get() {
      return this[privateName] !== undefined ? this[privateName] : defaultValue;
    },
    set(value) {
      this[privateName] = value;
    }
  });
}

defineWritableProp("scrollHeight", 0);
defineWritableProp("offsetTop", 0);
defineWritableProp("offsetHeight", 0);
defineWritableProp("offsetWidth", 0);

// offsetParent gère un objet plutôt qu'une valeur numérique
Object.defineProperty(proto, "offsetParent", {
  configurable: true,
  get() {
    return this._offsetParent || null;
  },
  set(value) {
    this._offsetParent = value;
  }
});

global.navigator = {
  userAgent: "node.js"
};

documentRef = global.document;

const mount = global.document.createElement("div");
mount.id = "mount";
global.document.body.appendChild(mount);
