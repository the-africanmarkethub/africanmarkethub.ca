<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\TutorialController;
use App\Http\Controllers\Authentication\Login;
use App\Http\Controllers\Vendor\ItemController;
use App\Http\Controllers\Vendor\ShopController;
use App\Http\Controllers\Authentication\Register;
use App\Http\Controllers\Vendor\CouponController;
use App\Http\Controllers\Vendor\FinanceController;
use App\Http\Controllers\Vendor\PaymentController;
use App\Http\Controllers\Authentication\VerifyEmail;
use App\Http\Controllers\Authentication\VerifyPhone;
use App\Http\Controllers\Customer\ProfileController;
use App\Http\Controllers\Vendor\PromotionController;
use App\Http\Controllers\Customer\WishlistController;
use App\Http\Controllers\Vendor\WithdrawalController;
use App\Http\Controllers\Administration\FaqController;
use App\Http\Controllers\Authentication\ResetPassword;
use App\Http\Controllers\Administration\SizeController;
use App\Http\Controllers\Administration\UserController;
use App\Http\Controllers\Authentication\ForgetPassword;
use App\Http\Controllers\Customer\PreferenceController;
use App\Http\Controllers\Administration\ColorController;
use App\Http\Controllers\Administration\LoginController;
use App\Http\Controllers\Customer\AddressBookController;
use App\Http\Controllers\Customer\CommunicationSettings;
use App\Http\Controllers\Administration\BannerController;
use App\Http\Controllers\Administration\CountryController;
use App\Http\Controllers\Administration\CategoryController;
use App\Http\Controllers\Administration\DashboardController;
use App\Http\Controllers\Administration\AppSettingController;
use App\Http\Controllers\Administration\CommissionController;
use App\Http\Controllers\Administration\TransactionController;
use App\Http\Controllers\Administration\NotificationController;
use App\Http\Controllers\Administration\SubscriptionController;
use App\Http\Controllers\Vendor\IdentityVerificationController;
use App\Http\Controllers\Administration\PolicySettingController;
use App\Http\Controllers\Administration\AdminProfileController;
use App\Http\Controllers\Administration\PaymentMethodsController;

Route::get('/', function () {
    return response()->json(['message' => 'API is working']);
});

Route::prefix('/v1')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::delete('/user/delete/{id}', [UserController::class, 'delete']);
    Route::delete('/user/force-delete/{id}', [UserController::class, 'forceDelete']);
});

// Homepage and Public routes
Route::prefix('v1')->group(function () {
    Route::post('/login', [Login::class, 'login']);
    Route::post('/continue-with-google', [Login::class, 'continueWithGoogle']);
    Route::post('/register', [Register::class, 'register']);
    Route::post('/verify-email', [VerifyEmail::class, 'verifyEmailOtp']);
    Route::post('/verify-phone', [VerifyPhone::class, 'verifyPhoneOtp']);
    Route::post('/forget-password', [ForgetPassword::class, 'forgetPassword']);
    Route::post('/reset-password', [ResetPassword::class, 'resetPassword']);

    // Unathenticated route - Ecommerce Activities
    Route::get('/categories', [CategoryController::class, 'getCategoryByType']);
    Route::get('/banners', [BannerController::class, 'listBanners']);

    Route::get('/category/products/{category_id}', [CategoryController::class, 'showCategoryProducts']);
    Route::get('/preferences', [PreferenceController::class, 'index']);
    Route::get('/location', [CountryController::class, 'location']);
    Route::get('/subscriptions', [SubscriptionController::class, 'index']);
    Route::get('/shops', [ShopController::class, 'index']);
    Route::get('/shop/products/{slug}', [ShopController::class, 'showShopProduct']);
    Route::get('/items', [ItemController::class, 'index']);
    Route::get('/product/{slug}', [ItemController::class, 'show']);
    Route::post('/product/search', [ItemController::class, 'searchProducts']);
    Route::get('/products/recommended', [ItemController::class, 'recommendedProducts']);
    Route::get('/products/trending', [PreferenceController::class, 'trendingProduct']);
    Route::get('/products/deals', [CouponController::class, 'index']);
    Route::get('/coupon{couponCode}/verify', [CouponController::class, 'verifyDiscount']);
    Route::get('/products/reviews', [ReviewController::class, 'allReviews']);
    Route::post('/shipping/rates', [ShippingController::class, 'getShippingRates']);
    Route::any('/shipping/webhook', [ShippingController::class, 'getEasypostWebhook']);
    Route::get('/payment-methods', [PaymentMethodsController::class, 'getPaymentMethods']);

    // FAQs
    Route::get('/faqs', [FaqController::class, 'index']);
    Route::get('/tutorials', [TutorialController::class, 'index']);

    // Webhooks
    // Clik2Pay callback (webhook, server → backend)
    Route::post('/webhook/clik2pay', [WebhookController::class, 'webhook'])
        ->name('clik2pay.callback');

    // Success redirect (frontend UX)
    Route::get('/checkout/{order}/success', [CheckoutController::class, 'success'])
        ->name('checkout.success');

    // Cancel redirect (frontend UX)
    Route::get('/checkout/{order}/cancel', [CheckoutController::class, 'cancel'])
        ->name('checkout.cancel');
});

