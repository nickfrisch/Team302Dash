async function getJson()
{
    const response = await fetch("config/config.json");

    jsonData = await response.json();
    createDiv(jsonData);
}

getJson();

function createDiv(data){
    console.log(data);

    for (let d of data)
    {
        const node = document.createElement("div");
        const textNode = document.createTextNode(d.name); 
        node.style.position = "absolute";
        node.style.top = d.x + "px";
        node.style.left = d.y + "px";
        node.appendChild(textNode);
        document.body.appendChild(node);
    } 
}
var input = document.getElementById("setTeamNum");
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter"){
        sendJson(e.target.value);
    }
});

async function sendJson(value)
{
  fetch("config/config.json", {
  method: 'PUT',
  body: JSON.stringify(value),
})
  .then((response) => response.json())
  .then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}