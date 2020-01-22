const fetch = require("node-fetch");
const Datastore = require("@google-cloud/datastore");
const {PROJECT_ID} = require("config");

const datastore = new Datastore({projectId: PROJECT_ID}) ;

class KerasPrediction {
    constructor({imageHash = "", prediction = 0}) {
        this.imageHash = imageHash;
        this.prediction = prediction;
    }

    entity() {
        const kind = "DankKerasPrediction";
        const key = datastore.key([kind, this.imageHash]);

        return {
            key,
            data: {
                imageHash: this.imageHash,
                prediction: this.prediction
            },
            excludeFromIndexes: ["prediction"]
        }
    }

    save() {
        datastore.upsert(this.entity());
    }

    static async getPredictions(posts) {
        const response = await fetch(process.env.KERAS_PREDICTION_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({posts})
        });

        const predictions = (await response.json())["predictions"];

        return posts.map((post, index) => (
            new KerasPrediction({
                imageHash: post.imageHash,
                prediction: predictions[index]
            })
        ));
    }
}

module.exports = KerasPrediction;
