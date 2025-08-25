from django.urls import path, include, re_path
from django.views.generic import TemplateView
from accounts.views import update_profile
from django.contrib import admin

urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.social.urls')),
    path('accounts/profile/', update_profile, name='update_profile'),
    path("admin/", admin.site.urls),
]

urlpatterns += [re_path(r'^.*',
                        TemplateView.as_view(template_name="index.html"))]
