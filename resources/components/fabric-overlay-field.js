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
			adjustRightEdge:Boolean,
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
				:host{display:inline-block;position:relative;padding-bottom:2px;@apply --fabric-overlay-field}
				:host([block]){display: block;}
				.tigger{
					min-height: 20px;
					min-width: 30px;
					cursor: pointer;
					@apply --layout-horizontal;
					@apply --fabric-overlay-field-tigger;
				}
				.tigger[disabled]{cursor:default;}
				.spinner-slot{cursor: default;}
				#dropdown{display:block;}
				#dropdown .dropdown-content{
					background:#FFF;max-width:none !important;
					max-height: 200px !important;
					@apply --paper-material-elevation-3;
					@apply --fabric-overlay-field-dropdown-content;
				}
			</style>
			<div class="tigger"  id="trigger" disabled$="[[disabled]]">
				<slot name="spinner-slot" class="spinner-slot"></slot>
				<slot name="dropdown-trigger" on-tap="open"></slot>
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

		if(this.adjustRightEdge){
			var maxRight = window.innerWidth-20;
			var right = this.$.dropdown.getBoundingClientRect().left +
				dropdownBox.width - this.$.dropdown.horizontalOffset;
			//console.log("right:"+right, "maxRight:"+maxRight+", (maxRight - right):"+(maxRight - right))
			if (right > maxRight || right == maxRight)
				this.$.dropdown.horizontalOffset = maxRight - right;
			else
				this.$.dropdown.horizontalOffset = this.horizontalOffset;
		}
		
		
		this.constructor.setCss(this.$.dropdown, {
			marginLeft: 0,
			visibility: "visible",
			display: "none"
		});
	}
}

customElements.define(FabricOverlayField.is, FabricOverlayField);
