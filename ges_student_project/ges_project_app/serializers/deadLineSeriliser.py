from rest_framework import serializers
from ges_project_app.models import Deadline
from rest_framework.response import Response

class DeadlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deadline
        fields = ['id', 'type', 'limite_date']
        read_only_fields = ['id']
        extra_kwargs = {
            'type': {'required': True},
            'limite_date': {'required': True}
        }
    def create(self, validated_data):
        """
        Créer une nouvelle instance de Deadline.
        """
        if Deadline.objects.filter(type="voeux").exists():
            return Response({"error": "Une date limite pour les vœux existe déjà."}, status=400)
        return Deadline.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        """
        Mise à jour d'un deadline.
        """
        instance.type = validated_data.get('type', instance.type)
        instance.limite_date = validated_data.get('limite_date', instance.limite_date)
        instance.save()
        return instance