from rest_framework import serializers

class YourRequestSerializer(serializers.Serializer):
    senders = serializers.CharField(max_length=100)