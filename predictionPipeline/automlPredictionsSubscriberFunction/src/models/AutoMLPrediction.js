const AutoML = require("@google-cloud/automl");
const Datastore = require("@google-cloud/datastore");
const {Storage} = require("@google-cloud/storage");
const {IMAGES_BUCKET, MODEL_ID, MODEL_LOCATION, PROJECT_ID} = require("config");

const automl = new AutoML.v1beta1.PredictionServiceClient();
const datastore = new Datastore({projectId: PROJECT_ID}) ;
const storage = new Storage();

const model = automl.modelPath(PROJECT_ID, MODEL_LOCATION, MODEL_ID);
const bucket = storage.bucket(IMAGES_BUCKET);

class AutoMLPrediction {
    constructor({imageHash = "", prediction = 0}) {
        this.imageHash = imageHash;
        this.prediction = prediction;
    }

    entity() {
        const kind = "DankAutoMLPrediction";
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
        const imageHashes = posts.map((post) => post.imageHash);
        const predictions = [];

        for (let imageHash of imageHashes) {
            const data = await bucket.file(`${imageHash}.jpg`).download();
            const image = data[0];

            const imageBytes = Buffer.from(image).toString("base64");

            const request = {
                name: model,
                payload: {
                    image: {
                        imageBytes
                    }
                }
            };

            const response = await automl.predict(request);
            const prediction = parsePredictionPayload(response[0].payload[0]);

            predictions.push(new AutoMLPrediction({imageHash, prediction}));
        }

        return predictions;
    }
}

const parsePredictionPayload = (payload) => {
    const {score} = payload.classification;

    if (payload.displayName === "not_dank") {
        return 1 - score;
    } else {
        return score;
    }
};

module.exports = AutoMLPrediction;
