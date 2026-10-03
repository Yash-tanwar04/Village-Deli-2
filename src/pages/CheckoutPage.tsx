import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  User,
  AlertCircle,
  ArrowRight,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  X,
  Lock,
  RefreshCw,
  Store,
  MapPin,
  Truck,
  Clock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Address, StoreLocation } from '../types';
import { loadRazorpayScript } from '../lib/razorpay';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user, login, register, addresses, refreshAddresses, saveAddress, setSessionUser } = useAuth();

  // Guard flag so clearing cart upon successful checkout doesn't redirect to /order-now
  const orderCompletedRef = useRef(false);

  // Authentication Gate State (for guests)
  const [authTab, setAuthTab] = useState<'signin' | 'register'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authConfirmPass, setAuthConfirmPass] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authOtpRequired, setAuthOtpRequired] = useState(false);
  const [authOtpCode, setAuthOtpCode] = useState('');
  const [authVerifyingOtp, setAuthVerifyingOtp] = useState(false);
  const [authResendingOtp, setAuthResendingOtp] = useState(false);
  const [authOtpSuccessMsg, setAuthOtpSuccessMsg] = useState('');

  // Form State
  const [customerName, setCustomerName] = useState(user?.full_name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  // Fulfillment & Store Pickup State
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [selectedPickupStoreId, setSelectedPickupStoreId] = useState<string>('');
  const [selectedNearestStoreId, setSelectedNearestStoreId] = useState<string>('');

  // Address State
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(!user || addresses.length === 0);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [houseFlat, setHouseFlat] = useState('');
  const [buildingStreet, setBuildingStreet] = useState('');
  const [areaLocality, setAreaLocality] = useState('');
  const [city, setCity] = useState('Gurugram');
  const [state, setState] = useState('Haryana');
  const [pincode, setPincode] = useState('122017');
  const [landmark, setLandmark] = useState('');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [savingAddress, setSavingAddress] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Razorpay'>('COD');
  const [paymentSettings, setPaymentSettings] = useState<{
    razorpay_enabled: boolean;
    razorpay_key_id: string;
    require_admin_verification: boolean;
    cod_enabled: boolean;
  }>({
    razorpay_enabled: false,
    razorpay_key_id: '',
    require_admin_verification: false,
    cod_enabled: true
  });

  // UI & Submission State
  const [submitting, setSubmitting] = useState(false);
  const [initializingPayment, setInitializingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [serviceablePincodes, setServiceablePincodes] = useState<string[]>([]);
  const [minOrderValue, setMinOrderValue] = useState(199);

  // Handle empty cart redirect (ONLY if not completing an order)
  useEffect(() => {
    if (items.length === 0 && !orderCompletedRef.current) {
      navigate('/order-now');
    }
  }, [items, navigate]);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.full_name);
      if (!customerEmail) setCustomerEmail(user.email);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);

      if (addresses.length > 0 && !selectedAddressId) {
        const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
        setSelectedAddressId(defaultAddr.id || '');
        setIsAddingNewAddress(false);
      }
    }
  }, [user, addresses]);

  const loadSettings = async () => {
    try {
      const [s, paySet, storesData] = await Promise.all([
        api.getStoreSettings(),
        api.getPublicPaymentSettings().catch(() => ({
          razorpay_enabled: false,
          razorpay_key_id: '',
          require_admin_verification: false,
          cod_enabled: true
        })),
        api.getStores().catch(() => [])
      ]);

      if (s.serviceable_pincodes) {
        setServiceablePincodes(s.serviceable_pincodes);
      }
      if (s.min_order_value) {
        setMinOrderValue(s.min_order_value);
      }

      if (storesData && storesData.length > 0) {
        setStores(storesData);
        const pickupEligible = storesData.find(st => st.allow_pickup && st.is_active) || storesData[0];
        if (pickupEligible) {
          setSelectedPickupStoreId(pickupEligible.id);
        }
        setSelectedNearestStoreId(storesData[0].id);
      }

      setPaymentSettings(paySet);
      if (paySet.razorpay_enabled && !paySet.cod_enabled) {
        setPaymentMethod('Razorpay');
      } else if (!paySet.razorpay_enabled && paySet.cod_enabled) {
        setPaymentMethod('COD');
      }
    } catch (e) {
      console.error('Settings error:', e);
    }
  };

  // Check deliverability of any pincode instantly
  const checkPincodeDeliverable = (pin: string) => {
    const clean = pin.trim();
    if (!/^\d{6}$/.test(clean)) return null;
    if (serviceablePincodes.length === 0) return true;
    return serviceablePincodes.includes(clean);
  };

  // Instant deliverability status for the currently entered pincode
  const currentPinDeliverable = checkPincodeDeliverable(pincode);

  // Active address being used
  const activeSelectedAddress = addresses.find(a => a.id === selectedAddressId);
  const activeSelectedPinDeliverable = activeSelectedAddress
    ? checkPincodeDeliverable(activeSelectedAddress.pincode)
    : null;

  // Handle Guest Authentication (Sign In or Register)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSubmitting(true);

    try {
      if (authTab === 'signin') {
        const loggedUser = await login(authEmail.trim(), authPassword);
        if (loggedUser && (loggedUser as any).otp_required) {
          setAuthOtpRequired(true);
          setAuthOtpSuccessMsg((loggedUser as any).message || 'A 6-digit verification code has been sent to your email.');
          return;
        }
        setCustomerName(loggedUser.full_name);
        setCustomerEmail(loggedUser.email);
        if (loggedUser.phone) setCustomerPhone(loggedUser.phone);
      } else {
        if (authPassword !== authConfirmPass) {
          throw new Error('Passwords do not match');
        }
        if (authPassword.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
        if (!authFullName.trim() || !authPhone.trim()) {
          throw new Error('Full Name and Phone Number are required');
        }

        const newUser = await register({
          full_name: authFullName.trim(),
          email: authEmail.trim(),
          password: authPassword,
          phone: authPhone.trim()
        });

        if (newUser && (newUser as any).otp_required) {
          setAuthOtpRequired(true);
          setAuthOtpSuccessMsg((newUser as any).message || 'A 6-digit verification code has been sent to your email.');
          return;
        }

        setCustomerName(newUser.full_name);
        setCustomerEmail(newUser.email);
        setCustomerPhone(newUser.phone || authPhone.trim());
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Handle OTP verification for guest login/register
  const handleAuthVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authOtpCode.trim() || authOtpCode.trim().length !== 6) {
      setAuthError('Please enter the 6-digit verification code.');
      return;
    }
    setAuthVerifyingOtp(true);
    try {
      const res = await api.verifyOtp(authEmail.trim(), authOtpCode.trim());
      setSessionUser(res.user, res.token);
      setCustomerName(res.user.full_name);
      setCustomerEmail(res.user.email);
      if (res.user.phone) setCustomerPhone(res.user.phone);
      setAuthOtpRequired(false);
      setAuthOtpCode('');
    } catch (err: any) {
      setAuthError(err.message || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setAuthVerifyingOtp(false);
    }
  };

  // Handle OTP resend for guest login/register
  const handleAuthResendOtp = async () => {
    setAuthError('');
    setAuthResendingOtp(true);
    try {
      const purpose = authTab === 'signin' ? 'login' : 'register';
      await api.resendOtp(authEmail.trim(), purpose);
      setAuthOtpSuccessMsg('A new verification code has been dispatched to your email.');
    } catch (err: any) {
      setAuthError(err.message || 'Failed to resend verification code.');
    } finally {
      setAuthResendingOtp(false);
    }
  };

  // Start editing a saved address
  const handleStartEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id || null);
    setIsAddingNewAddress(true);
    setHouseFlat(addr.house_flat || '');
    setBuildingStreet(addr.building_street || '');
    setAreaLocality(addr.area_locality || '');
    setCity(addr.city || 'Gurugram');
    setState(addr.state || 'Haryana');
    setPincode(addr.pincode || '');
    setLandmark(addr.landmark || '');
    setAddressType((addr.address_type as any) || 'Home');
  };

  // Cancel edit mode
  const handleCancelAddressEdit = () => {
    setEditingAddressId(null);
    if (addresses.length > 0) {
      setIsAddingNewAddress(false);
    }
  };

  // Save or update address
  const handleSaveAddressExplicit = async () => {
    if (!user) return;
    if (!houseFlat.trim() || !areaLocality.trim() || !pincode.trim()) {
      setErrorMessage('Please fill in House/Flat, Area, and 6-digit Pincode.');
      return;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      setErrorMessage('Pincode must be exactly 6 digits.');
      return;
    }

    setSavingAddress(true);
    try {
      const payload: Address = {
        id: editingAddressId || undefined,
        user_id: user.id,
        full_name: customerName.trim() || user.full_name,
        phone: customerPhone.trim() || user.phone,
        house_flat: houseFlat.trim(),
        building_street: buildingStreet.trim(),
        area_locality: areaLocality.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        landmark: landmark.trim(),
        address_type: addressType,
        is_default: addresses.length === 0
      };

      const saved = await saveAddress(payload);
      await refreshAddresses();
      if (saved?.id) {
        setSelectedAddressId(saved.id);
      }
      setIsAddingNewAddress(false);
      setEditingAddressId(null);
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save address.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. Validation
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage('Please fill in your full name and phone number.');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    // 2. Resolve active delivery address or store pickup location
    let activeAddress: Address;
    const isPickup = deliveryType === 'pickup';

    if (isPickup) {
      const chosenStore = stores.find(s => s.id === selectedPickupStoreId);
      if (!chosenStore) {
        setErrorMessage('Please select a retail store outlet for your order pickup.');
        return;
      }
      activeAddress = {
        full_name: customerName.trim(),
        phone: customerPhone.trim(),
        house_flat: 'Store Pickup',
        building_street: chosenStore.name + (chosenStore.badge ? ` (${chosenStore.badge})` : ''),
        area_locality: chosenStore.address,
        city: chosenStore.city || 'Gurugram',
        state: chosenStore.state || 'Haryana',
        pincode: chosenStore.pincode || '122001',
        landmark: chosenStore.address,
        address_type: 'Other',
        is_default: false
      };
    } else {
      if (!isAddingNewAddress && activeSelectedAddress) {
        activeAddress = activeSelectedAddress;
      } else {
        if (!houseFlat.trim()) {
          setErrorMessage('House / Flat / Floor Number is required.');
          return;
        }
        if (!areaLocality.trim()) {
          setErrorMessage('Area / Locality is required.');
          return;
        }
        if (!city.trim()) {
          setErrorMessage('City is required.');
          return;
        }
        const cleanPincode = pincode.trim();
        if (!/^\d{6}$/.test(cleanPincode)) {
          setErrorMessage('Please enter a valid 6-digit postal PIN code.');
          return;
        }

        activeAddress = {
          full_name: customerName.trim(),
          phone: customerPhone.trim(),
          house_flat: houseFlat.trim(),
          building_street: buildingStreet.trim(),
          area_locality: areaLocality.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: cleanPincode,
          landmark: landmark.trim(),
          address_type: addressType,
          is_default: addresses.length === 0
        };

        // Save if logged in
        if (user) {
          try {
            const saved = await saveAddress({ ...activeAddress, user_id: user.id });
            if (saved?.id) setSelectedAddressId(saved.id);
          } catch {
            // ignore background save error
          }
        }
      }

      // 3. Deliverability validation (only for home delivery)
      const pinCheck = checkPincodeDeliverable(activeAddress.pincode);
      if (pinCheck === false) {
        setErrorMessage(
          `Sorry! We currently do not deliver to pincode ${activeAddress.pincode}. Serviceable PIN codes: ${serviceablePincodes.join(', ')}`
        );
        return;
      }
    }

    // 4. Minimum order value check
    if (subtotal < minOrderValue) {
      setErrorMessage(`Minimum order value for checkout is ₹${minOrderValue}. Please add more items.`);
      return;
    }

    const chosenPickup = stores.find(s => s.id === selectedPickupStoreId);
    const chosenNearest = stores.find(s => s.id === selectedNearestStoreId);

    // Construct Payload
    const orderPayload = {
      user_id: user?.id,
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim(),
      customer_phone: customerPhone.trim(),
      delivery_address: activeAddress,
      items: items.map(i => ({
        product_id: i.product.id,
        quantity: i.quantity,
        variant_id: (i as any).selected_variant?.id || (i as any).variant_id,
        variant_name: (i as any).selected_variant?.name || (i as any).variant_name
      })),
      notes: orderNotes.trim(),
      delivery_type: deliveryType,
      pickup_store_id: isPickup ? chosenPickup?.id : undefined,
      pickup_store_name: isPickup ? chosenPickup?.name : undefined,
      pickup_store_address: isPickup ? chosenPickup?.address : undefined,
      pickup_store_phone: isPickup ? chosenPickup?.phone : undefined,
      nearest_store_id: isPickup ? chosenPickup?.id : (chosenNearest?.id || undefined),
      nearest_store_name: isPickup ? chosenPickup?.name : (chosenNearest?.name || undefined)
    };

    // ==========================================
    // COD FLOW
    // ==========================================
    if (paymentMethod === 'COD') {
      setSubmitting(true);
      try {
        const response = await api.createOrder(orderPayload);
        orderCompletedRef.current = true;
        clearCart();
        navigate(`/order-confirmation/${response.id}`);
      } catch (err: any) {
        console.error('Order creation error:', err);
        setErrorMessage(err.message || 'Failed to place order. Please verify your details and try again.');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // ==========================================
    // RAZORPAY ONLINE PAYMENT FLOW
    // ==========================================
    if (paymentMethod === 'Razorpay') {
      setSubmitting(true);
      setInitializingPayment(true);
      try {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded || typeof window.Razorpay === 'undefined') {
          throw new Error('Razorpay payment gateway failed to load. Please check your internet connection or ad-blocker.');
        }

        // 1. Create Razorpay order on server
        const rzpData = await api.createRazorpayOrder(orderPayload);
        setInitializingPayment(false);

        // 2. Configure Razorpay modal
        const options = {
          key: rzpData.key_id,
          amount: rzpData.amount, // in paise
          currency: rzpData.currency || 'INR',
          name: rzpData.store_name || 'VillageDELI',
          description: `Order Payment (Total: ₹${rzpData.amount_in_rupees})`,
          image: '/assets/village_deli_header_logo.png',
          order_id: rzpData.razorpay_order_id,
          prefill: {
            name: customerName.trim(),
            email: customerEmail.trim() || undefined,
            contact: customerPhone.trim()
          },
          theme: {
            color: '#0d1f15'
          },
          modal: {
            ondismiss: function () {
              setSubmitting(false);
              setInitializingPayment(false);

              // Record failed/cancelled order in history while keeping cart intact
              api.recordPaymentFailure({
                transaction_id: rzpData.transaction_id,
                razorpay_order_id: rzpData.razorpay_order_id,
                error_code: 'PAYMENT_CANCELLED_BY_USER',
                error_description: 'Payment was dismissed by user before completion.',
                ...orderPayload
              }).catch(() => {});

              setErrorMessage(
                'Payment was cancelled. Your cart has been preserved and this attempt was recorded in your Order History. You can retry payment or choose Cash on Delivery.'
              );
            }
          },
          handler: async function (response: any) {
            setSubmitting(true);
            try {
              // 3. Verify signature on backend and place confirmed order
              const verifyRes = await api.verifyAndPlaceRazorpayOrder({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                transaction_id: rzpData.transaction_id,
                ...orderPayload
              });

              orderCompletedRef.current = true;
              clearCart();
              navigate(`/order-confirmation/${verifyRes.order.id}`);
            } catch (err: any) {
              console.error('Payment verification error:', err);
              setErrorMessage(
                err.message || 'Payment verification could not be completed. Your cart has been preserved. If your account was debited, please contact store support.'
              );
            } finally {
              setSubmitting(false);
              setInitializingPayment(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);

        // Edge case: Handle payment failed event
        rzp.on('payment.failed', function (failRes: any) {
          setSubmitting(false);
          setInitializingPayment(false);
          const errorMsg =
            failRes?.error?.description ||
            failRes?.error?.reason ||
            'Payment could not be completed. Please try a different UPI ID, card, or choose Cash on Delivery.';

          api.recordPaymentFailure({
            transaction_id: rzpData.transaction_id,
            razorpay_order_id: rzpData.razorpay_order_id,
            razorpay_payment_id: failRes?.error?.metadata?.payment_id,
            error_code: failRes?.error?.code || 'PAYMENT_FAILED',
            error_description: errorMsg,
            ...orderPayload
          }).catch(() => {});

          setErrorMessage(
            `Payment Failed: ${errorMsg}. Your cart has been preserved and this attempt was recorded in your Order History. You can retry with another method.`
          );
        });

        rzp.open();
      } catch (err: any) {
        console.error('Razorpay initialization exception:', err);
        setSubmitting(false);
        setInitializingPayment(false);
        setErrorMessage(err.message || 'Unable to connect to Razorpay payment gateway. Please try again or select Cash on Delivery.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900 pt-20 pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0d1f15] text-[#fed100] flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0d1f15]">
                Checkout & Delivery
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Fast Doorstep Delivery • Cash on Delivery & Secure Online UPI/Cards
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* 1. GUEST AUTHENTICATION GATE (Requirement 3: Ask to Sign In / Create Account before order) */}
        {!user && (
          <div className="mb-8 bg-white border border-[#6cb33f]/30 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#f4f7f2] border border-[#6cb33f]/40 text-[#2d5c16] flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-serif font-black text-[#0d1f15]">
                  Please Sign In or Create an Account
                </h2>
                <p className="text-xs text-stone-500 leading-relaxed">
                  An account is required to place your order, track delivery in real time, and view receipts.
                  Your cart items (<strong className="text-stone-800">₹{total}</strong>) are saved and ready!
                </p>
              </div>

              {authOtpRequired ? (
                <div className="space-y-4">
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">{authOtpSuccessMsg || 'Verification code sent!'}</p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        Please enter the 6-digit code sent to <strong className="text-stone-900">{authEmail}</strong>.
                      </p>
                    </div>
                  </div>

                  {authError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleAuthVerifyOtp} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        6-Digit OTP Code *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={authOtpCode}
                        onChange={e => setAuthOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 123456"
                        className="w-full text-center text-lg font-mono tracking-widest px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={authVerifyingOtp || authOtpCode.length !== 6}
                      className="w-full bg-[#0d1f15] hover:bg-[#173323] text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                    >
                      {authVerifyingOtp ? (
                        <span className="flex items-center justify-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Verifying OTP...
                        </span>
                      ) : (
                        'Verify Code & Continue'
                      )}
                    </button>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        onClick={handleAuthResendOtp}
                        disabled={authResendingOtp}
                        className="text-[#3b711e] hover:underline font-semibold disabled:opacity-50 cursor-pointer"
                      >
                        {authResendingOtp ? 'Resending code...' : 'Resend Code'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthOtpRequired(false);
                          setAuthOtpCode('');
                          setAuthError('');
                        }}
                        className="text-stone-500 hover:text-stone-800 cursor-pointer text-[11px]"
                      >
                        Change Email / Back
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  {/* Toggle Tabs */}
                  <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('signin');
                        setAuthError('');
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        authTab === 'signin'
                          ? 'bg-white text-[#0d1f15] shadow-xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('register');
                        setAuthError('');
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        authTab === 'register'
                          ? 'bg-white text-[#0d1f15] shadow-xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      Create New Account
                    </button>
                  </div>

                  {authError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                    {authTab === 'register' && (
                      <>
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={authFullName}
                            onChange={e => setAuthFullName(e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">Phone Number *</label>
                          <input
                            type="tel"
                            required
                            value={authPhone}
                            onChange={e => setAuthPhone(e.target.value)}
                            placeholder="e.g. 9876543210"
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={e => setAuthEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={e => setAuthPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                      />
                    </div>

                    {authTab === 'register' && (
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Confirm Password *</label>
                        <input
                          type="password"
                          required
                          value={authConfirmPass}
                          onChange={e => setAuthConfirmPass(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={authSubmitting}
                      className="w-full bg-[#0d1f15] hover:bg-[#173323] text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-md mt-2"
                    >
                      {authSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Authenticating...
                        </span>
                      ) : authTab === 'signin' ? (
                        'Sign In & Continue Checkout'
                      ) : (
                        'Create Account & Continue Checkout'
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* 2. MAIN CHECKOUT FORM */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: FORM SECTIONS */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: CONTACT DETAILS */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                <span className="w-6 h-6 rounded-full bg-[#0d1f15] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 font-serif">
                  Customer Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. Ramesh Sharma"
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone Number (for delivery updates) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address (for order receipts)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                  />
                </div>
              </div>
            </div>

            {/* STEP 2: FULFILLMENT METHOD (Home Delivery vs Store Pickup) */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0d1f15] text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 font-serif">
                    Fulfillment Method
                  </h2>
                </div>

                {/* Fulfillment Mode Switcher */}
                <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      deliveryType === 'delivery'
                        ? 'bg-white text-[#0d1f15] shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 text-[#6cb33f]" />
                    <span>Home Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      deliveryType === 'pickup'
                        ? 'bg-[#0d1f15] text-[#6cb33f] shadow-xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5 text-[#6cb33f]" />
                    <span>Store Pickup</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-[#6cb33f] text-[#0d1f15]">
                      FREE
                    </span>
                  </button>
                </div>
              </div>

              {/* 1. STORE PICKUP FULFILLMENT VIEW */}
              {deliveryType === 'pickup' ? (
                <div className="space-y-4">
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold">Store Pickup Option Selected (Free ₹0 Delivery)</p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        Select your preferred VillageDELI branch outlet. Your items will be carefully packed and kept ready for you within 20–30 minutes!
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      Choose Pickup Outlet Branch *
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {stores
                        .filter(s => s.allow_pickup && s.is_active)
                        .map(store => {
                          const isSelected = selectedPickupStoreId === store.id;
                          return (
                            <div
                              key={store.id}
                              onClick={() => setSelectedPickupStoreId(store.id)}
                              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'border-[#6cb33f] bg-emerald-50/50 shadow-xs ring-2 ring-[#6cb33f]/20'
                                  : 'border-stone-200 hover:border-stone-300 bg-white'
                              }`}
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                  <div>
                                    <span className="font-serif font-black text-sm text-[#0d1f15] block">
                                      {store.name}
                                    </span>
                                    {store.badge && (
                                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#0d1f15] text-[#6cb33f] inline-block mt-0.5">
                                        {store.badge}
                                      </span>
                                    )}
                                  </div>
                                  <input
                                    type="radio"
                                    name="pickup_store_select"
                                    checked={isSelected}
                                    onChange={() => setSelectedPickupStoreId(store.id)}
                                    className="text-[#6cb33f] focus:ring-[#6cb33f] mt-1"
                                  />
                                </div>

                                <div className="space-y-1.5 text-xs text-stone-600 mt-2.5">
                                  <div className="flex items-start gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                                    <span className="line-clamp-2 leading-relaxed">{store.address} (PIN: <strong>{store.pincode}</strong>)</span>
                                  </div>

                                  {store.hours && (
                                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                                      <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                                      <span>{store.hours}</span>
                                    </div>
                                  )}

                                  {store.phone && (
                                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono">
                                      <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                                      <span>{store.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
                                <span className="font-bold text-emerald-700">✓ Ready in 20–30 mins</span>
                                <span className="font-mono font-bold text-stone-700">FREE ₹0</span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ) : (
                /* 2. HOME DELIVERY VIEW (Saved addresses + Add New + Nearest Fulfillment Store) */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-600">Select Doorstep Delivery Address</span>
                    {user && addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (isAddingNewAddress) {
                            setIsAddingNewAddress(false);
                            setEditingAddressId(null);
                          } else {
                            setIsAddingNewAddress(true);
                            setEditingAddressId(null);
                            setHouseFlat('');
                            setBuildingStreet('');
                            setAreaLocality('');
                            setLandmark('');
                          }
                        }}
                        className="text-xs font-bold text-[#3b711e] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {isAddingNewAddress ? 'Use Saved Address' : '+ Add New Address'}
                      </button>
                    )}
                  </div>

                  {/* Saved addresses cards with EDIT button */}
                  {user && addresses.length > 0 && !isAddingNewAddress && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {addresses.map(addr => {
                          const isPinOk = checkPincodeDeliverable(addr.pincode);
                          return (
                            <div
                              key={addr.id}
                              className={`p-3.5 rounded-xl border transition-all relative ${
                                selectedAddressId === addr.id
                                  ? 'border-[#3b711e] bg-[#f4f8f1] ring-2 ring-[#3b711e]/20'
                                  : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                              }`}
                            >
                          <div
                            onClick={() => setSelectedAddressId(addr.id || '')}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center justify-between text-xs font-bold text-stone-900 mb-1">
                              <span className="capitalize">{addr.address_type}</span>
                              <div className="flex items-center gap-1.5">
                                {isPinOk === true && (
                                  <span className="text-[10px] text-green-700 bg-green-100 px-1.5 py-0.5 rounded font-semibold">
                                    Deliverable
                                  </span>
                                )}
                                {isPinOk === false && (
                                  <span className="text-[10px] text-red-700 bg-red-100 px-1.5 py-0.5 rounded font-semibold">
                                    Not Deliverable
                                  </span>
                                )}
                                {addr.is_default && (
                                  <span className="text-[10px] text-[#3b711e] bg-[#eaf4e6] px-1.5 py-0.5 rounded font-bold">
                                    Default
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-stone-600 line-clamp-2 pr-12">
                              {addr.house_flat}, {addr.building_street ? `${addr.building_street}, ` : ''}{addr.area_locality}, {addr.city} - {addr.pincode}
                            </p>
                          </div>

                          {/* EDIT ADDRESS BUTTON (Requirement 2) */}
                          <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                handleStartEditAddress(addr);
                              }}
                              className="text-[11px] font-bold text-[#3b711e] hover:text-[#2d5c16] flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit Address</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedAddressId(addr.id || '')}
                              className={`text-[11px] font-bold ${
                                selectedAddressId === addr.id ? 'text-[#3b711e]' : 'text-stone-400'
                              }`}
                            >
                              {selectedAddressId === addr.id ? '✓ Selected' : 'Select'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {activeSelectedPinDeliverable === false && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>
                        Your selected address PIN ({activeSelectedAddress?.pincode}) is outside our delivery zone.
                        Please edit this address or add a serviceable address.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Inline Address Form (Add New or Edit Existing) */}
              {(isAddingNewAddress || !user || addresses.length === 0) && (
                <div className="space-y-4">
                  {editingAddressId && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
                      <span className="font-semibold">✏️ Editing Saved Address</span>
                      <button
                        type="button"
                        onClick={handleCancelAddressEdit}
                        className="text-stone-500 hover:text-stone-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel Edit
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        House / Flat / Floor No. *
                      </label>
                      <input
                        type="text"
                        required
                        value={houseFlat}
                        onChange={e => setHouseFlat(e.target.value)}
                        placeholder="e.g. Flat 402, Block B"
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Apartment / Street / Society Name
                      </label>
                      <input
                        type="text"
                        value={buildingStreet}
                        onChange={e => setBuildingStreet(e.target.value)}
                        placeholder="e.g. Sobha City, Dwarka Expressway"
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Area / Locality *
                      </label>
                      <input
                        type="text"
                        required
                        value={areaLocality}
                        onChange={e => setAreaLocality(e.target.value)}
                        placeholder="e.g. Sector 109"
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="e.g. Gurugram"
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        State *
                      </label>
                      <select
                        value={state}
                        onChange={e => setState(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] bg-white"
                      >
                        <option value="Haryana">Haryana</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Chandigarh">Chandigarh</option>
                      </select>
                    </div>

                    {/* PINCODE FIELD WITH INSTANT DELIVERABILITY FEEDBACK (Requirement 2) */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        6-Digit PIN Code *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={pincode}
                        onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 122017"
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] font-mono tracking-wider font-bold"
                      />

                      {/* Instant deliverability indicator */}
                      {pincode.length === 6 && (
                        <div className="mt-1.5">
                          {currentPinDeliverable ? (
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-green-700 bg-green-50 p-1.5 rounded-lg border border-green-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                              <span>Serviceable! Express 30–45 min delivery available to {pincode}.</span>
                            </div>
                          ) : (
                            <div className="flex items-start gap-1.5 text-[11px] font-bold text-red-700 bg-red-50 p-1.5 rounded-lg border border-red-200">
                              <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                              <span>
                                Sorry, delivery is currently unavailable for PIN {pincode}.
                                {serviceablePincodes.length > 0 && ` Serviceable PINs: ${serviceablePincodes.join(', ')}`}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={e => setLandmark(e.target.value)}
                        placeholder="e.g. Near DPS International School"
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Address Type
                      </label>
                      <div className="flex items-center gap-3">
                        {(['Home', 'Work', 'Other'] as const).map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setAddressType(type)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                              addressType === type
                                ? 'bg-[#0d1f15] text-white border-[#0d1f15]'
                                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-300'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {user && (
                      <div className="sm:col-span-2 flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleSaveAddressExplicit}
                          disabled={savingAddress}
                          className="bg-[#0d1f15] hover:bg-[#173323] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {savingAddress ? 'Saving Address...' : editingAddressId ? 'Save Address Changes' : 'Save Address for Future Orders'}
                        </button>

                        {editingAddressId && (
                          <button
                            type="button"
                            onClick={handleCancelAddressEdit}
                            className="text-stone-600 hover:text-stone-900 px-4 py-2 text-xs font-bold rounded-full border border-stone-300"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

                  {/* Nearest Fulfillment Store Selector (for Home Delivery) */}
                  {stores.length > 0 && (
                    <div className="pt-3 border-t border-stone-100 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                        <Store className="w-3.5 h-3.5 text-[#6cb33f]" />
                        <span>Select Nearest Store Outlet (Preparing & Dispatching Branch)</span>
                      </div>
                      <select
                        value={selectedNearestStoreId}
                        onChange={e => setSelectedNearestStoreId(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] bg-stone-50 text-stone-800 font-medium"
                      >
                        {stores.filter(s => s.is_active).map(st => (
                          <option key={st.id} value={st.id}>
                            {st.name} — {st.address} (PIN: {st.pincode})
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-stone-400">
                        Our nearest store staff prepares your fresh items and notifies you upon dispatch.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* STEP 3: PAYMENT METHOD */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0d1f15] text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 font-serif">
                    Payment Method
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#3b711e]" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
              </div>

              <div className="space-y-3">
                {/* 1. RAZORPAY OPTION */}
                {paymentSettings.razorpay_enabled && (
                  <div
                    onClick={() => setPaymentMethod('Razorpay')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                      paymentMethod === 'Razorpay'
                        ? 'border-[#3b711e] bg-[#f4f8f1] shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        paymentMethod === 'Razorpay'
                          ? 'border-[#3b711e] bg-[#3b711e] text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {paymentMethod === 'Razorpay' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="text-sm font-bold text-[#0d1f15] flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#3b711e]" />
                          <span>Razorpay (Online Payment)</span>
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#0d1f15] text-[#fed100] px-2 py-0.5 rounded">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">
                        Pay seamlessly via Google Pay, PhonePe, Paytm, BHIM UPI, Credit/Debit Cards, NetBanking, or Wallets.
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-[#3b711e] font-semibold">
                        <span>Instant Refund Guarantee</span>
                        <span>•</span>
                        <span>Zero Surcharge</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CASH ON DELIVERY OPTION */}
                {paymentSettings.cod_enabled && (
                  <div
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                      paymentMethod === 'COD'
                        ? 'border-[#3b711e] bg-[#f4f8f1] shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        paymentMethod === 'COD'
                          ? 'border-[#3b711e] bg-[#3b711e] text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="text-sm font-bold text-[#0d1f15] flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-stone-600" />
                        <span>Cash on Delivery (COD)</span>
                      </div>
                      <p className="text-xs text-stone-600">
                        Pay in cash or via UPI QR code when our delivery partner arrives at your doorstep.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* STEP 4: ORDER NOTES */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Delivery Instructions or Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={orderNotes}
                onChange={e => setOrderNotes(e.target.value)}
                placeholder="e.g. Ring the doorbell twice, leave with security guard, call before arrival..."
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:border-[#3b711e] resize-none"
              />
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY (STICKY) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 pb-3 border-b border-stone-100 font-serif">
                Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h2>

              {/* Items preview list */}
              <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-stone-100 pr-1">
                {items.map(item => (
                  <div key={item.product.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-stone-50 p-1 shrink-0 border border-stone-100 flex items-center justify-center">
                        <img
                          src={item.product.image_url || '/assets/cat_fresh_produce.webp'}
                          alt={item.product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-stone-800 truncate">{item.product.name}</h4>
                        <p className="text-[11px] text-stone-400">
                          {item.product.unit} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900 shrink-0">
                      ₹{(item.product.discount_price ?? item.product.price) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-bold text-stone-900">₹{subtotal}</span>
                </div>

                {deliveryType === 'pickup' ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1 text-emerald-800 font-medium">
                        <Store className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Store Pickup Fee</span>
                      </span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                        FREE
                      </span>
                    </div>
                    {(() => {
                      const chosenPickupStore = stores.find(s => s.id === selectedPickupStoreId);
                      return chosenPickupStore ? (
                        <div className="p-2 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600">
                          <span className="font-bold text-stone-800 block truncate">{chosenPickupStore.name}</span>
                          <span className="line-clamp-1 text-stone-400 text-[10px]">{chosenPickupStore.address}</span>
                        </div>
                      ) : null;
                    })()}
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span>Doorstep Delivery Fee</span>
                    <span className="font-bold text-stone-900">
                      {deliveryFee === 0 ? (
                        <span className="text-[#3b711e]">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-stone-100 text-sm font-bold text-stone-900">
                  <span>Total Amount</span>
                  <span className="text-xl text-[#0d1f15] font-black">
                    ₹{deliveryType === 'pickup' ? subtotal : total}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={submitting || initializingPayment}
                className="w-full bg-[#0d1f15] hover:bg-[#173323] text-white py-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {submitting || initializingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>
                      {paymentMethod === 'Razorpay' ? 'Connecting to Razorpay...' : 'Placing Order...'}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      {paymentMethod === 'Razorpay'
                        ? `Pay ₹${deliveryType === 'pickup' ? subtotal : total} via Razorpay`
                        : `Place ${deliveryType === 'pickup' ? 'Pickup' : 'COD'} Order (₹${deliveryType === 'pickup' ? subtotal : total})`}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#fed100]" />
                  </>
                )}
              </button>

              <div className="text-[11px] text-stone-500 text-center space-y-1">
                <p>🚚 Guaranteed fresh or instant store replacement</p>
                <p>🔒 Safe & encrypted checkout by VillageDELI</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
