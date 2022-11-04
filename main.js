// Configure token
const accesstoken = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI1Ql9OOGk4MnlCUWZkZnVfenByMGIyQ1Rfc21jV21kZDkzSTFQRGJXTkIwIn0.eyJleHAiOjE2NjcyMTc0MDUsImlhdCI6MTY2NzIxMzgwNSwianRpIjoiMzkwOGMwMjEtN2E0ZC00ZTQ4LWEyYjktZTY3ODc5MzgyZTY2IiwiaXNzIjoiaHR0cHM6Ly9pYW0uYmltZGF0YS5pby9hdXRoL3JlYWxtcy9iaW1kYXRhIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImIyOTU2ZDNiLTBlMWEtNDk4OS04NTQ4LWQzYzMxYjkyNzdiMCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImE4OWJhYWI3LTk4YWUtNDRkYS1hOTVjLWVjZThlODJjZTMzZSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYmltZGF0YSIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJjaGVjazpyZWFkIG1vZGVsOnRva2VuX21hbmFnZSB3ZWJob29rOm1hbmFnZSBkb2N1bWVudDpyZWFkIGNsb3VkOm1hbmFnZSB1c2VyOnJlYWQgZG9jdW1lbnQ6d3JpdGUgb3JnOm1hbmFnZSBwcm9maWxlIG1vZGVsOnJlYWQgZW1haWwgY2hlY2s6d3JpdGUgbW9kZWw6d3JpdGUgY2xvdWQ6cmVhZCIsImNsaWVudElkIjoiYTg5YmFhYjctOThhZS00NGRhLWE5NWMtZWNlOGU4MmNlMzNlIiwiY2xpZW50SG9zdCI6IjE1MS4yNi41NC4yNTMiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6InNlcnZpY2UtYWNjb3VudC1hODliYWFiNy05OGFlLTQ0ZGEtYTk1Yy1lY2U4ZTgyY2UzM2UiLCJjbGllbnRBZGRyZXNzIjoiMTUxLjI2LjU0LjI1MyJ9.WdklEwH7ye_Z9MAczYzSqXvJnx0wiaunVSKwOEMDkvdGzkCfOD0E1XciK_z-PaqrGetNXVLDtqnbyeGpWMkg3b62QaiKzSfAJ1BTDnqWwsLiKPfsh_zb2PgD4wwRVB9PXjt1Fy6DXwBZuIGeLCH0fLjc9H6Z5t89dbQZli3Xn2n6rF30gyznOwhhqoyiP-WrkYdV2J7Hmnvd2N6U-J_E1FZyQtlUVrAWl8kfCqjVGkSxnItjN3rZZ6wJlTVNlMdgS6erk6yKMwBtR8jX1dQCGjPpPd2598kcMo4U4FpgeN3FVcS99ZHR1-XDGdoxchOSYIAOQlQyeR8nj2AkXbhkEQ"
    const viewer = makeBIMDataViewer({
    ui: {
        contextMenu: false,
        headerVisible: false,
        windowManager:false
    },
    api: {
        ifcIds: [45742],
        cloudId: 17709,
        projectId: 441518,
        accessToken: accesstoken},
    plugins: {
        "viewer2d-parameters": true,
        fullscreen: true,
        "structure-properties": true,
        bcf: false,
        section: false,
        search: false,
        projection: false,
        viewer2d: true,
        measure2d: false,
        "viewer2d-screenshot": false,
        viewer3d: {
            edges: false,
            enableOffsets: true,
        },
    },
    properties: {
        editProperties: false
    },
    windowSelector: true,
});

const rssi_chart={
    name:"rssi_chart",
    template:`<div style="height: 90%;
				display: flex;
				justify-content:center;
				align-items:center;">
            <canvas id="Chart" height="100"></canvas>
                </div>`
}

//plugin to start the chart and visualize the RSSI data
const initplugin={
    name:"init",
    methods: {
        onClick() {
            let value = document.getElementById("Partition").value
            let olddata = document.getElementById("OldData").checked
            let newdata=document.getElementById("NewData").checked
            if(value!=="") {
                if (olddata===true&&newdata===false)
                    Init(value,"beginning")
                else if(newdata===true&&olddata===false)
                    Init(value,"end")
                else
                    window.alert("check the box with old or new data")
            }
            else
                window.alert("insert number of the measurement")
        },
        onClick2(){
            Destroy("RSSI_consumer")
        }
    },
    template: `
      <div>
        <span>Measurement n.</span>
        <input type="text" id="Partition" value="" size="5" maxlength="2">
        <input type="checkbox" id="NewData" name="new" value="">
        <label for="NewData"> New data</label>
        <input type="checkbox" id="OldData" name="old" value="">
        <label for="OldData"> Old data</label>
        <button type="button" @click="onClick">Click start plugin</button>
        <button type="button" @click="onClick2">Click destroy plugin</button>
      </div>
    `,
}

const localize = {
    name: "localizePlugin",
    methods: {
        onClick() {
            const plugin2d=this.$viewer.localContext.getPlugin("viewer2d")
            document.getElementById('textToChange').innerHTML = "Localization in progress...";
            Init2(plugin2d)
        },
        onClick2(){
            document.getElementById('textToChange').innerHTML = "Localization ended";
            Destroy("coord_consumer")
        }
    },
    template: `
      <div>
        <button type="button" @click="onClick">Start localization</button>
        <button type="button" @click="onClick2">End localization</button>
        <p id = 'textToChange'>  </p >
      </div>`,
};

// Create and register plugins
viewer.registerPlugin({
    name: "plugin_rssi",
    component: rssi_chart
});

viewer.registerPlugin({
    name:"init_plugin",
    component: initplugin
})

viewer.registerPlugin({
    name: "buttonPlugin",
    component: localize,
    button: {
        position: "left",
        content:"simple",
        tooltip:"localization",
        keepOpen:true,
        icon: {
            imgUri: "https://www.pngitem.com/pimgs/m/9-98936_localization-icons-png-vector-icon-location-png-transparent.png"},
    },
    addToWindows:["2d"]
});

// Create and register windows
const window1 = {
    name: "window1",
    plugins: ["init_plugin","plugin_rssi"],
};

viewer.registerWindow(window1);

// Mount custom layout
const customLayout = {
    ratios: [40, 60],
    children: [
        "3d",
        {
            ratios: [50, 50],
            direction: "column",
            children: ["2d", "window1"],
        },
    ],
};

viewer.mount("#viewerId", customLayout);