var highscore = 0;
var contentsScore = "";

jQuery('#scoresbtn').on('click', function() {
  jQuery('#content').empty();
  jQuery('#content').append(
    contentsScore
  )
});
jQuery('#creditsbtn').on('click', function() {
  jQuery('#content').empty();
  jQuery('#content').append(
    '<P>'+'Credits'+'</p>'
  )
});
jQuery('#helpbtn').on('click', function() {
  jQuery('#content').empty();
  jQuery('#content').append(
    '<P>'+'Help'+'</p>'
  )
});

function registerScore(score){
  var playerName = prompt("What's your name?");
  if (score > highscore) {
    highscore = score;
    contentsScore =  "<li>" + playerName + ":" + score.toString() + "</li>";
  }
}
