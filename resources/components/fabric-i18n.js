var FabricI18nBehavior = {
	_T(text){
		if(typeof i18n != "undefined" && i18n.translate){
			console.log("i18n.translate is missing" )
			return i18n.translate(text);
		}
		return text;
	}
}

export default FabricI18nBehavior;