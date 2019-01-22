import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import {timeOut, } from '@polymer/polymer/lib/utils/async.js';
import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

/*
class FabricElement extends PolymerElement {
  fire(eventName, detail) {
	this.dispatchEvent(new CustomEvent('toggle-drawer', {detail: detail || {} }));
  }
}
*/

var FabricElement = (superClass) => class extends superClass{
	static registerClass(){
		customElements.define(this.is, this);
	}
	static setCss(el, css){
		var s = el && el.style;
		if(!s)
			return false;
		for(name in css){
			if(css.hasOwnProperty(name)){
				s[this.camelCase(name)] = css[name];
			}
		}
	}

	static camelCase(n){
		if(n.indexOf("-") < 0)
			return n;
		n = n.toLowerCase().split("-");
		var str = n[0];
		for(var i=1, l=n.length; i<l; i++){
			str += this.ucFirst(n[i])
		}

		return str;
	}

	static ucFirst(s){
		if(!s)
			return "";

		return s[0].toUpperCase()+s.substr(1);
	}

	/**
     * Dispatches a custom event with an optional detail value.
     *
     * @param {string} type Name of event type.
     * @param {*=} detail Detail value containing event-specific
     *   payload.
     * @param {{ bubbles: (boolean|undefined), cancelable: (boolean|undefined), composed: (boolean|undefined) }=}
     *  options Object specifying options.  These may include:
     *  `bubbles` (boolean, defaults to `true`),
     *  `cancelable` (boolean, defaults to false), and
     *  `node` on which to fire the event (HTMLElement, defaults to `this`).
     * @return {!Event} The new event that was fired.
     */
    fire(type, detail, options) {
      options = options || {};
      detail = (detail === null || detail === undefined) ? {} : detail;
      let event = new Event(type, {
        bubbles: options.bubbles === undefined ? true : options.bubbles,
        cancelable: Boolean(options.cancelable),
        composed: options.composed === undefined ? true: options.composed
      });
      event.detail = detail;
      let node = options.node || this;
      node.dispatchEvent(event);
      return event;
    }

	fireCustomEvent(eventName, detail) {
		this.dispatchEvent(new CustomEvent(eventName, {detail: detail || {} }));
	}

	$$(slctr) {
      return this.root.querySelector(slctr);
    }

	toggleClass(cls, toggle, el){
		(el || this).classList.toggle(cls, toggle);
	}

	async(fn, delay){
		return {
			handle: window.setTimeout(fn, delay||1),
			cancel(){
				window.clearTimeout(this.handle);
			}
	    }
	}
	log(...args){
		args.unshift(this.constructor.is+"::");
		console.log.apply(console, args);
	}

}

export {PolymerElement, html, FabricElement};
