from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UserAccount

class UserAccountAdmin(UserAdmin):
    model = UserAccount
    list_display = ('email', 'name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'is_superuser')
    search_fields = ('email', 'name')
    ordering = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('name',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser')}
        ),
    )

admin.site.register(UserAccount, UserAccountAdmin)
