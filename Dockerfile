FROM python:3.6-stretch
ENV PYTHONUNBUFFERED 1
ENV REDIS_HOST "redis"
RUN mkdir /monitor
WORKDIR /monitor
ADD . /monitor/
#RUN pip3 install virualenv
RUN bash && virtualenv nenv && . /monitor/nenv/bin/activate
RUN pip3 install -r requirements.txt
RUN python manage.py migrate