// Admin route
Route::prefix('v1/admin')->group(function () {
    Route::post('/login', [LoginController::class, 'login']);
    Route::post('/forget-password', [LoginController::class, 'forgetPassword']);
    Route::post('/confirm-reset-code', [LoginController::class, 'resetCodeConfirmation']);
    Route::post('/reset-password', [LoginController::class, 'resetPassword']);
});

Route::middleware(['auth:sanctum'])->prefix('v1/admin')->group(function () {
    # Admin invite
    Route::get('/admin-stats', [LoginController::class, 'listAdmins']);
    Route::post('/admin-invite', [LoginController::class, 'invite']);
    Route::delete('/admin/{id}/delete', [LoginController::class, 'deleteAdmin']);

    # Authentication
    Route::post('/change-password', [LoginController::class, 'changePassword']);
    Route::post('/update-profile', [AdminProfileController::class, 'updateProfile']);

    //Stats
    Route::get('/stats', [DashboardController::class, 'getStats']);
    Route::get('/stats/graph', [DashboardController::class, 'getSalesGraphData']);
    Route::get('/reviews', [DashboardController::class, 'listReviews']);
    Route::get('/unreviews', [DashboardController::class, 'listUnreviewedOrders']);
    Route::get('/review-stats', [DashboardController::class, 'reviewsStats']);
    Route::get('/product-graph', [DashboardController::class, 'getItemGraphData']);
    Route::get('/most-selling-products', [DashboardController::class, 'getSellingProducts']);
    Route::get('/most-selling-products-graph', [DashboardController::class, 'getSellingProductsGraphData']);
    Route::get('/products', [DashboardController::class, 'getItemProducts']);
    Route::patch('/product/{id}/status/{status}', [DashboardController::class, 'updateProductStatus']);
    Route::get('/orders', [DashboardController::class, 'getRecentOrders']);
    Route::get('/bookings', [DashboardController::class, 'getRecentBookings']);
    Route::get('/orders/stats', [DashboardController::class, 'orderStats']);
    Route::get('/bookings/stats', [DashboardController::class, 'bookingStats']);
    Route::get('/orders/graph', [DashboardController::class, 'orderGraph']);
    Route::get('/bookings/graph', [DashboardController::class, 'bookingGraph']);
    Route::get('/orders/user/{id}', [DashboardController::class, 'getUserOrders']);
    Route::get('/orders/{id}', [DashboardController::class, 'getOrderDetails']);
    Route::get('/bookings/{id}', [DashboardController::class, 'getBookingDetails']);
    Route::put('/orders/{id}/status', [DashboardController::class, 'changeOrderStatus']);
    Route::put('/orders/{id}/payment-status', [DashboardController::class, 'updatedOrderPaymentStatus']);

    Route::get('/preferences', [PreferenceController::class, 'index']);

    // App Settings
    Route::post('/app-settings', [AppSettingController::class, 'create']);
    Route::get('/app-setting', [AppSettingController::class, 'index']);
    // Country
    Route::post('/country/create', [CountryController::class, 'create']);
    Route::get('/countries', [CountryController::class, 'index']);
    Route::put('/country/update', [CountryController::class, 'update']);
    Route::delete('/country/delete', [CountryController::class, 'delete']);

    // State
    Route::post('/state/create', [CountryController::class, 'createState']);
    Route::get('/states', [CountryController::class, 'indexState']);
    Route::put('/state/update', [CountryController::class, 'updateState']);
    Route::delete('/state/delete', [CountryController::class, 'deleteState']);

    // City
    Route::post('/city/create', [CountryController::class, 'createCity']);
    Route::get('/cities', [CountryController::class, 'indexCity']);
    Route::put('/city/update', [CountryController::class, 'updateCity']);
    Route::delete('/city/delete', [CountryController::class, 'deleteCity']);

    // Banners
    Route::get('/banners', [BannerController::class, 'listBanners']);
    Route::post('/banners/create', [BannerController::class, 'storeBanner']);
    Route::delete('/banners/{banner_id}/delete', [BannerController::class, 'deleteBanner']);
    Route::post('/banner/type/create', [BannerController::class, 'storeBannerType']);
    Route::get('/banner/type', [BannerController::class, 'listBannerType']);
    Route::delete('/banner/type/{banner_id}/delete', [BannerController::class, 'deleteBannerType']);

    // Category
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/category-list', [CategoryController::class, 'categoryList']);
    Route::get('/category-analytics', [CategoryController::class, 'categoryAnalytics']);
    Route::get('/subcategories', [CategoryController::class, 'subCategoryList']);
    Route::post('/category/{categoryId}/update', [CategoryController::class, 'update']);
    Route::delete('/category/{categoryId}/delete', [CategoryController::class, 'delete']);

    // Shop
    Route::get('/shops', [ShopController::class, 'list']);
    Route::get('/shops-analytics', [ShopController::class, 'shopAnalytics']);
    Route::get('/shops-metrics', [ShopController::class, 'shopMetrics']);
    Route::get('/shops/most-selling', [ShopController::class, 'mostSellingShops']);


    Route::apiResource('subscriptions', SubscriptionController::class);
    Route::apiResource('sizes', SizeController::class);
    Route::apiResource('colors', ColorController::class);

    // Notification
    Route::post('/notification/send', [NotificationController::class, 'send']);
    Route::get('/notifications', [NotificationController::class, 'lists']);
    Route::delete('/notification/delete', [NotificationController::class, 'delete']);

    // Shipping Webhook
    Route::put('/promotions/{id}/approve', [PromotionController::class, 'approve']);
    Route::put('/promotions/{id}/expire', [PromotionController::class, 'expire']);

    //Policy Settings
    Route::get('/policy/{type}', [PolicySettingController::class, 'getPolicy']);
    Route::post('/policy', [PolicySettingController::class, 'storePolicy']);

    // Ticketing system
    Route::get('/tickets', [TicketController::class, 'getAllTickets']);
    Route::get('/ticket/{ticketId}/show', [TicketController::class, 'getTicketDetail']);
    Route::put('/ticket/{ticketId}/update', [TicketController::class, 'updateTicketStatus']);
    Route::post('/ticket/reply', [TicketController::class, 'replyTicket']);
    Route::put('/ticket-prority/{ticketId}/update/', [TicketController::class, 'updateTicketPriority']);
    Route::delete('/ticket/{ticketId}/delete', [TicketController::class, 'deleteTicket']);

    //Users and Customers management
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/user/{id}', [UserController::class, 'show']);
    Route::put('/user/update/{id}', [UserController::class, 'update']);
    Route::get('/user-stats', [UserController::class, 'userStats']);
    Route::get('/user-graph', [UserController::class, 'getUserGraphData']);
    Route::get('/user-activities', [UserController::class, 'getUserActivities']);
    Route::get('/user-activities-graph', [UserController::class, 'getActivityGraphData']);
    Route::patch('/user/{id}/status', [UserController::class, 'changeUserStatus']);
    Route::delete('/user/delete/{id}', [UserController::class, 'delete']);
    Route::delete('/user/force-delete/{id}', [UserController::class, 'forceDelete']);

    Route::get('/payments', [PaymentMethodsController::class, 'getPaymentMethods']);
    Route::post('/payments/create', [PaymentMethodsController::class, 'createOrUpdatePaymentMethod']);
    Route::delete('/payments/delete/{id}', [PaymentMethodsController::class, 'deletePaymentMethod']);

    // Finance and Analytics
    Route::get('/earnings/overview', [FinanceController::class, 'getFinanceOverview']);
    Route::get('/earnings/graph', [FinanceController::class, 'getDailyFinanceByMonth']);
    Route::get('withdrawal/requests', [WithdrawalController::class, 'getPayoutRequests']);
    Route::put('/withdrawal/{id}/{status}', [WithdrawalController::class, 'updateWithdrawalStatus']);
    Route::get('/commission/revenues', [WithdrawalController::class, 'commissionRevenue']);
    Route::get('settlement-accounts', [WithdrawalController::class, 'getsettlementAccounts']);

    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index']);

    // Commission
    Route::apiResource('commissions', CommissionController::class);

    // FAQ
    Route::apiResource('faqs', FaqController::class);


    // Tutorials
    Route::apiResource('tutorials', TutorialController::class);
});

