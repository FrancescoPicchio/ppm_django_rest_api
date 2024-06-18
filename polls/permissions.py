from rest_framework import permissions

class IsCreatorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow creator of an object to edit it.
    """

    def has_permission(self, request, view):
        # Allow read-only access to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        # For write operations, we require object-level permissions
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        print("Log:checking if method is in SAFE_METHODS")
        if request.method in permissions.SAFE_METHODS:
            return True
        print("Log: checking if user is the creator")
        # Write permissions are only allowed to the creator of the object
        return obj.creator == request.user