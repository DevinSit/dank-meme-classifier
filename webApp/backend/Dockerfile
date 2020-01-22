# Apparently getting pandas/numpy installed on Alpine Linux is a pain because it has to build them from source:
# https://stackoverflow.com/questions/49037742/why-does-it-take-ages-to-install-pandas-on-alpine-linux
FROM python:3.6.5

ENV PYTHONPATH=./src
ENV MYPYPATH=/app/src

# Install Pipenv
RUN pip install pipenv

# Where the Flask app lives
RUN mkdir /app
WORKDIR /app/

# Install dependencies first
COPY Pipfile Pipfile.lock /app/
RUN pipenv install --dev --system --deploy

# Copy over the rest of the app
ADD . /app

# Where the GCP service account is stored in development
RUN mkdir /gcp

EXPOSE 5000

CMD ["gunicorn", "--config", "gunicorn.conf.py", "main:app"]
