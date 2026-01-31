import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import User, Product, RetailerProductPrice

def run():
    print("Seeding database...")
    
    # Create Distributor
    dist, created = User.objects.get_or_create(username='distributor', defaults={'email': 'dist@example.com', 'role': 'distributor'})
    if created:
        dist.set_password('password123')
        dist.save()
        print(f"Created Distributor: {dist.username} / password123")
    else:
        print("Distributor already exists.")

    # Create Retailer
    ret, created = User.objects.get_or_create(username='retailer', defaults={'email': 'ret@example.com', 'role': 'retailer', 'distributor_link': dist})
    if created:
        ret.set_password('password123')
        ret.save()
        print(f"Created Retailer: {ret.username} / password123")
    else:
        print("Retailer already exists.")

    # Create Products
    p1, _ = Product.objects.get_or_create(owner=dist, name='Sugar', defaults={'category': 'Groceries', 'unit': 'kg', 'base_price': 40.00})
    p2, _ = Product.objects.get_or_create(owner=dist, name='Rice', defaults={'category': 'Groceries', 'unit': 'kg', 'base_price': 60.00})
    p3, _ = Product.objects.get_or_create(owner=dist, name='Oil', defaults={'category': 'Groceries', 'unit': 'litre', 'base_price': 120.00})
    print(f"Ensured Products exist: {p1.name}, {p2.name}, {p3.name}")

    # Create Custom Price
    item, created = RetailerProductPrice.objects.get_or_create(retailer=ret, product=p1, defaults={'custom_price': 38.00})
    if created:
        print(f"Created Custom Price for {ret.username} on {p1.name}: 38.00")

    print("Database seeded successfully!")

if __name__ == '__main__':
    run()
