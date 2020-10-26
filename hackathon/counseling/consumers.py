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

    def receive(self, text_data):
        data = json.loads(text_data)
        _type = data['type']
        user = self.scope['user']
        if _type == 'apply':
            counseler = user.counseler
            counseler.counseler_id = user.id
            counseler.save()
            application = {
                'type': 'apply',
                'name': user.name,
                'company': user.company,
                'reason': data['application']['reason']
            }
            async_to_sync(self.channel_layer.group_send)(
                str(user.counseler),
                {
                    "type": "apply",
                    "application": application,
                },
            )
        elif _type == 'accept':
            packet = {
                'type': '_accept',
                'class': 'accept'
            }
            async_to_sync(self.channel_layer.group_send)(
                str(user.counseler),
                {
                    "type": "counsel_accept",
                    "packet": packet,
                },
            )
        elif _type == 'message':
            async_to_sync(self.channel_layer.group_send)(
                str(user.counseler),
                {
                    "type": "message",
                    "message": data['message'],
                },
            )
        elif _type == 'exit':
            async_to_sync(self.channel_layer.group_send)(
                str(user.counseler),
                {
                    "type": "exit"
                },
            )

    def apply(self, event):
        application = event['application']
        self.send(text_data=json.dumps({
            'type': 'apply',
            'application':application
        }))
    def counsel_accept(self, event):
        self.send(text_data=json.dumps({
            'type': 'accept',
            'class': 'accept'
        }))
    def message(self, event):
        self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message']
        }))
    def exit(self, event):
        self.send(text_data=json.dumps({
            'type': 'accept',
            'class': 'exit'
        }))
