import React from "react";
import ReactDropzone from "react-dropzone";
import ImagePrediction from "components/ImagePrediction";

const IndividualClassificationLayout = ({loading, file, prediction, onImageDrop}) => (
    <div className="individual-classification">
        <div className="image-dropzone">
            <ImageDropzone onDrop={onImageDrop} />
        </div>

        <div className="classification-results">
            <div className="classification-image-container">
                {
                    file ? (
                        <img className="classification-image" src={file} alt="preview" />
                    ) : (
                        <div className="classification-image-empty">Preview</div>
                    )
                }
            </div>

            <div className="classification-predictions">
                <ImagePrediction prediction={prediction} loading={loading} />
            </div>
        </div>
    </div>
);

const ImageDropzone = ({onDrop}) => (
    <ReactDropzone
        accept="image/jpeg, image/png"
        onDrop={onDrop}
        className="dropzone"
    >
        <div className="dropzone-text">Drop a meme (jpg, png) to classify</div>
    </ReactDropzone>
);

export default IndividualClassificationLayout;