// Vendor route
Route::middleware(['auth:sanctum', 'vendor'])->prefix('v1/vendor')->group(function () {

    // Shop Routes
    Route::post('/shop/create', [ShopController::class, 'create']);
    Route::put('/shop/update/{slug}', [ShopController::class, 'update']);
    Route::delete('/shop/delete/{shop_id}', [ShopController::class, 'delete']);
    Route::put('/shop/logo/update/{shop_id}', [ShopController::class, 'updateShopLogo']);
    Route::put('/shop/banner/update/{shop_id}', [ShopController::class, 'updateShopBanner']);
    Route::get('/shop', [ShopController::class, 'vendorShop']);

    // Products Routes
    Route::get('/items', [ItemController::class, 'vendorProducts']);
    Route::post('/items/create', [ItemController::class, 'create']);
    Route::put('/items/update', [ItemController::class, 'update']);
    Route::delete('/items/delete/{product_id}', [ItemController::class, 'destroy']);

    // Pay Subscription
    Route::post('/subscription/payment', [PaymentController::class, 'makePayment']);

    // order update
    Route::put('/order/update/{order_id}', [OrderController::class, 'update']);
    Route::put('/bookings/update/{booking_id}', [BookingController::class, 'updateStatus']);

    // Discount
    Route::get('/discounts', [CouponController::class, 'vendorDiscountProducts']);
    Route::post('/discount/create', [CouponController::class, 'create']);
    Route::put('/discount/update/{id}', [CouponController::class, 'update']);
    Route::delete('/discount/delete/{id}', [CouponController::class, 'delete']);

    // Review reply from vendor
    Route::post('/review/reply/{id}', [ReviewController::class, 'reply']);

    //financial and sales analytics report
    Route::get('/earnings', [FinanceController::class, 'getEarningsOverview']);
    Route::get('/transactions', [FinanceController::class, 'getTransactionHistory']);
    Route::post('/settlement-account/create', [FinanceController::class, 'createOrUpdateBank']);
    Route::get('/settlement-account', [FinanceController::class, 'showSettlementBank']);
    Route::get('/sales-analytics', [FinanceController::class, 'getSalesAnalytics']);
    Route::get('/top-categories', [FinanceController::class, 'getTopCategories']);
    Route::get('/top-products', [FinanceController::class, 'getTopProducts']);
    Route::get('/top-customer-locations', [FinanceController::class, 'getTopCustomerLocations']);
    Route::get('/graphy', [FinanceController::class, 'getGraphData']);
    Route::get('/order/statistics', [FinanceController::class, 'getOrderStatistics']);
    Route::get('/items/statistics', [FinanceController::class, 'getItemStatistics']);

    //Withdrawal
    Route::post('/withdrawal/request', [WithdrawalController::class, 'requestWithdrawal']);
    Route::get('withdrawal/history', [WithdrawalController::class, 'getWithdrawalHistory']);

    //Promotions
    Route::post('/promotions/create', [PromotionController::class, 'create']);
    Route::post('/promotions/pay', [PromotionController::class, 'pay']);
    Route::get('/promotions', [PromotionController::class, 'index']);
    Route::get('/promotions/{id}', [PromotionController::class, 'show']);

    // Identity Verification
    Route::post('/identity-verification/create', [IdentityVerificationController::class, 'store']);
    //vendor tickets
    Route::get('/tickets', [TicketController::class, 'vendorTickets']);
});


