from django.http import HttpResponseRedirect
from django.shortcuts import redirect, render
from django.contrib.auth import authenticate, login , logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core import serializers
from django.contrib.auth.models import User
from django.contrib import messages
from .models import Chat,Message

# Create your views here.
@login_required(login_url='/login/')

def logout_user(request):
    """
    logout user and redirect to login view
    """
    logout(request)
    return redirect('login')

def index(request):
    """
    This is a view to render the chat html 
    """
    if request.method == 'POST':
        print("Received data : " + request.POST['textmessage'])
        myChat = Chat.objects.get(id=1)
        new_messages = Message.objects.create(text=request.POST['textmessage'], chat=myChat, author=request.user, receiver= request.user)
        serialized_obj = serializers.serialize('json', [ new_messages, ])
        return JsonResponse(serialized_obj[1:-1], safe=False)#löscht erstes und voletztes Zeichen damit es kein Array mehr ist sondern ein JSON
    
    chatMessages = Message.objects.filter(chat__id=1)
    return render(request, 'chat/index.html', {'messages':chatMessages})

def login_view(request):
    """
    login and response the success status
    """
    if request.GET.get('next'):
        redirect = request.GET.get('next')
    else:
        redirect = '/chat/'

    if request.method == 'POST':
        user = authenticate(username=request.POST.get('username'), password= request.POST.get('userpassword'))
        if user:
            login(request,user)
            loginJson = {'success' : True , 'pageTitle': redirect}
            return JsonResponse(loginJson)
        else:
            return JsonResponse({'success' : False, 'pageTitle': 'registration/login.html'}) 

    return render(request, 'registration/login.html', {'redirect' : redirect})

def register_view(request):
    """
    register new user return success status
    """
    if request.method == 'POST':
        try:
            username = request.POST.get('username')
            email = request.POST.get('useremail')
            password = request.POST.get('userpassword')
            first_name = request.POST.get('userfirstname')
            last_name = request.POST.get('userlastname')

            new_user = User.objects.create_user(username=username,
                                            email=email,
                                            password=password)
                                             
            new_user.first_name = first_name
            new_user.last_name = last_name
            new_user.save()
            return JsonResponse({'success' : True})
        except Exception as e:
            return JsonResponse({'success' : False})
            
    return render(request, 'registration/registration.html')
