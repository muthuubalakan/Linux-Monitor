from django.shortcuts import render


def index(request):
    return render(request, "index.html")

def process(request):
    return render(request, 'process.html')