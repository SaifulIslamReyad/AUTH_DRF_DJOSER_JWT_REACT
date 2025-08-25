from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserProfileUpdateSerializer
from django.contrib.auth import get_user_model
from icecream import ic

User = get_user_model()


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update user profile information (name)
    """
    ic(f"User authenticated: {request.user.is_authenticated}")
    ic(f"User: {request.user}")
    ic(f"Request data: {request.data}")
    
    user = request.user
    serializer = UserProfileUpdateSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        ic(f"Profile updated successfully: {serializer.data}")
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    ic(f"Serializer errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
