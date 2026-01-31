from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class User(AbstractUser):
    ROLE_CHOICES = (
        ('distributor', 'Distributor'),
        ('retailer', 'Retailer'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='retailer')
    phone = models.CharField(max_length=15, blank=True)
    # Retailer is linked to a distributor
    distributor_link = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='retailers', 
        limit_choices_to={'role': 'distributor'}
    )

    def __str__(self):
        return f"{self.username} ({self.role})"

class Product(models.Model):
    # Assuming products are owned by a distributor (multi-tenant support or just good practice)
    # If the system is global, distributor FK might not be needed, but spec implies distributor manages products.
    owner = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='products',
        limit_choices_to={'role': 'distributor'}
    )
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    unit = models.CharField(max_length=50) # e.g. kg, box
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class RetailerProductPrice(models.Model):
    retailer = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='custom_prices',
        limit_choices_to={'role': 'retailer'}
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    custom_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('retailer', 'product')

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('packed', 'Packed'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )
    retailer = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='placed_orders', 
        limit_choices_to={'role': 'retailer'}
    )
    distributor = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='received_orders', 
        limit_choices_to={'role': 'distributor'}
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} by {self.retailer}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2) # Price at time of order

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
