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
        "auto.commit.enable":"false"
    }`
    Http.send(data)
    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
    }
}

//assign topic and partition to the consumer
async function assign_topic(partition){
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
    const url2="http://localhost:8080/http://localhost:8082/consumers/RSSI-group/instances/RSSI_consumer/positions/beginning"
    Http2.open("POST", url2);
    Http2.setRequestHeader("Content-Type","application/vnd.kafka.v2+json")
    Http2.send(data)
    Http2.onreadystatechange = (e) => {
        console.log(Http.responseText)
    }
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
        if (Http.response !== null) {
            for (const x in Http.response) {
                let json = JSON.parse(Http.response[x].value)
                await wait(500)
                addData(myChart, "", json["rssi"])
            }
            return 0
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
async function Init(partition){
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
    await create_consumer()
    await wait(1000)
    await assign_topic(partition)
    await wait (1000)
    //try more times cause there are errors with the API
    for (let i=0; i<4;i++) {
        consume_messages()
        await wait(2000)
    }
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