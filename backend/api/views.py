from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import User, Product, RetailerProductPrice, Order
from .serializers import (
    UserSerializer, ProductSerializer, 
    RetailerProductPriceSerializer, OrderSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff: # Admin sees all
            return User.objects.all()
        if user.role == 'distributor':
           # See self and linked retailers
           return User.objects.filter(distributor_link=user) | User.objects.filter(id=user.id)
        return User.objects.filter(id=user.id)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'category']
    filterset_fields = ['category', 'is_active']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff: # Admin sees all
             return Product.objects.all()
        if user.role == 'distributor':
            return Product.objects.filter(owner=user)
        elif user.role == 'retailer':
            if user.distributor_link:
                return Product.objects.filter(owner=user.distributor_link, is_active=True)
            return Product.objects.none()
        return Product.objects.none()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class RetailerProductPriceViewSet(viewsets.ModelViewSet):
    queryset = RetailerProductPrice.objects.all()
    serializer_class = RetailerProductPriceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'distributor':
            return RetailerProductPrice.objects.filter(product__owner=user)
        return RetailerProductPrice.objects.none()

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['status', 'retailer']
    ordering_fields = ['created_at', 'total_amount']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'distributor':
            return Order.objects.filter(distributor=user)
        elif user.role == 'retailer':
            return Order.objects.filter(retailer=user)
        return Order.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'retailer' and user.distributor_link:
            serializer.save(retailer=user, distributor=user.distributor_link)
        else:
            # Fallback for testing or admin
            pass
