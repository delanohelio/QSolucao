console.log("save")

if($("form[name='frmSalvar']").length > 0) {
    var inputs = $("input[name^='NOTA']")
    var context = "Notas"
}else{
    var inputs = $(".faltas")
    var context = "Faltas"
}

for (let input of inputs) {
    localStorage.setItem(input.name, input.value);
}
alert(`Sequencia de ${context} Copiado`)