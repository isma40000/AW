function  getToDoTasks(tasks){
    let y =tasks.filter(n => n.done !== true).map(n => n=n.text);
    return y;
}
function findByTag(tasks, tag){
    let x = tasks.filter(n => n.tags.some(m => m===tag));
    return x;
}
function findByTags(tasks, tags){
    let x = tasks.filter(n => n.tags.some(m => tags.includes(m)));
    return x;
}
function  countDone(tasks){
    let x = tasks.filter(n => n.done === true);
    return x.length;
}
function createTask(texto){
    let x = {
        text: "",
        tags: []
    }
    var y = /.+?(?= @)/;
    var z = /@\w*/g;
    x.text = texto.match(y)[0];
    x.tags = texto.match(z);
    return x;
}

let listaTareas = [
    {text:"Preparar práctica AW", tags:["AW","practica"]}
    , {text: "Mirar fechas congreso", done: true, tags:[]}
    , {text: "Ir al supermercado", tags: ["personal"]}
    , {text: "Mudanza", done: false, tags:["personal"]}
];
//findByTags(listaTareas, ["personal", "practica"]);
createTask("Ir al medico @personal @salud");