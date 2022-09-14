//create consumer to read data
function create_consumer(){
    const Http = new XMLHttpRequest();
    const url="http://localhost:8080/http://localhost:8082/consumers/RSSI-group"
    Http.open("POST", url);
    Http.setRequestHeader("Content-Type","application/vnd.kafka.v2+json");
    let data= `{
        "name": "RSSI_consumer",
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
async function assign_topic(partition,datas){
    const Http = new XMLHttpRequest();
    const url="http://localhost:8080/http://localhost:8082/consumers/RSSI-group/instances/RSSI_consumer/assignments"
    Http.open("POST", url);
    Http.setRequestHeader("Content-Type","application/vnd.kafka.v2+json")
    let data= `{
  "partitions": [
    {
      "topic": "RSSI",
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
    const url2="http://localhost:8080/http://localhost:8082/consumers/RSSI-group/instances/RSSI_consumer/positions/"+datas
    Http2.open("POST", url2);
    Http2.setRequestHeader("Content-Type","application/vnd.kafka.v2+json")
    Http2.send(data)
    Http2.onreadystatechange = (e) => {
        console.log(Http.responseText)
    }
}

//callback function to manage consume of messages
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

//read messages from the topic and insert them in the chart
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

    //consume message
    create_consumer()
    await wait(1000)
    await assign_topic(partition,data)
    await wait (1000)
    consume_messages()

}

//destroy chart
function Destroy(){
    myChart.destroy()

    //delete consumer
    const Http = new XMLHttpRequest();
    const url="http://localhost:8080/http://localhost:8082/consumers/RSSI-group/instances/RSSI_consumer"
    Http.open("DELETE", url);
    Http.setRequestHeader("Content-Type","application/vnd.kafka.v2+json");
    Http.send()
    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
    }
}