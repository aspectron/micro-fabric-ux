import "@polymer/polymer/polymer-legacy.js";
import '@polymer/paper-styles/default-theme.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-menu-button/paper-menu-button.js';

const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');
$_documentContainer.innerHTML = `
<dom-module id="i18n-language-selector">
	<template>
		<style>
			:host{display: inline-block;min-width:120px;}
			.display{cursor: pointer;padding: 5px 0px 4px 2px;border-bottom: 1px solid #ccc;}
			.astab{padding: 10px; width: auto !important;}
			.astab .display{border-bottom: 0px;}
			.astab::content #dropdown{margin-top: 48px !important; margin-left:5px; margin-right: 5px; min-width: 140px;}
			.dropdown-content{@apply --fabric-i18n-language-selector-items}
			paper-item{cursor: pointer;@apply --fabric-i18n-language-selector-item}
			paper-item:hover{@apply --fabric-i18n-language-selector-item-hover}
		</style>
		<paper-menu-button class="astab" horizontal-align="[[hAlign]]">
			<div slot="dropdown-trigger" class="dropdown-trigger display">
				<iron-icon icon="translate"></iron-icon>
				<span>[[languagetitle]]</span>
			</div>
			<paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{selected}}" attr-for-selected="value">
				<template is="dom-repeat" items="{{language.list}}">
					<paper-item value="[[item.id]]">[[item.name]]</paper-item>
				</template>
			</paper-listbox>
		</paper-menu-button>
	</template>
</dom-module>
`;

document.body.appendChild($_documentContainer);

Polymer({
	is:'i18n-language-selector',
	properties:{
		languagetitle:{
			type: String,
			notify: true
		},
		selected:{
			type: String,
			notify: true,
			observer:'onLangChange'
		},
		language:{
			type: Object,
			notify: true,
			observer:'onLangChange'
		},
		hAlign:{
			type:String,
			value: 'right'
		}
	},
	observers:[
		'onLangChange(language.list, language.locale)'
	],
	ready: function(){
		document.body.addEventListener("fabric-i18n-init", (e)=>{
			console.log("fabric-i18n-init", e)
			this.init(e.detail.i18n)
		});

		if(window.i18n)
			this.init(window.i18n);
	},
	init: function(i18n){
		this.i18n = i18n;
		var langs = []; 
		_.each(i18n.languages, (name, code)=>{
			langs.push({name, id: code});
		});
		this.set('language', {
			source: i18n.source,
			locale: i18n.locale,
			list: langs
		});

        i18n.nodes.set(this.uuid, this);			
	},
	onLocaleChanged: function(locale){
		this.set('selected', locale);
	},
	attached: function(){
		if (!this.language || !this.language.list || !this.language.list.length)
			return;
		var list = [].concat(this.language.list);
		this.set('language.list', []);
		this.async(()=>{
			this.set('language.list', list);
		}, 1000);
	},
	onLangChange: function(){
		if (!this.language || !this.language.list.length || !this.selected)
			return;
		var l = _.find(this.language.list, (o)=>{return o.id == this.selected});
		if (!l)
			return (this.languagetitle = this.selected);
		this.languagetitle = l.name;

		if (this.language.locale != this.selected && this.i18n)
			this.i18n.setLocale(this.selected);
	},
	toJSON: function(v){
		return JSON.stringify(v);
	}

})

