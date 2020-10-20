import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import *
from django.utils import timezone
from django.contrib.sessions.models import Session
from django.shortcuts import get_object_or_404

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        user = self.scope['user']
        if user.is_authenticated:
            async_to_sync(self.channel_layer.group_add)(
                str(user),
                self.channel_name
            )
            self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            str(self.scope['user']),
            self.channel_name
        )

    def receive(self, data):
        data_json = json.loads(data)
        type = data_json['type']
        if type == 'apply':
            counseler = self.scope['user'].counseler
            if counseler.online:
                pakcet = {
                    'type': type,
                    'name': data['name']
                }
                async_to_sync(self.channel_layer.group_send)(counseler, pakcet)
            else:

    def apply(self, event):
        self.send(json.dumps(event['packet']))

    def accept_counsel(self, event):
        self.send(json.dumps(event['packet']))
    
    def message(self, event):
        self.send(json.dumps(event['packet']))