var inputAluno;
var listAlunos;
var alunos = {};

function initGrade() {

	var inputFile = $('<input class="extension" type="file" id="fileInput" accept=".csv,.tsv">').insertBefore("table.conteudoTexto")
	inputAluno = $('<input class="extension" id="aluno" type="text" size=35 list="alunos">').insertAfter(inputFile);
	listAlunos = $('<datalist class="extension" id="alunos">').insertAfter(inputAluno);
	var inputProva = $('<input class="extension" id="prova" type="text">').insertAfter(listAlunos);
	//var inputAtividade = $('<input class="extension" id="atividade" type="text">').insertAfter(inputProva);
	var buttonOk = $('<button class="extension" id="ok" type="button">OK</button><br class="extension">').insertAfter(inputProva);
	var buttonSave = $('<button class="extension" id="saveButton">Salvar Nomes em Arquivo</button>').insertBefore("table.conteudoTexto").insertAfter(buttonOk);

	buttonOk.click(function () {
		setNotaByAluno(inputAluno.val(), inputProva.val(), true)
		inputAluno.val("");
		inputProva.val("");
		//inputAtividade.val("");
		inputAluno.focus();
	});
	$(inputProva).keyup(function (e) {
		if (e.keyCode == 13 && !isNaN(alunos[inputAluno.val()]["code"])) {
			buttonOk.trigger("click");
		}
	});

	buttonSave.click(function() {

		// Cria um blob com os nomes em formato de texto
		const blob = new Blob([Object.keys(alunos).join('\n')], {type: 'text/plain'});

		// Cria um link de download
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'lista_nomes.txt'; // Nome do arquivo que será baixado

		// Simula o clique no link para baixar o arquivo
		link.click();

	});

	inputFile.on('change', function (event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				const text = e.target.result;
				const rows = text.split('\n'); // Divide em linhas

				rows.forEach(row => {
					const cells = row.split('\t'); // Divide em células
					const nomeAluno = cells[0];
					const notaAluno = cells[1];

					if (nomeAluno in alunos) {
						if(notaAluno.trim() !== "")
							setNotaByAluno(nomeAluno, notaAluno, false)
						else
							console.log("Aluno " + nomeAluno + " sem nota")
					} else {
						console.log("Não achamos o aluno: " + nomeAluno)
					}

				});
			};
			reader.readAsText(file); // Lê o arquivo como texto
		}
	});

	populateAlunos();
}

function setNotaByAluno(nomeAluno, notaAluno, clear) {
	var matricula = alunos[nomeAluno]["code"];
	var inputNota = $("[name=NOTA"+matricula+"]");
	//var inputObs = $("[name=OBS"+matricula+"]");
	var notaProva = parseFloat(notaAluno.replace(',', '.'));
	//var notaAtividade = parseInt(inputAtividade.val());
	/*if(!isNaN(notaAtividade)){
        inputObs.val("Miniteste: " + notaProva+"; Atividade: "+notaAtividade);
        notaProva += notaAtividade;
    }*/
	inputNota.val(notaProva.toString().replace('.', ','));

	if(clear) {

	}
}

function initPresence() {
	inputAluno = $('<input class="extension" id="aluno" type="text" size=35 list="alunos">').insertBefore("[name=frmAula]");
	listAlunos = $('<datalist class="extension" id="alunos">').insertAfter(inputAluno);
	var inputFaltas = $('<input class="extension" id="faltas" type="text">').insertAfter(listAlunos);
	inputFaltas.val($("[name=N_AULAS").val());
	var buttonOk = $('<button class="extension" id="ok" type="button">OK</button><br class="extension">').insertAfter(inputFaltas);
	buttonOk.click(function() {
		var matricula = alunos[inputAluno.val()]["code"];
		var inputFaltasAluno;
		if(matricula === -1) {
			inputFaltasAluno = $("input[name^='N_FALTAS']")
		} else{
			inputFaltasAluno = $("[name=N_FALTAS_"+matricula+"]");
			
		}
		inputFaltasAluno.val(inputFaltas.val());
		inputAluno.val("");
		inputAluno.focus();
	});
	$(inputFaltas).keyup(function(e){
	    if(e.keyCode == 13)
	    {
	        buttonOk.trigger("click");
	    }
	});
	populateAlunos();
}

function initFaltas() {
	listAlunos = $('<datalist class="extension" id="alunos">')
	var texto1 = $('<br class="extension"><span class="extension">Inserir </span>').insertBefore("[name=frmAula]")
	var inputFaltas = $('<input class="extension" id="faltas" type="text">').insertBefore("[name=frmAula]")
	inputFaltas.val($("[name=N_AULAS").val());
	var texto2= $('<span class="extension">faltas em alunos com pelo menos</span>').insertBefore("[name=frmAula]")
	var inputLimiar = $('<input class="extension" id="limiar" type="text">').insertBefore("[name=frmAula]")
	var texto2= $('<span class="extension">faltas</span>').insertBefore("[name=frmAula]")
	var buttonOk = $('<button class="extension" id="ok" type="button">OK</button><br class="extension">').insertBefore("[name=frmAula]")
	buttonOk.click(function() {
		var limiar = parseInt(inputLimiar.val())
		var faltas = parseInt(inputFaltas.val())
		for(nome in alunos){
			if(alunos[nome]["faltas"] >= limiar){
				var matricula = alunos[nome]["code"];
				var inputFaltasAluno = $("[name=N_FALTAS_"+matricula+"]");
				inputFaltasAluno.val(faltas);
			}

		}
	});
	populateAlunos();
}

function clearAll() {
	$(".extension").remove()
}

function populateAlunos() {
	var links = $("a[title='Consulta Dados do Aluno']");
	for(var i = 1; i < links.length; i=i+2) {
		var nome = $(links[i]).text();
		cod_mat = links[i].search.split("=")[2];
		qty_faltas_element = $("input[name=hidTOTAL_FALTAS_"+cod_mat+"]")
		qty_faltas = parseInt(qty_faltas_element.val())
		if(!qty_faltas) {
			qty_faltas = 0
		}
		alunos[nome] = {code: cod_mat, faltas: qty_faltas}
		listAlunos.append($("<option>" + nome +"</option>"));
	}
	alunos["Todos"] = {code: -1};
	listAlunos.append($("<option>" + "Todos" +"</option>"));
}

