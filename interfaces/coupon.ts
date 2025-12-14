export default interface Coupon {
    discount_code: string;
    product_id: string;
    vendor_id: string;
    start_time: string;
    end_time: string;
    discount_rate: string;
    discount_type: string;
    notify_users: string;
    status: string;
}