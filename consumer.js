const { Kafka, logLevel } = require('kafkajs')

//client
const host="pkc-6ojv2.us-west4.gcp.confluent.cloud"
const kafka = new Kafka({
    logLevel: logLevel.INFO,
    brokers: [`${host}:9092`],
    clientId: 'consumer',
    ssl: true,
    sasl: {
        mechanism: 'PLAIN',
        username: "PGSDHC4YCLXHOMRP",
        password: "46nPl377KiLOT4xW6uehbWuoy1tYOh17R13Fh/zkLVYVPU2Jyq6YrfSINm0mHStr",
    },
})

//consumer
const topic = 'RSSI'
const consumer = kafka.consumer({ groupId: 'RSSI-group',maxWaitTimeInMs: 1000})

async function run(){
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true })
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const prefix = `${topic}[${partition} | ${message.offset}] }`
            console.log(`- ${prefix} #${message.value}`)
            const json = JSON.parse(message.value);
            console.log(json["rssi"])
            return json["rssi"]
        },
    })
}