from rest_framework import serializers
from .models import User, Product, RetailerProductPrice, Order, OrderItem

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone', 'distributor_link']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = self.Meta.model(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class RetailerProductPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetailerProductPrice
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    retailer_name = serializers.ReadOnlyField(source='retailer.username')

    class Meta:
        model = Order
        fields = ['id', 'retailer', 'retailer_name', 'distributor', 'status', 'total_amount', 'created_at', 'items']
        read_only_fields = ['total_amount', 'retailer', 'distributor'] 

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        # retailer and distributor are set in perform_create in ViewSet, but here we need them to calculate price.
        # Actually ModelSerializer doesn't pass them in validated_data if they are read_only and not in input.
        # We need to pass them via save() in view, which adds them to validated_data or instance?
        # unique logic: create() receives validated_data.
        
        order = Order.objects.create(**validated_data)
        total = 0
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            
            # Pricing Logic
            price = product.base_price
            if order.retailer:
                qs = RetailerProductPrice.objects.filter(retailer=order.retailer, product=product)
                if qs.exists():
                    price = qs.first().custom_price
            
            OrderItem.objects.create(order=order, product=product, quantity=quantity, price=price)
            total += price * quantity
        
        order.total_amount = total
        order.save()
        return order
