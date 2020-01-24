# Backend

The _Backend_ service handles the dual duties of performing meme predictions as well as serving the Reddit post metadata to the _Frontend_.

## Tech Stack

- **Language**: Python
- **API Framework**: Flask
- **ML Model Framework**: Keras

## Code Structure

```
├── Dockerfile                  # Docker configuration
├── gunicorn.conf.py            # Gunicorn configuration; used for running in production
├── Pipfile                     # Pipenv dependencies file
├── Pipfile.lock                # Pipenv dependencies lock file
├── setup.cfg                   # Various dev tooling configuration
└── src/                        # Source files
    ├── config.py               # App-level configuration and constants
    ├── controllers/            # The Flask route controllers; folders are nested in a hierarchy to build the routes (see 'How the Controllers Work' work below)
    ├── main.py                 # Main entrypoint to the app
    ├── ml_models/              # Storage spot for the machine learning models
    ├── models/                 # The data models used by the controllers
    └── utils/                  # Various other app-level utilities
```

## How the Controllers Work

The following is a quick primer on how I make my **Flask** route controllers to work. 

Here's the folder hierarchy for the `controllers` folder:

```
└── controllers/
	└── api/
	    ├── api_controller.py
	    └── v1/
	        ├── memes/
	        │   ├── memes_controller.py
	        │   └── predictions/
	        │       └── predictions_controller.py
	        └── v1_controller.py
```

As you can see, there are a number of nested folders. In fact, they probably seem pretty familiar to you: the folder names dictate the route that the controller in that folder operates on.

For example, the `memes_controller` would have the route of `/api/v1/memes` because it's in the `memes` folder, which is in the `v1` folder, which is in the `api` folder.

As another example, the `predictions_controller` would have the route `/api/v1/memes/predictions`.

Each `XXX_controller.py` file registers the controller directly beneath it. For example, the `memes_controller` registers the `predictions_controller`, the `v1_controller` registers the `memes_controller`, and the `api_controller` registers the `v1_controller`.

This way, each folder of the API is a completely encapsulated piece of logic that can be moved around as need be. What enables this behaviour is the `NestableBlueprint` found in the `utils` folder.

### _Why_ do the Controllers Work This Way?

Well, I don't think that this kind of thing is standardized anywhere (or if anyone else even does this). But I just kind of got it working one day and have been using this structure for all my **Flask** apps since. 

So, ... ¯\\\_(ツ)\_/¯
