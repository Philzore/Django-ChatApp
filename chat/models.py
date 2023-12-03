from django.db import models
from datetime import date
from django.conf import settings

# Create your models here.

class Chat(models.Model):
    created_at = models.DateField(default=date.today)

class Message (models.Model):
    text = models.CharField(max_length=500) #text hat maximal länge von 500 Zeichen
    created_at = models.DateField(default=date.today)
    # chat = Chat Klasse verknüpfen
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='chat_message_set', default=None, blank=True, null=True)#blank erlaubt leere Werte ; Null Werte erlaubt
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='author_message_set')# letztes info für datenbank sonst Fehlermeldung
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='receiver_message_set')
