import "@polymer/paper-styles/element-styles/paper-material-styles.js";
import "@polymer/iron-dropdown/iron-dropdown.js";
import '@polymer/neon-animation/neon-animations.js';
import {FabricElement, PolymerElement, html} from './fabric-element.js';

class FabricOverlayField extends FabricElement(PolymerElement) {
	static get is() { return 'fabric-overlay-field' }
	static get properties() {
	  	return {
			verticalAlign: String,
			horizontalAlign: String,
			verticalOffset:{type:Number, value:10},
			horizontalOffset:{type:Number, value:0},
			disabled: Boolean,
			openAnimationConfig: {
				type: Array,
				value: function() {
					return [{
						name: 'fade-in-animation',
						timing: {
							delay: 150,
							duration: 50
						}
					},{
						name: 'scale-up-animation',
						transformOrigin: "top",
						axis: "y",
						timing: {
							delay: 150,
							duration: 100
						}
					}];
				}
			},

			closeAnimationConfig: {
				type: Array,
				value: function() {
					return [{
						name: 'scale-down-animation',
						axis: "y",
						timing: {
							duration: 200
						}
					}];
				}
			}
		}
	}

	static get template() {
    	return html`
			<style include="fabric-style paper-material-styles">
				:host {display:inline-block;position:relative;padding-bottom:2px;@apply --fabric-overlay-field;}
				:host([block]){display: block;}
				.tigger{min-height: 20px; min-width: 30px; cursor: pointer;
					@apply --fabric-overlay-field-tigger;
				}
				.tigger[disabled]{cursor:default;}
				#dropdown{display:block;}
				#dropdown .dropdown-content{
					background:#FFF;max-width:none !important;
					max-height: 200px !important;
					@apply --paper-material-elevation-3;
				}
			</style>
			<div class="tigger" on-tap="open" id="trigger" disabled$="[[disabled]]">
				<slot name="dropdown-trigger"></slot>
			</div>
			<iron-dropdown id="dropdown"
				vertical-align="[[verticalAlign]]"
				horizontal-align="[[horizontalAlign]]"
				vertical-offset="[[verticalOffset]]"
				horizontal-offset="[[horizontalOffset]]"
				disabled="[[disabled]]"
				open-animation-config="[[openAnimationConfig]]"
				close-animation-config="[[closeAnimationConfig]]"
				>
				<div class="dropdown-content" slot="dropdown-content">
					<slot name="dropdown-content"></slot>
				</div>
			</iron-dropdown>
		`;
	}

	attached(){
		this.verticalOffset = this.getBoundingClientRect().height;
		var closeEls = this.$.dropdown.querySelectorAll("[close]");
		_.each(closeEls, (el)=>{
			this.listen(el, "click", "close")
		});
	}

	close(){
		this.$.dropdown.close();
	}

	open(){
		this.verticalOffset = this.getBoundingClientRect().height;
		this.adjustPosition();
		this.$.dropdown.open();
	}

	adjustPosition(){
		this.constructor.setCss(this.$.dropdown, {
			visibility: "hidden",
			display: "block",
			marginLeft: -1000,
			minHeight: 1
		});
		var dc = this.$.dropdown.querySelector(".dropdown-content");
		var dropdownBox = dc.getBoundingClientRect();
		var maxRight = window.innerWidth;
		/*
		var right = this.$.dropdown.getBoundingClientRect().left + dropdownBox.width;
		if (right > maxRight -10)
			this.$.dropdown.horizontalOffset = maxRight - right - 10;
		else
			this.$.dropdown.horizontalOffset = this.horizontalOffset;
		*/
		
		this.constructor.setCss(this.$.dropdown, {
			marginLeft: 0,
			visibility: "visible",
			display: "none"
		});
	}
}

customElements.define(FabricOverlayField.is, FabricOverlayField);
