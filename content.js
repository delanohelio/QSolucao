var inputAluno;
var listAlunos;
var alunos = {};

function initGrade(){
	inputAluno = $('<input class="extension" id="aluno" type="text" size=35 list="alunos">').insertAfter("p.conteudoTitulo");
	listAlunos = $('<datalist class="extension" id="alunos">').insertAfter(inputAluno);
	var inputProva = $('<input class="extension" id="prova" type="text">').insertAfter(listAlunos);
	var inputAtividade = $('<input class="extension" id="atividade" type="text">').insertAfter(inputProva);
	var buttonOk = $('<button class="extension" id="ok" type="button">OK</button><br class="extension">').insertAfter(inputAtividade);
	buttonOk.click(function() {
		var matricula = alunos[inputAluno.val()];
		var inputNota = $("[name=NOTA"+matricula+"]");
		var inputObs = $("[name=OBS"+matricula+"]");
		var notaProva = parseFloat(inputProva.val().replace(',', '.'));
		var notaAtividade = parseInt(inputAtividade.val());
		if(!isNaN(notaAtividade)){
			inputObs.val("Miniteste: " + notaProva+"; Atividade: "+notaAtividade);
			notaProva += notaAtividade;
		}
		inputNota.val(notaProva.toString().replace('.', ','));
		inputAluno.val("");
		inputProva.val("");
		inputAtividade.val("");
		inputAluno.focus();
		
	});
	$(inputProva).keyup(function(e){
	    if(e.keyCode == 13 && !isNaN(alunos[inputAluno.val()]))
	    {
	        buttonOk.trigger("click");
	    }
	});
	populateAlunos();
}

function initPresence() {
	inputAluno = $('<input class="extension" id="aluno" type="text" size=35 list="alunos">').insertBefore("[name=frmAula]");
	listAlunos = $('<datalist class="extension" id="alunos">').insertAfter(inputAluno);
	var inputFaltas = $('<input class="extension" id="faltas" type="text">').insertAfter(listAlunos);
	inputFaltas.val($("[name=N_AULAS").val());
	var buttonOk = $('<button class="extension" id="ok" type="button">OK</button><br class="extension">').insertAfter(inputFaltas);
	buttonOk.click(function() {
		var matricula = alunos[inputAluno.val()];
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

function clearAll() {
	$(".extension").remove()
}

function populateAlunos() {
	var links = $("a[title='Consulta Dados do Aluno']");
	for(var i = 1; i < links.length; i=i+2) {
		var nome = $(links[i]).text();
		alunos[nome] = links[i].search.split("=")[2];
		listAlunos.append($("<option>" + nome +"</option>"));
	}
	alunos["Todos"] = -1;
	listAlunos.append($("<option>" + "Todos" +"</option>"));
}

