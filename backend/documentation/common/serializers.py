from rest_framework import serializers


class SuccessSerializer(serializers.Serializer):
    status = serializers.IntegerField(default=200)
    message = serializers.CharField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["data"] = serializers.DictField(
            child=serializers.JSONField(),
            help_text="The response payload",
        )


class ErrorSerializer(serializers.Serializer):
    status = serializers.IntegerField(default=500)
    message = serializers.CharField(default="Internal Server Error")


class ValidationErrorSerializer(serializers.Serializer):
    status = serializers.IntegerField(default=400)
    message = serializers.CharField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["errors"] = serializers.DictField(
            child=serializers.ListField(child=serializers.CharField()),
            help_text="Field names mapped to list of validation messages",
        )
