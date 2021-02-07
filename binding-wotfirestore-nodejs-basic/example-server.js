// example-server.js
const Servient = require("@node-wot/core").Servient
const WoTFirestoreServer = require("@hidetak/binding-wotfirestore").WoTFirestoreServer
const WoTFirestoreCodec = require("@hidetak/binding-wotfirestore").WoTFirestoreCodec

const firestoreConfig = require("./firestore-config.json")

// create server
const server = new WoTFirestoreServer(firestoreConfig)

// create Servient add Firebase binding
let servient = new Servient();
servient.addServer(server);

const codec = new WoTFirestoreCodec()
servient.addMediaType(codec)

servient.start().then((WoT) => {
    WoT.produce({
        "@context": "https://www.w3.org/2019/wot/td/v1",
        title: "MyCounter",
        properties: {
			count: {
                type: "integer",
                observable: true,
                readOnly: false        
            }
        }
    }).then((thing) => {
        console.log("Produced " + thing.getThingDescription().title);
        thing.writeProperty("count", 0)

        thing.expose().then(() => {
            console.info(thing.getThingDescription().title + " ready");
            console.info("TD : " + JSON.stringify(thing.getThingDescription()));
            thing.readProperty("count").then((c) => {
                console.log("count is " + c)
            })
        })
    })
})
