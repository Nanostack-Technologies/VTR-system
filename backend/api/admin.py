from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Product, RetailerProductPrice, Order, OrderItem

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'role', 'distributor_link', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Role Info', {'fields': ('role', 'phone', 'distributor_link')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Role Info', {'fields': ('role', 'phone', 'distributor_link')}),
    )

class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'base_price', 'unit', 'owner', 'is_active']
    search_fields = ['name', 'category']
    list_filter = ['category', 'is_active', 'owner']

class RetailerProductPriceAdmin(admin.ModelAdmin):
    list_display = ['retailer', 'product', 'custom_price']
    search_fields = ['retailer__username', 'product__name']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price']

class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'retailer', 'distributor', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['retailer__username', 'distributor__username', 'id']
    inlines = [OrderItemInline]

admin.site.register(User, CustomUserAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(RetailerProductPrice, RetailerProductPriceAdmin)
admin.site.register(Order, OrderAdmin)
