//var userStaff = new userActiveItems('http://rock-citadel.ru/ratings/items.php', messagingEnum); 
//var userStaff = new userActiveItems('http://188.226.128.79//items.php', messagingEnum);
var userStaff = null;
	kango.addMessageListener(messagingEnum.userActiveItemsStart, function(event) {
	userStaff = new userActiveItems('http://'+event.data.host+'/items.php' , messagingEnum);
});
kango.addMessageListener(messagingEnum.userItemsBackground, function(event) {
	userStaff.getItems(event.data.userName, event.data.hash);
});
