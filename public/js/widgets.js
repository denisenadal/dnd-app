function DiceRoller() {
	this.pastRolls = [];
	this.currentRoll = null;
	this.savedRolls = [];
}

DiceRoller.prototype.doRoll = function(rollType) {
	var rollValue = 0;
	var rollMath = "";
	if (typeof rollType === undefined) {
		var rollType = {};
		rollType.numDie = 1;
		rollType.dieSides = 20;
		rollType.mods = [];
	}
	if (rollType.mods.length !== 0) {
		rollType.mods.forEach(function(mod, i) {
			rollValue += mod.value;
		});
	}
	for (var i = 1; i <= rollType.numDie; i++) {
		var roll = Math.floor(Math.random() * rollType.dieSides);
		rollValue += roll;
		rollMath += roll.toString();
		if (i < rollType.numDie) {
			rollMath += ' + ';
		}
	}
	this.currentRoll = rollValue;
	pastRolls.push(rollValue);
	return {
		"value": rollValue,
		"rollMath": rollMath,
		"rollType": rollType
	};
};
DiceRoller.prototype.getCurrentRoll = function() {
	return this.CurrentRoll;
};
DiceRoller.prototype.getPastRolls = function() {
	return this.pastRolls;
};
DiceRoller.prototype.getSavedRolls = function() {
	return this.SavedRolls;
};
DiceRoller.prototype.getASavedRoll = function(rollID) {
	var savedRoll = this.savedRolls.filter(function(roll) {
		if (roll.id === rollID) {
			return roll;
		}
	});
	return savedRoll;
};
DiceRoller.prototype.saveRoll = function(rollName, numDie, dieSides, mods) {
	var newRoll = new RollType(rollName, numDie, dieSides, mods);
	savedRolls.push(newRoll);
};

function RollType(rollName, numDie, dieSides, mods) {
	this.id = 'roll' + Date.now() + Math.random().toString(36).substr(2, 10);
	this.name = rollName;
	this.sides = dieSides;
	this.numDie = numDie;
	this.mods = mods;
	this.formula = numDie + 'd' + dieSides;
	for (var i = 0; i < mods.length; i++) {
		if (mod.value >= 0) {
			this.formula += ' + ' + mod.value;
		} else {
			this.formula += ' - ' + mod.value;
		}
		this.formula += "(" + mod.name + ")";
	}
	this.math = this.formula.replace(/\d+d\d+/, '{{math}}');
}