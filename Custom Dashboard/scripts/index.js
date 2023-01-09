// sets a function that will be called when the robot connects/disconnects
NetworkTables.addRobotConnectionListener(onRobotConnection, true);

function onRobotConnection(connected) {
	$('#robotstate').text(connected ? "Connected!" : "Disconnected");
	$('#robotAddress').text(connected ? NetworkTables.getRobotAddress() : "disconnected");
}