import json 
from channels.generic.websocket import WebsocketConsumer


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.send(
            text_data=json.dumps({
                'type': 'cnx_4G machy 2g sir t2wd',
                'message': 'Hello first connection'
            })
        )
        