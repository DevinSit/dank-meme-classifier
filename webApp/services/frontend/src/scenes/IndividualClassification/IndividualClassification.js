import React from "react";
import axios from "axios";
import {BACKEND_URL} from "config";
import {registerGAEvent} from "utils/UserTracking";
import IndividualClassificationLayout from "./IndividualClassificationLayout";
import "./IndividualClassification.css";

const PREDICTION_POLLING = 1500;  // 1.5 seconds

export default class IndividualClassification extends React.Component {
    state = {
        loading: false,
        file: "",
        kerasPrediction: null,
        autoMLPrediction: null
    }

    onImageDrop = async (files) => {
        if (files.length === 0) {
            return;
        }

        this.setState({loading: true});

        const reader = new FileReader();
        const file = files[0];
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            this.setState({file: reader.result});
        };

        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(`${BACKEND_URL}/api/v1/memes/image`, formData, {
            header: {"Content-Type": "multipart/form-data"}
        });

        const {imageHash} = response.data;
        this.startPolling(imageHash);

        registerGAEvent({
            category: "Interaction",
            action: "Uploaded an image for predictions",
            label: imageHash
        });
    };

    startPolling = (imageHash) => {
        this.timer = setInterval(
            () => this.getImagePredictions(imageHash),
            PREDICTION_POLLING
        );
    };

    getImagePredictions = async (imageHash) => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/memes/image/${imageHash}/predictions`);
        const {data} = response;

        if (data.status === "success") {
            clearInterval(this.timer);

            const {kerasPrediction, autoMLPrediction} = data.predictions;
            this.setState({kerasPrediction, autoMLPrediction, loading: false});
        }
    };

    render() {
        const {loading, file, kerasPrediction, autoMLPrediction} = this.state;

        return (
            <IndividualClassificationLayout
                loading={loading}
                file={file}
                kerasPrediction={kerasPrediction}
                autoMLPrediction={autoMLPrediction}
                onImageDrop={this.onImageDrop}
            />
        );
    }
}
