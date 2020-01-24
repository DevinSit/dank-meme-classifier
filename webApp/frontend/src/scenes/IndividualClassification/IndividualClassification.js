import React from "react";
import axios from "axios";
import {BACKEND_URL} from "config";
import IndividualClassificationLayout from "./IndividualClassificationLayout";
import "./IndividualClassification.scss";

/* The scene component that is shown under the 'Classify your own' tab. */
export default class IndividualClassification extends React.Component {
    state = {
        loading: false,
        file: "",
        prediction: null
    }

    onImageDrop = async (files) => {
        if (files.length === 0) {
            return;
        }

        this.setState({loading: true});

        // Read in the image file
        const reader = new FileReader();
        const file = files[0];
        reader.readAsDataURL(file);

        // Once the file is loaded, add it to state so that it can be shown in the preview.
        reader.onloadend = () => {
            this.setState({file: reader.result});
        };

        // Prepare the file to be sent to the backend
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(`${BACKEND_URL}/api/v1/memes/predictions/file`, formData, {
            header: {"Content-Type": "multipart/form-data"}
        });

        const {prediction, status} = response.data;

        // Time to show the user the prediction
        if (status === "success") {
            this.setState({prediction, loading: false});
        }
    };

    render() {
        const {loading, file, prediction} = this.state;

        return (
            <IndividualClassificationLayout
                loading={loading}
                file={file}
                prediction={prediction}
                onImageDrop={this.onImageDrop}
            />
        );
    }
}
