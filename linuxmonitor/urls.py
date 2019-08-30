from django.urls import path
from django.contrib import admin
from django.contrib.auth.views import logout
from monitor.views import index


urlpatterns = [
    path('', index),
    path('accounts/logout/', logout),
    path('admin/', admin.site.urls),
]