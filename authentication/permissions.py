from rest_framework import permissions


class RolePermission(permissions.BasePermission):
    allowed_roles = []

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in self.allowed_roles


class IsAdmin(RolePermission):
    allowed_roles = ['admin']


class IsOperator(RolePermission):
    allowed_roles = ['admin', 'operator']


class IsViewer(RolePermission):
    allowed_roles = ['admin', 'operator', 'viewer']


class IsGuest(RolePermission):
    allowed_roles = ['admin', 'operator', 'viewer', 'guest']
