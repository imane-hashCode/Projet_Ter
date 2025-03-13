from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from ges_project_app.models import User, Student

class UserSerializer(serializers.ModelSerializer):
    level = serializers.CharField(write_only=True, required=False) 
    class Meta:
        model = User
        fields = ['id', 'username','email', 'role', 'password','level']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True}
        }
        
    def create(self, validated_data):
        
        level = validated_data.pop('level', None)
        password = validated_data.pop('password')
        
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        # Si l'utilisateur est un étudiant,
        if user.role == 'student' and level:
            Student.objects.create(user=user, level=level)
        return user
    
    def update(self, instance, validated_data):
        
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)