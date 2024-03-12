var clickDetectorsKeyMaps = {
	battleKeyMap : {
		96: "block_pl4", 
		97: "hit_pl0",
		98: "hit_pl1",
		99: "hit_pl2",
		100: "hit_pl3",
		101: "hit_pl4",
		102: "block_pl0",
		103: "block_pl1",
		104: "block_pl2",
		105: "block_pl3"
	},
	captchaKeyMap: {
		96: "cat_4", //0
		97: "cat_0", //1
		98: "cat_1", //2
		99: "cat_2", //3
		100: "cat_5", //4
		101: "cat_8", //5
		102: "cat_6", //6
		103: "cat_9", //7
		104: "cat_7", //8
		105: "cat_3" //9
	},
	undergroundKeyMap: {
		81: 's8', // q
		69: 's2', // e
		90: 's6', // z
		67: 's4' // c				
	},
	cancelKeyMap: {
		27: 'movementCancel' // cancel
	},
	attackEnterKeyMap: {
		13: 'monster' // attack
	},
	instanceKeyMap: {
		move: {
			37: 'inst-left',
			38: 'inst-forward',
			39: 'inst-right',
			40: 'inst-backward',
			65: 'inst-left',
			87: 'inst-forward',
			68: 'inst-right',
			83: 'inst-backward',
			88: 'inst-backward'
		},
		attack: {
			13: 'map_monsters',
			32: 'map_monsters'
		}
	},
	battleStart: {		
		keys: [
			13
		],
		npc_names: [
			'Ворота Кладбища',
			'Священная раковина',
			'Лаборатория'
		] 
	}
};