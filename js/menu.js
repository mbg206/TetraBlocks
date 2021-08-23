document.getElementById("b_vsai").onclick = function(){
    changeMenu("mainMenu", "aiMenu");
}
document.getElementById("b_vsaiback").onclick = function(){
    changeMenu("aiMenu", "mainMenu");
}
document.getElementById("b_challenges").onclick = function(){
    changeMenu("mainMenu", "challengeMenu");
}
document.getElementById("b_challengeback").onclick = function(){
    changeMenu("challengeMenu", "mainMenu");
}

function changeMenu(from, to) {
    document.getElementById(from).style.display = 'none';
    document.getElementById(to).style.display = 'block';
}