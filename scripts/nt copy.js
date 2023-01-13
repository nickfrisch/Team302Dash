//when page loads, automatically go to competition mode
switchDisplayMode("comp");

/// @TODO: make sure this can work with all widget types once that feature is added
function updateDashboard(key, value)
{
	if(document.getElementById(key + "-Content"))
	{
		switch (document.getElementById(key + "-Content").dataset.widgetType)
		{
			case "text":
				document.getElementById(key + "-Content").textContent = value;
				break;
			case "input":
				document.getElementById(key + "-Input").value = value;
		}

		
	}
}
//Function to switch between debug and comp mode
function switchDisplayMode(mode)
{
    if (mode === "comp")
    {
        document.getElementById("nt").style.display = "none";
		populateDefaults();
    }
    else if (mode === "debug")
    {
        document.getElementById("nt").style.display = "block";
    }
}

//Function to populate network table dropdown to add fields onto page
function populateSelectionDropdown()
{
	const dropDown = document.getElementById('myDropdown');

	fields = document.getElementsByTagName('td');

	const count = fields.length;
	for (let i = 0; i < count; i++)
	{
		if(!fields[i].hasAttribute('id'))
		{
			const node = document.createElement("button");
			const textnode = document.createTextNode(fields[i].textContent);
			node.appendChild(textnode);
			node.onclick = addToDashboard.bind(this, fields[i].textContent);
			dropDown.appendChild(node);
			
		}
	}
}

function saveCurrentLayout()
{
	const currentWidgets = document.getElementsByClassName("draggableheader");
	for(let cW of currentWidgets)
	{
		//check if we have already declared this entry in localStorage
		//if statement checks if its a "new" entry being added
		//otherwise, we can use the id of the div as the "prefix" to the web storage key
		
		//Webstore standard only supports string
		localStorage.setItem(cW.id+"::ShowDefault", "true");
		localStorage.setItem(cW.id+"::XPos", cW.style.left);
		localStorage.setItem(cW.id+"::YPos", cW.style.top);
		localStorage.setItem(cW.id+"::WidgetType", cW.dataset.widgetType);
	}
}

function populateDefaults()
{
	for(let i = 0; i < localStorage.length; i++)
	{
		var currentKey = localStorage.key(i);
		if(currentKey.includes("::ShowDefault"))
		{
			var header = currentKey.substring(0, currentKey.length-13);
			addToDashboard(header);
		}
	}
}

function addToDashboard(header)
{
	//Make sure we don't duplicate entries
	if(!document.getElementById(header))
	{
		//Create div with top and left being the x and y pos, get network table key
		const node = document.createElement("div");
		const textnode = document.createTextNode(header);
		node.className = "draggableheader";
		node.id = header;
		node.appendChild(textnode);

		var contentChild;
		var entryType = "input";

		/// @TODO: determine type by widget type first, if not, then fallback onto network table value

		if(localStorage.getItem(header+"::WidgetType"))
		{
			//Add widget functionality based on data type, will be determined when first constructing the widget
			switch(localStorage.getItem(header+"::WidgetType"))
			{
				case "text":
					//contentChild = document.createTextNode(NetworkTables.getValue(header, "Default Value"));
					//console.log("text");
					contentChild = document.createElement("input");
					contentChild.type = "text";
					contentChild.value = "Hello World";
					contentChild.id = header+"-Input";
					entryType = "input";
					contentChild.addEventListener("keydown", (e) => {
						if (e.key === "Enter"){
							setEntryValue(e.target.value, header);
							console.log("setEntryValue");
						}
					});
					// contentChild.setAttribute('tabindex', '1');
					break;
				case "button":
					contentChild = document.createTextNode(NetworkTables.getValue(header, "Default Value"));
					contentChild = document.createElement("button");
					contentChild.textContent = NetworkTables.getValue(header, "Default Value");
					console.log("button");
					break;
				case "input":
					console.log("input");
				default:
					console.log("default");
					break;
			}
		}
		else //default case if the widget isnt in the saved layout
		{
			//contentChild = document.createTextNode(NetworkTables.getValue(header, "Default Value"));
			contentChild = document.createElement("input");
			contentChild.type = "text";
			contentChild.value = NetworkTables.getValue(header, "Default Value")
			contentChild.id = header+"-Input";
			contentChild.addEventListener("keydown", (e) => {
				if (e.key === "Enter"){
					setEntryValue(e.target.value, header);
					console.log("setEntryValue");
				}
			});
		}

		const contentNode = document.createElement("div");
		contentNode.className = "draggablecontent";
		contentNode.id = header + "-Content";
		contentNode.dataset.widgetType = localStorage.getItem(header+"::WidgetType") ? localStorage.getItem(header+"::WidgetType") : entryType;
		contentNode.style.top = localStorage.getItem(header+"::YPos");
		contentNode.style.left = localStorage.getItem(header+"::XPos");

		contentNode.appendChild(node);
		contentNode.appendChild(contentChild);

		document.body.appendChild(contentNode);

		dragElement(contentNode);
		contentNode.addEventListener('contextmenu', function(e) {
			//alert("You've tried to open context menu"); //here you draw your own menu
      		e.preventDefault();
			showWidgetMenu(e);
		}, false);
	}
}

function setEntryValue(targetVal, header)
{
	NetworkTables.putValue(header, targetVal);
}