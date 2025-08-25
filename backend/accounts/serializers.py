from djoser.serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth import get_user_model
User = get_user_model()


class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'password', 'name')


class UserProfileUpdateSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name')
        read_only_fields = ('id', 'email')
