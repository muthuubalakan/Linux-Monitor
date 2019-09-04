# Linux-Monitor
Web Socket based Real-Time monitor to track linux machine. Linux monitor displays all running process, memory usage, connected devices, running services on server and so on.


## About

**Let's sync with async**

Linux monitor is a complete Django application which uses Django Channels to make Asynchronous web socket connection.

**Memory**
![alt text](https://github.com/muthuubalakan/Linux-Monitor/blob/master/docs/mem.PNG)

**Process**
![alt text](https://github.com/muthuubalakan/Linux-Monitor/blob/master/docs/process.PNG)

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

## Usage

```python
python manage.py makemigrations
python manage.py migrate 

# then start app
python manage.py runserver

# with desired port & host
python manage.py runserver localhost:8888
```

### Further reading

1. Checkout django channels documentation [Channels](https://channels.readthedocs.io/en/latest/). Some cool examples here [channels-examples](https://github.com/andrewgodwin/channels-examples) (Author **andrewgodwin**)

2. **Highly recommended**. Have a look at the documentation [Linux documentation](https://www.kernel.org/doc/Documentation/filesystems/proc.txt)
