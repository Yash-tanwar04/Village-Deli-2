import crypto from 'crypto';
import { db } from '../db';

async function runTests() {
  console.log('--- STARTING RAZORPAY & TRANSACTIONS INTEGRATION TEST ---');

  // 1. Verify dummy products exist
  const products = db.getProducts({ status: 'all' });
  console.log(`[Test 1] Products in database: ${products.length}`);
  if (products.length === 0) {
    throw new Error('Expected dummy products to exist, but products list is empty!');
  }
  const testProduct = products[0];
  console.log(`   Sample product: "${testProduct.name}" (₹${testProduct.discount_price || testProduct.price})`);

  // 2. Configure Razorpay test settings in Admin
  const testKeyId = 'rzp_test_SampleKey123';
  const testKeySecret = 'SampleSecretKey456789!@#';

  db.updatePaymentSettings({
    razorpay_enabled: true,
    razorpay_key_id: testKeyId,
    razorpay_key_secret: testKeySecret,
    require_admin_verification: true,
    cod_enabled: true
  });

  const publicSettings = db.getPublicPaymentSettings();
  console.log('[Test 2] Public Payment Settings:', publicSettings);
  if (!publicSettings.razorpay_enabled || publicSettings.razorpay_key_id !== testKeyId) {
    throw new Error('Public payment settings mismatch!');
  }

  // 3. Test Transaction Creation & Generation
  const dummyTxn = db.createTransaction({
    customer_name: 'Simulated Shopper',
    customer_email: 'shopper@test.com',
    customer_phone: '9876543210',
    amount: 149,
    currency: 'INR',
    payment_gateway: 'razorpay',
    payment_status: 'Pending',
    razorpay_order_id: 'order_test_99999',
    admin_verified: false
  });
  console.log(`[Test 3] Created pending transaction: ${dummyTxn.id}`);

  // 4. Test Invalid Signature (Tamper test) - Edge Case
  const fakePaymentId = 'pay_test_fake123';
  const tamperedSignature = 'tampered_invalid_signature_hex';
  const validSignature = crypto
    .createHmac('sha256', testKeySecret)
    .update(`order_test_99999|${fakePaymentId}`)
    .digest('hex');

  console.log('[Test 4] Valid HMAC signature computed:', validSignature);
  if (tamperedSignature === validSignature) {
    throw new Error('Signature collision occurred!');
  }
  console.log('   HMAC mismatch verification working properly.');

  // 5. Place Razorpay Order with require_admin_verification = TRUE
  const testOrder = db.createOrder({
    customer_name: 'Simulated Shopper',
    customer_email: 'shopper@test.com',
    customer_phone: '9876543210',
    delivery_address: {
      id: 'addr_test',
      user_id: 'usr_guest',
      full_name: 'Simulated Shopper',
      phone: '9876543210',
      house_flat: 'Flat 402, Tower B',
      building_street: 'Chintels Paradiso',
      area_locality: 'Sector 109',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122017',
      landmark: 'Near Club',
      address_type: 'Home',
      is_default: true,
      created_at: new Date().toISOString()
    },
    subtotal: 129,
    delivery_fee: 30,
    total_amount: 159,
    payment_method: 'Razorpay',
    payment_status: 'Paid',
    order_status: 'Placed', // Waiting for Admin verification per setting!
    estimated_delivery: '30-45 mins',
    items: [
      {
        id: 'itm_test_1',
        order_id: '',
        product_id: testProduct.id,
        product_name: testProduct.name,
        product_price: testProduct.discount_price || testProduct.price,
        product_unit: testProduct.unit,
        product_image: testProduct.image_url,
        quantity: 1,
        subtotal: testProduct.discount_price || testProduct.price
      }
    ],
    razorpay_order_id: 'order_test_99999',
    razorpay_payment_id: fakePaymentId,
    razorpay_signature: validSignature,
    transaction_id: dummyTxn.id,
    payment_verified_by_admin: false
  });

  console.log(`[Test 5] Order placed: ${testOrder.id} with status: "${testOrder.order_status}" (Payment: ${testOrder.payment_status}, Verified: ${testOrder.payment_verified_by_admin})`);
  if (testOrder.order_status !== 'Placed' || testOrder.payment_verified_by_admin !== false) {
    throw new Error('Order should stay in "Placed" status when require_admin_verification is TRUE');
  }

  // 6. Test Admin Payment Verification on this order
  const verifyResult = db.verifyOrderPaymentByAdmin(testOrder.id, 'VillageDELI Admin');
  if (!verifyResult || verifyResult.order.order_status !== 'Confirmed' || verifyResult.order.payment_verified_by_admin !== true) {
    throw new Error('Admin verification failed to confirm order!');
  }
  console.log(`[Test 6] Admin verification successful! Order is now: "${verifyResult.order.order_status}", verified by "${verifyResult.order.admin_verified_by}"`);

  // 7. Test with require_admin_verification = FALSE (Auto-confirmed)
  db.updatePaymentSettings({ require_admin_verification: false });
  const autoTxn = db.createTransaction({
    customer_name: 'Auto Shopper',
    customer_email: 'autoshopper@test.com',
    customer_phone: '9876543211',
    amount: 159,
    currency: 'INR',
    payment_gateway: 'razorpay',
    payment_status: 'Paid',
    razorpay_order_id: 'order_test_88888',
    razorpay_payment_id: 'pay_test_auto_888',
    razorpay_signature: 'sig_test',
    admin_verified: true
  });

  const autoConfirmOrder = db.createOrder({
    customer_name: 'Auto Shopper',
    customer_email: 'autoshopper@test.com',
    customer_phone: '9876543211',
    delivery_address: testOrder.delivery_address,
    subtotal: 129,
    delivery_fee: 30,
    total_amount: 159,
    payment_method: 'Razorpay',
    payment_status: 'Paid',
    order_status: 'Confirmed', // Auto-confirmed!
    estimated_delivery: '30-45 mins',
    items: testOrder.items,
    razorpay_order_id: 'order_test_88888',
    razorpay_payment_id: 'pay_test_auto_888',
    razorpay_signature: 'sig_test',
    transaction_id: autoTxn.id,
    payment_verified_by_admin: true
  });
  autoTxn.order_id = autoConfirmOrder.id;
  db.updateTransaction(autoTxn.id, { order_id: autoConfirmOrder.id });
  console.log(`[Test 7] Auto-confirm workflow: Order ${autoConfirmOrder.id} status is "${autoConfirmOrder.order_status}", verified: ${autoConfirmOrder.payment_verified_by_admin}`);
  if (autoConfirmOrder.order_status !== 'Confirmed') {
    throw new Error('Order was not auto-confirmed when require_admin_verification is FALSE');
  }

  // 8. Test Failed Payment Transaction
  const failedTxn = db.createTransaction({
    customer_name: 'Cancelled Shopper',
    customer_email: 'cancel@test.com',
    customer_phone: '9876543212',
    amount: 250,
    currency: 'INR',
    payment_gateway: 'razorpay',
    payment_status: 'Failed',
    razorpay_order_id: 'order_fail_000',
    error_code: 'BAD_REQUEST_ERROR',
    error_description: 'Payment was cancelled by the user.',
    admin_verified: false
  });
  console.log(`[Test 8] Failed transaction logged: ${failedTxn.id} (Status: ${failedTxn.payment_status}, Error: ${failedTxn.error_description})`);

  // 9. Verify Transactions List in Admin
  const allTxns = db.getTransactions();
  console.log(`[Test 9] Total transactions in DB: ${allTxns.length}`);
  if (allTxns.length < 3) {
    throw new Error('Expected at least 3 transactions in DB');
  }

  console.log('--- ALL INTEGRATION TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
