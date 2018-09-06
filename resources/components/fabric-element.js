import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

/*
class FabricElement extends PolymerElement {
  fire(eventName, detail) {
	this.dispatchEvent(new CustomEvent('toggle-drawer', {detail: detail || {} }));
  }
}
*/

var FabricElement = (superClass) => class extends superClass{

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

	fire(eventName, detail) {
		this.dispatchEvent(new CustomEvent('toggle-drawer', {detail: detail || {} }));
	}

	toggleClass(cls, toggle, el){
		(el || this).classList.toggle(cls, toggle);
	}

}

export {PolymerElement, html, FabricElement};
