import React from "react";
import classNames from "classnames";
import Spinner from "images/loading.gif";
import "./ImagePrediction.css";

const ImagePrediction = ({prediction, predictionType, loading}) => {
    const normalizedPrediction = Math.round(prediction * 100);
    const isDank = normalizedPrediction >= 50;

    return (
        <div className="post-prediction__container">
            <h4 className="post-prediction__header">{predictionType} Prediction</h4>
            {
                loading ? (
                    <img
                        className="loading-spinner"
                        src={Spinner}
                        alt="loading spinner"
                    />
                ) : (
                    prediction ? (
                        <p className={classNames("post-prediction", {"post-prediction--dank": isDank})}>
                            {
                                isDank ? (
                                    `Dank (${normalizedPrediction}%)`
                                ) : (
                                    `Not Dank (${normalizedPrediction}%)`
                                )
                            }
                        </p>
                    ) : (
                        <p className="post-prediction">N/A</p>
                    )
                )
            }
        </div>
    );
};

export default ImagePrediction;