// Customer route
Route::middleware(['auth:sanctum', 'customer'])->prefix('v1/customer')->group(function () {

    // Preferences
    Route::post('/preference/create', [PreferenceController::class, 'createOrUpdate']);
    Route::get('/preferences', [PreferenceController::class, 'list']);

    // Refer and Earn
    Route::get('/referrals/code', [ProfileController::class, 'getReferralCode']);
    Route::post('/referrals/apply-code', [ProfileController::class, 'applyReferralCode']);
    // Wishlist
    Route::get('/wishlists', [WishlistController::class, 'index']);
    Route::post('/wishlist/create', [WishlistController::class, 'addToWishlist']);
    Route::delete('/wishlist/delete/{wishlist_id}', [WishlistController::class, 'removeFromWishlist']);

    //Address Book
    Route::get('/addresses', [AddressBookController::class, 'index']);
    Route::post('/address/create', [AddressBookController::class, 'create']);
    Route::put('/address/update/{address_id}', [AddressBookController::class, 'update']);
    Route::delete('/address/delete/{address_id}', [AddressBookController::class, 'delete']);

    //Profile
    Route::get('/profile', [ProfileController::class, 'index']);
    Route::put('/profile/update/{user_id}', [ProfileController::class, 'update']);
    Route::delete('/profile/delete/{user_id}', [ProfileController::class, 'delete']);

    //Orders for both customers and vendors
    Route::post('/order/create', [OrderController::class, 'create']);

    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/create', [CartController::class, 'storeOrUpdateCart']);
    Route::post('/shipping-rate', [CartController::class, 'shippingRate']);
    Route::delete('/cart/delete/{cart_id}', [CartController::class, 'destroy']);

    // Booking
    Route::apiResource('bookings', BookingController::class);

    // Extra booking actions
    Route::post('bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');
    Route::patch('bookings/{booking}/status', [BookingController::class, 'updateStatus'])->name('bookings.updateStatus');

    // Checkout
    Route::post('/checkout', [CheckoutController::class, 'checkout']);

    // Reviews
    Route::post('/review/create', [ReviewController::class, 'create']);

    // tickets
    Route::get('/tickets', [TicketController::class, 'reporterTickets']);
});

// General Auth Route
Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    #any role can create shop
    Route::post('/shop/create', [ShopController::class, 'create']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::put('/bookings/canceled/{booking_id}', [BookingController::class, 'cancelBooking']);

    Route::get('/orders/{order_id}', [OrderController::class, 'orderDetail']);

    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::get('/notifications', [NotificationController::class, 'index']);

    //Ticket System
    Route::post('/ticket/create', [TicketController::class, 'createOrUpdate']);
    Route::get('/tickets', [TicketController::class, 'getTicket']);

    // Communication preference
    Route::get('/communication-preferences', [CommunicationSettings::class, 'communicationPreferences']);
    Route::post('/communication/create', [CommunicationSettings::class, 'createOrUpdate']);

    Route::put('/change-password', [ProfileController::class, 'changePassword']);

    // FAQs
});
