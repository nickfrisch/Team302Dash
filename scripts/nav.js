var navBarItems = `
<div id="nav-bar">
    Robot: <span id="robotstate">Unknown state</span> @ <span id="robotAddress">disconnected</span>
    <input id="home-button" class="button" type="button" value="Home" onclick="location.href='./index.html'"/>
    <input id="ntButton" class="button" type="button" value="Network Tables" onclick="location.href='./nt.html'"/>
    <input id="cameraButton" class="button" type="button" value="Camera Stream(s)" onclick="location.href='./camstreams.html'"/>
    <input id="photonButton" class="button" type="button" value="PhotonVison Dashboard" onclick="openPhotonDashboard()"/>
    <input id="settings-button" class="button" type="button" onclick="location.href='./settings.html'"/>
</div>
`

document.body.insertAdjacentHTML("afterbegin", navBarItems);

function openPhotonDashboard()
{
    window.open("http://" + NetworkTables.getRobotAddress() + ":5800");
}