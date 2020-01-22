# Dank Meme Classifier

This repository contains the code for the Dank Meme Classifier. The live site can be found at [https://dankmemeclassifier.com](https://dankmemeclassifier.com).

# Folder Architecture

```
├── ingestionPipeline		-> The pipeline for ingestion posts/images from the postScraper into Datastore/Cloud Storage
├── modelBuilding			-> The notebook for building the Dank Meme Classifier model
├── postScraper				-> The cron job that periodically scrapes Reddit for the latest r/dankmemes posts and feeds them to the ingestion pipeline
├── predictionPipeline		-> Handles running the scraped images through the Keras/AutoML models for production dankness predictions
└── webApp					-> The user facing web app (frontend) and backend
```

# Running the Web App Locally

Of the various components that make up the Dank Meme Classifier, only the web app portion is really suitable for running locally. To do so, you must have already installed the following:

- docker
- docker-compose

Once those are installed, you can run the following to start the web app:

```
cd webApp && make start
```

Once that's fully running, you can visit the frontend at http://localhost:3000.

## Contributing

Since this project is just a demo, it is not open for contributions. But feel free to fork it and make it your own!

## Authors

- **Devin Sit**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
