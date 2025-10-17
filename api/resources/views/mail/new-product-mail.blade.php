<!DOCTYPE html>
<html>

<head>
    <title>Exclusive Launch: Meet Your New Favorite Product!</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            background-color: #f8f9fa;
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 10px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: #007bff;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }

        .header h2 {
            margin: 0;
            font-weight: 700;
            font-size: 24px;
        }

        .product-image {
            width: 100%;
            height: auto;
            display: block;
        }

        .content {
            padding: 20px;
            text-align: center;
        }

        .content h3 {
            color: #333;
            font-weight: 700;
        }

        .price {
            color: #28a745;
            font-size: 20px;
            font-weight: 600;
            margin: 10px 0;
        }

        .product-description {
            color: #555;
            font-size: 16px;
            line-height: 1.5;
        }

        .cta {
            text-align: center;
            margin-top: 20px;
        }

        .cta a {
            background-color: #ff5722;
            color: #ffffff;
            font-size: 18px;
            font-weight: 600;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
        }

        .cta p {
            margin-top: 10px;
            color: #dc3545;
            font-weight: 600;
        }

        .features {
            background: #f1f1f1;
            padding: 20px;
            border-radius: 10px;
            text-align: left;
            margin: 20px;
        }

        .features h4 {
            color: #007bff;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .features ul {
            padding-left: 20px;
        }

        .features li {
            font-size: 16px;
            color: #444;
            margin-bottom: 6px;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            padding: 20px;
        }

        .footer a {
            color: #007bff;
            text-decoration: none;
        }

        /* Responsive Design */
        @media (max-width: 576px) {
            .container {
                padding: 10px;
            }

            .content {
                padding: 15px;
            }

            .cta a {
                font-size: 16px;
                padding: 10px 20px;
            }
        }
    </style>
</head>

<body>

    <div class="container">
        <!-- Header Section -->
        <div style="background-color: #007bff; padding: 20px; text-align: center; color: white; font-family: 'Inter', sans-serif;">
            <h1 style="margin: 0; font-size: 24px;">Hello {{ $customer->name }}</h1>
            <p style="margin: 0; font-size: 16px;">🌍 African Hub Market. Bringing You the Best from Africa</p>
        </div>

        <!-- Email Header -->
        <div class="header">
            <h2>🚀 Introducing: {{ $product->title }}!</h2>
        </div>

        <!-- Product Image -->
        <img src="{{ $product->images[0] ?? 'default-image.jpg' }}" class="product-image" alt="Product Image">

        <!-- Product Details -->
        <div class="content">
            <h3>{{ $product->title }}</h3>
            <div class="price">Only Limited Offer Availale</div>
            <p class="product-description">{{ \Illuminate\Support\Str::limit($product->description, 120) }}</p>
        </div>

        <!-- Why Buy This Product? -->
        <div class="features">
            <h4>Why You'll Love This</h4>
            <ul>
                <li>Premium Quality – Crafted for long-lasting durability.</li>
                <li>Limited Stock – Once it’s gone, it’s gone.</li>
                <li>Highly Rated – Loved by thousands of customers.</li>
                <li>Exclusive Deal – Special price for early buyers.</li>
            </ul>
        </div>

        <!-- Call to Action -->
        <div class="cta">
            <a href="{{ url('/product/' . $product->slug) }}">🛒 Get Yours Now</a>
            <p>Hurry! This offer won’t last forever.</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Follow us for exclusive deals:</p>
            <a href="#">Facebook</a> | <a href="#">Instagram</a> | <a href="#">Twitter</a>
            <p>If you no longer wish to receive these emails, <a href="#">unsubscribe here</a>.</p>
        </div>
    </div>

</body>

</html>