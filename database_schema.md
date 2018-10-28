
user *
	id *
	name *
	email *
	pass *
	characters: [character.id]*
		character
			id *
			name *
			bio
			icon *
			money:{g,s,c}
			hp
			ammo{name,qty}
			exp
			inventory: [item.id]
			in_games:[game.id] *
			active_game: game.id *
			saved_rolls:[roll] *
				roll
					name *
					diceNum *
					diceType *
					modifiers:[mod] *
						mod *
							name *
							value *
	active_char: *

item
	id
	name
	weight
	price

game
	id
	players:[player]
		player
			user.id
			character.id
			is_admin: bool
			is_dead: bool
	turn_order:[{initRoll:userId}]
