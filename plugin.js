//create consumer to read data
function create_consumer(name){
    const Http = new XMLHttpRequest();
    const url="http://localhost:8080/http://localhost:8082/consumers/RSSI-group"
    Http.open("POST", url);
    Http.setRequestHeader("Content-Type","application/vnd.kafka.v2+json");
    let data= `{
        "name": "${name}",
        "format": "json",
        "auto.offset.reset": "earliest",
        "auto.commit.enable":"true"
    }`
    Http.send(data)
    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
    }
}

//assign topic and partition to the consumer
async function assign_topic(partition,topic_name,consumer_name,datas){
    const Http = new XMLHttpRequest();
    const url="http://localhost:8080/http://localhost:8082/consumers/RSSI-group/instances/"+consumer_name+"/assignments"
    Http.open("POST", url);
    Http.setRequestHeader("Content-Type","application/vnd.kafka.v2+json")
    let data= `{
  "partitions": [
    {
      "topic": "${topic_name}",
      "partition": ${partition}
    }
  ]
}`
    Http.send(data)
    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
    }

    await wait(500)

    const Http2 = new XMLHttpRequest();
    const url2="http://localhost:8080/http://localhost:8082/consumers/RSSI-group/instances/"+consumer_name+"/positions/"+datas
    Http2.open("POST", url2);
    Http2.setRequestHeader("Content-Type","application/vnd.kafka.v2+json")
    Http2.send(data)
    Http2.onreadystatechange = (e) => {
        console.log(Http.responseText)
    }
}

//callback function to manage consume of RSSI messages
let old_param = 0;
function callback(param) {
    console.log(param)
    if (param === 0 && old_param===1) {
        console.log("stop")
    } else{
        consume_messages()
        console.log("continue")
    }
    old_param=param
}

//read RSSI messages from the topic and insert them in the chart
function consume_messages() {
    const Http = new XMLHttpRequest();
    const url = "http://localhost:8080/http://localhost:8082/consumers/RSSI-group/instances/RSSI_consumer/records"
    Http.open("GET", url);
    Http.responseType = 'json'
    Http.setRequestHeader("Accept", "application/vnd.kafka.json.v2+json")
    Http.send()
    Http.onreadystatechange = async (e) => {
        if (Http.response !== null && Http.response.length!==0) {
            console.log(Http.response)
            for (const x in Http.response) {
                let json = JSON.parse(Http.response[x].value)
                await wait(1000)
                addData(myChart, "", json["rssi"])
            }
            if(Http.readyState===4)
                callback(1)
        } else {
            if(Http.readyState===4)
                callback(0)
        }
    }
}

//callback function to manage consume of coordinates messages
let old_param2 = 0;
function callback2(param2,view) {
    console.log(param2)
    if (param2 === 0 && old_param2===1) {
        console.log("stop")
        document.getElementById('textToChange').innerHTML = "Localization ended";
    } else{
        consume_messages_coord(view)
        console.log("continue")
    }
    old_param2=param2
}

//read coordinate messages and insert in the viewer
function consume_messages_coord(view) {
    const Http = new XMLHttpRequest();
    const url = "http://localhost:8080/http://localhost:8082/consumers/RSSI-group/instances/coord_consumer/records"
    Http.open("GET", url);
    Http.responseType = 'json'
    Http.setRequestHeader("Accept", "application/vnd.kafka.json.v2+json")
    Http.send()
    Http.onreadystatechange = async (e) => {
        if (Http.response !== null && Http.response.length!==0) {
            console.log(Http.response)
            let i=0
            for (const x in Http.response) {
                let json = JSON.parse(Http.response[x].value)
                await wait(1000)
                i=i+1
                let object=create_object(json["x"], json["y"],i)
                view.viewer.scene.addObject(object)
                await wait(500)
                view.viewer.scene.removeObject(object.id)
            }
            if(Http.readyState===4)
                callback2(1,view)
        } else {
            if(Http.readyState===4)
                callback2(0,view)
        }
    }
}


function wait(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}


//add data to the chart
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

//initialize chart
var myChart=new Chart
async function Init(partition,data){
    const ctx = document.getElementById("Chart").getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'RSSI value',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1
            }]
        },
        options: {
        }
    });

    //consume messages
    create_consumer(String("RSSI_consumer"))
    await wait(1000)
    await assign_topic(partition,String("zi76opth-RSSI"),"RSSI_consumer",data)
    await wait (1000)
    await consume_messages()

}

//destroy the plugin
function Destroy(name){
    //destroy chart
    if (name==="RSSI_consumer")
        myChart.destroy()

    //delete consumer
    const Http = new XMLHttpRequest();
    const url="http://localhost:8080/http://localhost:8082/consumers/RSSI-group/instances/"+name
    Http.open("DELETE", url);
    Http.setRequestHeader("Content-Type","application/vnd.kafka.v2+json");
    Http.send()
    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
    }
}

//create localization points
function create_object(x,y,i){
    return {
        geometry: [
            {
                type: "arc",
                x: x,
                y: y,
                radius: 0.07,
                closePath: true,
            },
        ],
        texture: "solid",
        textureTint: 0xff0000,
        textureOpacity: 0.5,
        id:"position"+i
    }
}

//start localization plugin
async function Init2(view) {
    create_consumer(String("coord_consumer"))
    await wait(1000)
    await assign_topic(0,String("zi76opth-coordinate"),"coord_consumer","end")
    await wait (1000)
    consume_messages_coord(view)
}