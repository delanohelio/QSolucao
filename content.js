var inputAluno = $('<input id="aluno" type="text" size=35 list="alunos">').insertAfter("p.conteudoTitulo");
var listAlunos = $('<datalist id="alunos">').insertAfter(inputAluno);
var inputProva = $('<input id="prova" type="text">').insertAfter(listAlunos);
var inputAtividade = $('<input id="atividade" type="text"><br>').insertAfter(inputProva);
var tds = $("table.conteudoTexto > tbody > tr > td");
for(var i = 6; i < tds.length - 5; i=i+5) {
	console.log($(tds[i]).find("a"));
	listAlunos.append($("<option>" + $(tds[i]).text() +"</option>"));
} 

