exports.getToDoTasks = function  getToDoTasks(tasks){
    let y =tasks.filter(n => n.done !== true).map(n => n=n.text);
    return y;
}
exports.findByTag = function findByTag(tasks, tag){
    let x = tasks.filter(n => n.tags.some(m => m===tag));
    return x;
}
exports.findByTags = function findByTags(tasks, tags){
    let x = tasks.filter(n => n.tags.some(m => tags.includes(m)));
    return x;
}
exports.countDone = function  countDone(tasks){
    let x = tasks.filter(n => n.done === true);
    return x.length;
}
exports.createTask = function createTask(texto){
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