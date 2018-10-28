//on click, do roll for stats in fieldset
//on click save, create new rollType and store it somewhere & lock fields
//onclick edit, reactive fields
//onclick delete - delete rolltype/fields
var roller = new DiceRoller();

$('.doRoll').click(function() {
	var id = $(this).attr('data-roll');
	var rollType = roller.getASavedRoll(id);
	var currentRoll = roller.doRoll(rollType);
	doRollEvent(currentRoll);
});

function doRollEvent(current) {
	var message = 'now rolling ' + current.name + '...';
	$('#globalStatus').text(message).delay(2000).text('');
	message = current.rollType.math.replace('{{math}}', current.rollMath);
	$('#currentRoll').text(message + ' = ' + current.value);
	updateRolls(message);
}

function updateRolls() {
	var item = '<li></li>';
	//make a list item
	//add to the list
	//make sure only new item has "current roll" class
}