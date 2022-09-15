// Configure token
const accesstoken = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI1Ql9OOGk4MnlCUWZkZnVfenByMGIyQ1Rfc21jV21kZDkzSTFQRGJXTkIwIn0.eyJleHAiOjE2NjMyMzMxNjQsImlhdCI6MTY2MzIyOTU2NCwianRpIjoiNGM2NTM4ZWEtZDRhNy00NzMwLTg3ODItNDViNDZiYTE4MGYyIiwiaXNzIjoiaHR0cHM6Ly9pYW0uYmltZGF0YS5pby9hdXRoL3JlYWxtcy9iaW1kYXRhIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImIyOTU2ZDNiLTBlMWEtNDk4OS04NTQ4LWQzYzMxYjkyNzdiMCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImE4OWJhYWI3LTk4YWUtNDRkYS1hOTVjLWVjZThlODJjZTMzZSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsImRlZmF1bHQtcm9sZXMtYmltZGF0YSIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJjaGVjazpyZWFkIG1vZGVsOnRva2VuX21hbmFnZSB3ZWJob29rOm1hbmFnZSBkb2N1bWVudDpyZWFkIGNsb3VkOm1hbmFnZSB1c2VyOnJlYWQgZG9jdW1lbnQ6d3JpdGUgb3JnOm1hbmFnZSBwcm9maWxlIG1vZGVsOnJlYWQgZW1haWwgY2hlY2s6d3JpdGUgbW9kZWw6d3JpdGUgY2xvdWQ6cmVhZCIsImNsaWVudElkIjoiYTg5YmFhYjctOThhZS00NGRhLWE5NWMtZWNlOGU4MmNlMzNlIiwiY2xpZW50SG9zdCI6IjE1MS40NS4yMzYuMTIwIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtYTg5YmFhYjctOThhZS00NGRhLWE5NWMtZWNlOGU4MmNlMzNlIiwiY2xpZW50QWRkcmVzcyI6IjE1MS40NS4yMzYuMTIwIn0.MjTZdb-SaWn47C35HkPFDnKJHaDkFH1-5J7bGm9w92EUY-zRZCsMSUufRzWA_SZE3zivkBfyhs27LzSHueAM1W8zfQn-txpQDe-fsCwUaytYWxxxBrkgmHpgqmXmxHjTfDGXJNYFccJqScRzEhKgII7XovMXq9mVLZqFiLcDamm2KdxxEoe1-vAiT99ghd6SuGFQTgzVwdGs1VBbJPkOrWDCHgnIWxViZcND3JfQ1vHjlN2OIEEw8SZbRW8yYxsS2voNTqcBCPiqz5pBDUVdjWE6F7ZdOWbU8BLYx51aEXsoi3nQyQYQkELIlyvTc9wpPO87Lglelfx6XnlgNIoSAA"
    const viewer = makeBIMDataViewer({
    logger: {
        level: "INFO"
    },
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
        bcf: false,
        "structure-properties": true,
        fullscreen: true,
        section: false,
        search: false,
        projection: false,
        viewer2d:true,
        "viewer2d-parameters": true,
        measure2d: false,
        "viewer2d-screenshot": false,
        viewer3d: {
            navCube: true,
            edges: true,
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
            Destroy()
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

// Create and register plugins
viewer.registerPlugin({
    name: "plugin_rssi",
    component: rssi_chart
});

viewer.registerPlugin({
    name:"button_plugin",
    component: initplugin
})

// Create and register windows
const window1 = {
    name: "window1",
    plugins: ["button_plugin","plugin_rssi"],
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
