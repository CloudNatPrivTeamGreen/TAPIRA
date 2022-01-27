FROM python:3.8-slim-buster

ENV FLASK_APP=tapira.py

WORKDIR /app

COPY . .

RUN pip3 install -r requirements.txt

EXPOSE 5000

CMD ["gunicorn","--bind","0.0.0.0:5000","backend:app"]





