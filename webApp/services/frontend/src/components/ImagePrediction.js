import React from "react";
import classNames from "classnames";
import Spinner from "images/loading.gif";
import "./ImagePrediction.scss";

const ImagePrediction = ({prediction = 0.0, predictionType = "", loading = false}) => {
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
                                    `Dank (${normalizedPrediction}% likely)`
                                ) : (
                                    `Not Dank (${normalizedPrediction}% likely)`
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
