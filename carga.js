/**
 * Get HTML asynchronously
 * @param  {String}   url      The URL to get HTML from
 * @param  {Function} callback A callback funtion. Pass in "response" variable to use returned HTML.
 */
var getHTML = function ( url, callback ) {

	// Feature detection
	if ( !window.XMLHttpRequest ) return;

	// Create new request
	var xhr = new XMLHttpRequest();

	// Setup callback
	xhr.onload = function() {
		if ( callback && typeof( callback ) === 'function' ) {
			callback( this.responseXML );
		}
	}

	// Get the HTML
	xhr.open( 'GET', url );
	xhr.responseType = 'document';
	xhr.send();

};

String.prototype.format = function (values) {

    var regex = /\{([\w-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g;

    var getValue = function (key) {
            if (values == null || typeof values === 'undefined') return null;

            var value = values[key];
            var type = typeof value;

            return type === 'string' || type === 'number' ? value : null;
        };

    return this.replace(regex, function (match) {
        //match will look like {sample-match}
        //key will be 'sample-match';
        var key = match.substr(1, match.length - 2);

        var value = getValue(key);

        return value != null ? value : match;
    });
};

var getAulas = function(diarioID) {
	getHTML(urlMask.format({'key1': diarioID, 'key2':1}), function (response) {
		var aulasUN1 = response.querySelector('tr.conteudoTitulo > td > div').textContent.split("/")[0]
		getHTML(urlMask.format({'key1': diarioID, 'key2':2}), function (response) {
			var aulasUN2 = response.querySelector('tr.conteudoTitulo > td > div').textContent.split("/")[0]
			tdLabel = tdLabels[diarioID]
			tdLabel.textContent = aulasUN1 + " + " + aulasUN2 + " = " + (parseInt(aulasUN1) + parseInt(aulasUN2)) + " de " + cargahoraria[diarioID];
		})
	})
}


var cargahorariaConvert = {"30": "40", "45": "60", "60": "80", "75": "100"}

var urlMask = 'https://qacademico.ifpe.edu.br/qacademico/index.asp?t=3066&MODO=FALTAS&COD_PAUTA={key1}&ETAPA={key2}&N_ETAPA=UNID{key2}'

var diariosTR = $("tr.conteudoTexto");
var diariosID = [];
var tdLabels = {};
var cargahoraria = {}

for (var i = 0; i < diariosTR.length; i++) {
	diariotr = diariosTR[i];
	diarioID = diariotr.firstElementChild.textContent.trim();
	diariosID.push(diarioID);
	tdLabel = diariotr.children[2];
	tdLabels[diarioID] = tdLabel;
	cargahoraria[diarioID] = cargahorariaConvert[tdLabel.textContent.trim()]
}



for (var i = 0; i < diariosID.length; i++) {
	diarioID = diariosID[i]
	tdLabels[diarioID].textContent = "Carregando";
	getAulas(diarioID)
}
