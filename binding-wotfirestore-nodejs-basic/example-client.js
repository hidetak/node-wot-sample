// example-client.js
const Servient = require("@node-wot/core").Servient
const WoTFirestoreClientFactory = require("@hidetak/binding-wotfirestore").WoTFirestoreClientFactory
const Helpers = require("@node-wot/core").Helpers
const WoTFirestoreCodec = require("@hidetak/binding-wotfirestore").WoTFirestoreCodec

const firestoreConfig = require("./firestore-config.json")

let servient = new Servient()
const clientFactory = new WoTFirestoreClientFactory(firestoreConfig)
servient.addClientFactory(clientFactory)

const codec = new WoTFirestoreCodec()
servient.addMediaType(codec)
  
let wotHelper = new Helpers(servient)
wotHelper.fetch("wotfirestore://sample-host/MyCounter").then(async (td) => {
    try {
        servient.start().then((WoT) => {
            WoT.consume(td).then((thing) => {
                // read a property "count" and print the value
                thing.readProperty("count").then((s) => {
                    console.log(s);
                })
            })
        })
    } catch (err) {
        console.error("Script error:", err)
    }
}).catch((err) => { console.error("Fetch error:", err) })
