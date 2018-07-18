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

var Promise = window.Promise;
if (!Promise) {
    Promise = JSZip.external.Promise;
}

/**
 * Fetch the content and return the associated promise.
 * @param {String} url the url of the content to fetch.
 * @return {Promise} the promise containing the data.
 */
function urlToPromise(url) {
    return new Promise(function(resolve, reject) {
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

var urlMask = 'https://qacademico.ifpe.edu.br/qacademico/index.asp?t=3065&COD_PAUTA={diarioID}&ETAPA={n_etapa}&N_ETAPA={etapa}&TIPO={tipo}&PREENCHER=1'
var msg = $('<div id="msg" align="center" class="conteudoTitulo"></div>').insertBefore("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table:nth-child(3) > tbody > tr > td:nth-child(2) > p:nth-child(4)")[0]

var diariosURLS = {}

var scheduleDownloadDiario = function(diarioID, filename, url){
	zip.folder(diarioID).file(filename+".pdf", urlToPromise(url), {binary:true});
}

var checkAndDownloadDiarios = function() {
	if(downloadsDone == totalDownloads) {
		zip.generateAsync({type:"blob"}, function updateCallback(metadata) {
        msg.textContent = "Zipando: " + metadata.percent.toFixed(2) + " %";
    }).then(function callback(blob) {
        saveAs(blob,"diarios.zip");
    	}, function (e) {
	        console.log(e);
  	  });	
	}
	
}

var getDiarioPreenchido = function(diarioID, tipo, url){
	getHTML(url, function (response) {
		var nodes = response.querySelectorAll("a");
		downloadsDone++
		msg.textContent = "Gerando Diarios - {key1}/{key2}".format({key1:downloadsDone, key2:totalDownloads})
		scheduleDownloadDiario(diarioID, tipo, nodes[nodes.length - 1].href)
		checkAndDownloadDiarios()
		//$.fileDownload(nodes[nodes.length - 1].href)
	})
}

var getDiariosPreenchidos = function(diarioID) {
	totalDownloads += 6
	//Unidade 1
	getDiarioPreenchido(diarioID, "PRESENCA_NOTAS_UNID1", urlMask.format({diarioID:diarioID, n_etapa:1, etapa:"UNID1", tipo:"RELAT_LISTA_PRESENCA_NOTAS"}))
	getDiarioPreenchido(diarioID, "PRESENCA_NOTAS_VERSO_UNID1", urlMask.format({diarioID:diarioID, n_etapa:1, etapa:"UNID1", tipo:"RELAT_LISTA_PRESENCA_NOTAS_VERSO"}))
	//Unidade 2
	getDiarioPreenchido(diarioID, "PRESENCA_NOTAS_UNID2", urlMask.format({diarioID:diarioID, n_etapa:2, etapa:"UNID2", tipo:"RELAT_LISTA_PRESENCA_NOTAS"}))
	getDiarioPreenchido(diarioID, "PRESENCA_NOTAS_VERSO_UNID2", urlMask.format({diarioID:diarioID, n_etapa:2, etapa:"UNID2", tipo:"RELAT_LISTA_PRESENCA_NOTAS_VERSO"}))
	//Final
	getDiarioPreenchido(diarioID, "FINAL", urlMask.format({diarioID:diarioID, n_etapa:4, etapa:"EF", tipo:"RELAT_LISTA_LANCAMENTO_NOTAS"}))
	//Notas Consolidadas
	getDiarioPreenchido(diarioID, "NOTAS_CONSOLIDADAS", "https://qacademico.ifpe.edu.br/qacademico/index.asp?t=3065&COD_PAUTA={diarioID}&TIPO=RELAT_LANCA_PAUTAS&PREENCHER=1".format({diarioID:diarioID}))
}

var diariosTR = $("tr.conteudoTexto");
var diariosID = [];
var downloadsDone = 0
var totalDownloads = 0
var zip = new JSZip();
msg.textContent = "Carregando"

for (var i = 0; i < diariosTR.length; i++) {
	diariotr = diariosTR[i];
	diarioID = diariotr.firstElementChild.textContent.trim();
	diariosID.push(diarioID);
}

for (var i = 0; i < diariosID.length; i++) {
	diarioID = diariosID[i]
	getDiariosPreenchidos(diarioID)
}

msg.textContent = "Gerando Diarios - {key1}/{key2}".format({key1:downloadsDone, key2:totalDownloads})
