# Linux-Monitor
Web Socket based Linux Monitor using Django Channels.


## About
Web Based linux monitor, implemented using django channels.

Checkout django channels documentation [Channels](https://channels.readthedocs.io/en/latest/). Some cool examples here [channels-examples](https://github.com/andrewgodwin/channels-examples) (Author **andrewgodwin**)

![alt text](https://github.com/muthuubalakan/Linux-Monitor/blob/master/docs/app.PNG)

## Installation
```bash
pip install -r requirements.txt
```

## Dependencies
1. python 3.5+
2. Linux
3. Redis (check redis installed)

## Docker
Running a container.

```bash
docker-compose up -d
```

## TODO
1. Get process with pid
2. CPU usage for every second.
3. Servies and etc.

## Use

```python
python manage.py makemigrations
python manage.py migrate 

# then start app
python manage.py runserver

# with desired port & host
python manage.py runserver localhost:8888
```
