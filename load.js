console.log("load")

if($("form[name='frmSalvar']").length > 0) {
    var inputs = $("input[name^='NOTA']")
    for (let input of inputs) {
        const savedValue = localStorage.getItem(input.name);
        if (savedValue) {
            input.value = savedValue;
        }
    }
}else{
    var inputs = $(".faltas")
    const numFaltas = $("input[name='N_AULAS']").val()
    for (let input of inputs) {
        const savedValue = localStorage.getItem(input.name);
        if (savedValue) {
            input.value = numFaltas;
        }
    }
}
