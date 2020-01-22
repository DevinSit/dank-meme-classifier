from flask import Flask, jsonify
import logging
import requests

logger = logging.getLogger()

POST_SCRAPER_URL = "https://us-central1-devinsit-personal-projects.cloudfunctions.net/postScraperFunction"
INGESTION_PIPELINE_URL = "https://us-central1-devinsit-personal-projects.cloudfunctions.net/ingestionPublisherFunction"

app = Flask(__name__)


@app.route("/post-scraper")
def post_scraper():
    scraper_response = requests.get(POST_SCRAPER_URL)
    data = {"posts": scraper_response.json()["posts"]}

    logger.debug(data)
    pipeline_response = requests.post(INGESTION_PIPELINE_URL, json=data)
    logger.debug(pipeline_response.json())

    return jsonify({"status": "success", "message": "Queued the latest posts for processing."})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
