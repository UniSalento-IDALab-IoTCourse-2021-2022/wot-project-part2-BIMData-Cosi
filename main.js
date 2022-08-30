accesstoken="eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI1Ql9OOGk4MnlCUWZkZnVfenByMGIyQ1Rfc21jV21kZDkzSTFQRGJXTkIwIn0.eyJleHAiOjE2NjE4NTg1MTQsImlhdCI6MTY2MTg1NDkxNCwianRpIjoiMzMxMzIzMDItNzI4Ny00OTQ3LWExYWUtNTVlNDAxMTcwNGYxIiwiaXNzIjoiaHR0cHM6Ly9pYW0uYmltZGF0YS5pby9hdXRoL3JlYWxtcy9iaW1kYXRhIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImIyOTU2ZDNiLTBlMWEtNDk4OS04NTQ4LWQzYzMxYjkyNzdiMCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImE4OWJhYWI3LTk4YWUtNDRkYS1hOTVjLWVjZThlODJjZTMzZSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYmltZGF0YSIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJjaGVjazpyZWFkIG1vZGVsOnRva2VuX21hbmFnZSB3ZWJob29rOm1hbmFnZSBkb2N1bWVudDpyZWFkIGNsb3VkOm1hbmFnZSB1c2VyOnJlYWQgZG9jdW1lbnQ6d3JpdGUgb3JnOm1hbmFnZSBwcm9maWxlIG1vZGVsOnJlYWQgZW1haWwgY2hlY2s6d3JpdGUgbW9kZWw6d3JpdGUgY2xvdWQ6cmVhZCIsImNsaWVudElkIjoiYTg5YmFhYjctOThhZS00NGRhLWE5NWMtZWNlOGU4MmNlMzNlIiwiY2xpZW50SG9zdCI6IjE1MS40NS4yMzYuMTIwIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtYTg5YmFhYjctOThhZS00NGRhLWE5NWMtZWNlOGU4MmNlMzNlIiwiY2xpZW50QWRkcmVzcyI6IjE1MS40NS4yMzYuMTIwIn0.XZq1zKjFXbyCikjh8UQrUAV-0otq4YuV0iHhysuv3kzTH0NCPeTeAAkDlEPzcw8uh1SV9d5LjZSc8x3LnQWN1Xt5PnTc_iCs4uXiPCuYRCbapdHaqJMw9nBWIZm2J9Mos2OktBLDdiRL5MQeLsPrpcMof0mtoiGoRkwFUZ6mZhe7pzLRzl0dURFOyMxTy8c-w648FBOAZOtvDRYuVXK_jy7hvh2fotu7Qt8T98X63-5eJSkrKW-4xDojqXjGbojpFLZvpXsr5w8TQuhU5yz7t7Pz6YrDdeu_Y7jajhdR61sAlBnCzrJq4SIj5_RvnpBugfgoHTp8JX4EHlEiVcq-Mg"
// Configure the viewer
const viewer = makeBIMDataViewer({
    ui: {
        contextMenu: false,
        headerVisible: true,
        windowManager:false
    },
    api: {
        ifcIds: [44244],
        cloudId: 17709,
        projectId: 437580,
        accessToken: accesstoken},
    plugins: {
        bcf: false,
        "structure-properties": false,
        fullscreen: true,
        section: false,
        search: false,
        projection: false,
    }
});


// Create components
const nome = "";
const rssi_component = {
    name: "rssi_component",
    template: `<div
				id="rssi"
				style="height: 100%;
				display: flex;
				justify-content:center;
				align-items:center;"
				>
				
			</div>`
};

const component2 = {
    name: "myPluginComponent",
    methods: {
        onClick() {
            const visibleObjects = this.$viewer.state.visibleObjects;
            console.log("This is the visible objects:", visibleObjects);
        },
    },
    template: `
      <div
       id="rssi"
	   style="height: 100%;
	   	display: flex;
		justify-content:center;
		align-items:center;">
        
      </div>`
};

const myFunction = ($viewer) => {
    $viewer.state.hub.on("objects-selected", (objects) =>
        console.log("New objects are selected", objects)
    );
};

// Create and register plugins
const plugin1 = {
    name: "plugin1",
    component: rssi_component,
};

viewer.registerPlugin(plugin1);
viewer.registerPlugin({
    name: "plugin2",
    component: component2,
    startupScript: myFunction,
});

// Create and register windows
const window1 = {
    name: "window1",
    plugins: ["plugin1"],
};

const window2 = {
    name: "window2",
    plugins: ["plugin2"],
};

viewer.registerWindow(window1);
viewer.registerWindow(window2);

// Mount custom layout
const customLayout = {
    ratios: [40, 60],
    children: [
        "3d",
        {
            ratios: [50, 50],
            direction: "column",
            children: ["window1", "window2"],
        },
    ],
};

viewer.mount("#viewerId", customLayout);


