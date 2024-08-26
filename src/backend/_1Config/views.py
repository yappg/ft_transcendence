
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseBadRequest, HttpResponseForbidden
from django.http import HttpResponseServerError
from django.template import loader 

def handler404(request, exception):
    return HttpResponseNotFound('<h1> Page Not Found </h1>')
# def handler
def handler400(request, exception):
    return HttpResponseBadRequest('<h1>Bad Request</h1>')


def handler403(request, exception):
    return HttpResponseForbidden('<h1>Forbidden</h1>')


def handler500(request):
    return HttpResponseServerError('<h1>Internal Server Error</h1>')


