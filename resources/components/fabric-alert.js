import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dialog/paper-dialog.js';
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/paper-item/paper-item.js";


window.Fabric = window.Fabric || {};
//placeholder utill real component ready to call
window.Fabric._alert = {
	set: function(key, data){
		this[key] = data;
	},
	open: function(){
		this.isCalled = true;
	}
}
window.Fabric.Prompt = function(args, callback){
	var data = Object.assign({
		text: '',
		okBtn: 'OK',
		closeBtn: 'CLOSE',
		closeBtnCls: "",
		okBtnCls: "success",
		cls: "",
		fieldType: 'text',
		fieldItems: [],
		required: true,
		isprompt: true,
		hasCloseBtn: true,
		callback: callback
	}, args);
	this._alert.set('data', data);
	this._alert.open();
};
window.Fabric.Alert = function(args, callback){
	var data = Object.assign({
		text: '',
		okBtn: 'OK',
		closeBtn: 'CLOSE',
		closeBtnCls: "",
		okBtnCls: "success",
		cls: "",
		isprompt: false,
		required: false,
		hasCloseBtn: false,
		callback: callback
	}, args);
	this._alert.set('data', data);
	this._alert.open();
};

window.Fabric.Confirm = function(args, callback){
	var data = Object.assign({
		text: '',
		okBtn: 'OK',
		closeBtn: 'CANCEL',
		closeBtnCls: "",
		okBtnCls: "success",
		cls: "",
		isprompt: false,
		required: false,
		hasCloseBtn: true,
		callback: callback
	}, args);
	this._alert.set('data', data);
	this._alert.open();
};

Polymer({
	is:'fabric-alert',
	properties:{
		data:{
			type: Object,
			value: {
				value: "",
				title: "Prompt",
				text: "Enter Value",
				okBtn: 'OK',
				closeBtn: 'CLOSE',
				fieldType: 'text',
				fieldItems: [],
				required: true,
				isprompt: true,
				hasCloseBtn: true,
				callback: false
			}
		},
		holder: {
			type: String,
			value: "Fabric"
		}
	},
	observers:["onTextChanged(data.text)"],
	_template: html`
		<style include="fabric-style">
			#dialodBox{@apply --fabric-alert-dialog}
			.field{width:100%; min-width:200px;margin-bottom:10px;@apply --fabric-alert-field;}
			paper-button.danger{background-color:var(--paper-red-400, #F00); color:#FFF;@apply --fabric-alert-danger-btn;}
			paper-button.success{background-color:var(--paper-green-400, #F00); color:#FFF;@apply --fabric-alert-success-btn;}
			paper-button.warning{background-color:var(--paper-orange-400, #F00); color:#FFF;@apply --fabric-alert-warning-btn;}
			[notitle]>.text{padding-top:25px;margin-top: 0px;@apply --fabric-alert-text;}
			.buttons{margin-top:20px;@apply --fabric-alert-buttons;}
			.title{padding:0px 15px;@apply --fabric-alert-title;}
			paper-listbox{border:1px solid #DEDEDE;@apply --fabric-alert-items;}
			paper-item{cursor:pointer;@apply --fabric-alert-item;}
			paper-item:hover{background-color:#DEDEDE;@apply --fabric-alert-item-hover;}
		</style>
		<paper-dialog id="dialodBox" modal class$="[[data.cls]]" notitle$="[[!data.title]]" notext$="[[!data.text]]">
			<h2 class="title" hidden$="[[!data.title]]">[[data.title]]</h2>
			<div class="text" hidden$="[[!data.text]]" id="textEl"></div>
			<div class="dialog-contents" hidden$="[[!data.isprompt]]">
				<template is="dom-if" if="[[_isTextInput(data.fieldType)]]">
					<paper-input class="field" type="[[data.fieldType]]" no-float-label value="{{data.value}}" on-keyup="onkeyup"></paper-input>
				</template>
				<template is="dom-if" if="[[_isSelectInput(data.fieldType)]]">
					<paper-listbox class="select-box" multi="[[_isMultiSelectField(data.fieldType)]]" selected="{{data.value}}" attr-for-selected="value">
						<template is="dom-repeat" items="[[data.fieldItems]]">
							<paper-item value="[[item.value]]">[[item.text]]</paper-item>
						</template>
					</paper-listbox>
				</template>
			</div>
			<div class="buttons">
				<paper-button on-tap="cancel" class$="[[data.closeBtnCls]]" dialog-dismiss raised hidden$="[[!data.hasCloseBtn]]">[[data.closeBtn]]</paper-button>
				<paper-button on-tap="done" class$="[[data.okBtnCls]]" raised>[[data.okBtn]]</paper-button>
			</div>
		</paper-dialog>
	`,
	_isSelectInput:function(){
		return this.data.fieldType == "multi-select" || this.data.fieldType == "select";
	},
	_isMultiSelectField:function(){
		return this.data.fieldType == "multi-select";
	},
	_isTextInput:function(){
		return this.data.fieldType == "text";
	},
	onTextChanged: function(){
		this.$.textEl.innerHTML =  this.data.text || "";
	},
	onkeyup: function(e){
		if (e.which != 13)
			return;
		this.doCallback('ok');
	},
	done: function(){
		this.doCallback('ok');
	},
	cancel: function(){
		this.doCallback('cancel');
	},
	toggle:function(){
		this.$.dialodBox.toggle();
	},
	open:function(){
		this.$.dialodBox.open();
	},
	close:function(){
		this.$.dialodBox.close();
	},
	doCallback: function(btn){
		var data = this.data;
		var value = data.value;
		if (data.required && btn == 'ok' && !value) {
			return;
		};
		this.close();
		if(data.callback){
			data.callback(btn, value);
		}
	},
	attached: function(){

		if (window.Fabric._alert && window.Fabric._alert.isCalled) {
			this.set('data', window.Fabric._alert.data);
			this.open();
		};

		window[this.holder] && (window[this.holder]._alert = this);
		window.Fabric._alert = this;
	}
})

