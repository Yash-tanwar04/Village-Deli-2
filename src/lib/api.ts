import {
  Category,
  Product,
  Order,
  Address,
  UserProfile,
  StoreSettings,
  EmailSettings,
  EmailLog,
  DashboardStats,
  OrderStatus,
  PaymentSettings,
  Transaction,
  SupportQuery,
  StoreLocation
} from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('villagedeli_token') : null;
  const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options?.headers
    }
  });

    if (!res.ok) {
    let errorMsg = `Request failed (${res.status})`;
    try {
      const errData = await res.json();
      if (errData && errData.error) {
        errorMsg = errData.error;
      }
    } catch {
      // ignore
    }

    // Notify AuthContext of stale/expired session on 401
    if (res.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('villagedeli:auth-unauthorized', { detail: { url } }));
    }

    throw new Error(errorMsg);
  }

  return res.json();
}

function normalizeOrder(o: any): Order {
  if (!o) return o;
  const total = o.total ?? o.total_amount ?? 0;
  const status = (o.status ?? o.order_status ?? 'Placed') as OrderStatus;
  const items = (o.items || []).map((it: any) => ({
    ...it,
    unit: it.unit ?? it.product_unit ?? '1 unit',
    product_unit: it.product_unit ?? it.unit ?? '1 unit',
    unit_price: it.unit_price ?? it.product_price ?? 0,
    product_price: it.product_price ?? it.unit_price ?? 0,
    total_price: it.total_price ?? it.subtotal ?? 0,
    subtotal: it.subtotal ?? it.total_price ?? 0
  }));

  return {
    ...o,
    total,
    total_amount: total,
    status,
    order_status: status,
    items
  };
}

export const api = {
  // Categories
  async getCategories(onlyActive = true): Promise<Category[]> {
    return fetchJson<Category[]>(`${API_BASE}/categories?onlyActive=${onlyActive}`);
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    return fetchJson<Category>(`${API_BASE}/categories`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    return fetchJson<Category>(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    return fetchJson<{ success: boolean }>(`${API_BASE}/categories/${id}`, {
      method: 'DELETE'
    });
  },

  // Products
  async getProducts(params?: {
    category_id?: string;
    category_slug?: string;
    status?: string;
    search?: string;
    brand?: string;
    is_featured?: boolean;
  }): Promise<Product[]> {
    const q = new URLSearchParams();
    if (params?.category_id) q.set('category_id', params.category_id);
    if (params?.category_slug) q.set('category_slug', params.category_slug);
    if (params?.status) q.set('status', params.status);
    if (params?.search) q.set('search', params.search);
    if (params?.brand) q.set('brand', params.brand);
    if (params?.is_featured !== undefined) q.set('is_featured', String(params.is_featured));

    const qs = q.toString() ? `?${q.toString()}` : '';
    return fetchJson<Product[]>(`${API_BASE}/products${qs}`);
  },

  async getProductById(id: string): Promise<Product> {
    return fetchJson<Product>(`${API_BASE}/products/${id}`);
  },

  // Alias
  async getProduct(id: string): Promise<Product> {
    return this.getProductById(id);
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    return fetchJson<Product>(`${API_BASE}/products`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    return fetchJson<Product>(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return fetchJson<{ success: boolean }>(`${API_BASE}/products/${id}`, {
      method: 'DELETE'
    });
  },

  // File Upload
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to upload image');
    }
    return res.json();
  },

  // Orders
  async getOrders(userId?: string): Promise<Order[]> {
    const qs = userId ? `?userId=${userId}` : '';
    const raw = await fetchJson<any[]>(`${API_BASE}/orders${qs}`);
    return raw.map(normalizeOrder);
  },

  async getOrderById(id: string): Promise<Order> {
    const raw = await fetchJson<any>(`${API_BASE}/orders/${id}`);
    return normalizeOrder(raw);
  },

  // Alias
  async getOrder(id: string): Promise<Order> {
    return this.getOrderById(id);
  },

  async placeOrder(orderData: {
    user_id?: string | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_address: Address;
    items: { product_id: string; quantity: number; variant_id?: string; variant_name?: string }[];
    notes?: string;
    delivery_type?: 'delivery' | 'pickup';
    pickup_store_id?: string;
    pickup_store_name?: string;
    pickup_store_address?: string;
    pickup_store_phone?: string;
    nearest_store_id?: string;
    nearest_store_name?: string;
  }): Promise<Order> {
    const raw = await fetchJson<any>(`${API_BASE}/orders`, {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
    return normalizeOrder(raw);
  },

  // Alias
  async createOrder(orderData: any): Promise<Order> {
    return this.placeOrder(orderData);
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const raw = await fetchJson<any>(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    return normalizeOrder(raw);
  },

  async resendOrderEmail(orderId: string, type: 'customer_order_confirmation' | 'admin_new_order' = 'customer_order_confirmation'): Promise<{ success: boolean; message: string }> {
    return fetchJson<{ success: boolean; message: string }>(`${API_BASE}/admin/orders/${orderId}/resend-email`, {
      method: 'POST',
      body: JSON.stringify({ type })
    });
  },

  // Razorpay & Payments
  async getPublicPaymentSettings(): Promise<{ razorpay_enabled: boolean; razorpay_key_id: string; require_admin_verification: boolean; cod_enabled: boolean }> {
    return fetchJson<{ razorpay_enabled: boolean; razorpay_key_id: string; require_admin_verification: boolean; cod_enabled: boolean }>(`${API_BASE}/settings/payment/public`);
  },

  async getPaymentSettings(): Promise<PaymentSettings> {
    return fetchJson<PaymentSettings>(`${API_BASE}/settings/payment`);
  },

  async updatePaymentSettings(settings: Partial<PaymentSettings>): Promise<PaymentSettings> {
    return fetchJson<PaymentSettings>(`${API_BASE}/settings/payment`, {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  },

  async createRazorpayOrder(orderData: {
    user_id?: string | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_address: Address;
    items: { product_id: string; quantity: number; variant_id?: string; variant_name?: string }[];
    notes?: string;
    delivery_type?: 'delivery' | 'pickup';
    pickup_store_id?: string;
    pickup_store_name?: string;
    pickup_store_address?: string;
    pickup_store_phone?: string;
    nearest_store_id?: string;
    nearest_store_name?: string;
  }): Promise<{
    razorpay_order_id: string;
    amount: number;
    amount_in_rupees: number;
    currency: string;
    key_id: string;
    transaction_id: string;
    store_name: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  }> {
    return fetchJson(`${API_BASE}/payment/razorpay/create-order`, {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  async verifyAndPlaceRazorpayOrder(payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    transaction_id?: string;
    user_id?: string | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_address: Address;
    items: { product_id: string; quantity: number; variant_id?: string; variant_name?: string }[];
    notes?: string;
    delivery_type?: 'delivery' | 'pickup';
    pickup_store_id?: string;
    pickup_store_name?: string;
    pickup_store_address?: string;
    pickup_store_phone?: string;
    nearest_store_id?: string;
    nearest_store_name?: string;
  }): Promise<{
    order: Order;
    verified: boolean;
    require_admin_verification: boolean;
  }> {
    const raw = await fetchJson<any>(`${API_BASE}/payment/razorpay/verify-and-place-order`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return {
      ...raw,
      order: normalizeOrder(raw.order)
    };
  },

  async recordPaymentFailure(payload: {
    transaction_id?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    error_code?: string;
    error_description?: string;
    reason?: string;
  }): Promise<{ success: boolean }> {
    return fetchJson<{ success: boolean }>(`${API_BASE}/payment/razorpay/record-failure`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async verifyOrderPayment(orderId: string): Promise<{ success: boolean; message: string; order: Order; transaction?: Transaction }> {
    const raw = await fetchJson<any>(`${API_BASE}/admin/orders/${orderId}/verify-payment`, {
      method: 'POST'
    });
    return {
      ...raw,
      order: normalizeOrder(raw.order)
    };
  },

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    return fetchJson<Transaction[]>(`${API_BASE}/admin/transactions`);
  },

  async getTransactionById(id: string): Promise<{ transaction: Transaction; order?: Order }> {
    const raw = await fetchJson<{ transaction: Transaction; order?: any }>(`${API_BASE}/admin/transactions/${id}`);
    return {
      ...raw,
      order: raw.order ? normalizeOrder(raw.order) : undefined
    };
  },

  // Settings
  async getStoreSettings(): Promise<StoreSettings> {
    return fetchJson<StoreSettings>(`${API_BASE}/settings/store`);
  },

  async updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    return fetchJson<StoreSettings>(`${API_BASE}/settings/store`, {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  },

  async getEmailSettings(): Promise<EmailSettings> {
    return fetchJson<EmailSettings>(`${API_BASE}/settings/email`);
  },

  async updateEmailSettings(settings: Partial<EmailSettings>): Promise<EmailSettings> {
    return fetchJson<EmailSettings>(`${API_BASE}/settings/email`, {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  },

  // Admin Analytics & Logs
  async getDashboardStats(): Promise<DashboardStats> {
    const raw = await fetchJson<any>(`${API_BASE}/admin/dashboard`);
    return {
      stats: {
        total_orders: raw.totalOrders ?? 0,
        total_revenue: raw.totalRevenue ?? 0,
        active_products: raw.totalProducts ?? 0,
        total_customers: raw.totalCustomers ?? 0
      },
      recent_orders: (raw.recentOrders || []).map(normalizeOrder),
      low_stock_products: raw.lowStockProducts || []
    };
  },

  // Alias
  async getAdminStats(): Promise<DashboardStats> {
    return this.getDashboardStats();
  },

  async getEmailLogs(): Promise<EmailLog[]> {
    const raw = await fetchJson<any[]>(`${API_BASE}/admin/email-logs`);
    return raw.map(l => ({
      ...l,
      created_at: l.created_at ?? l.sent_at
    }));
  },

  async getAdminCustomers(): Promise<any[]> {
    return fetchJson<any[]>(`${API_BASE}/admin/customers`);
  },

  async getCustomerDetails(id: string): Promise<any> {
    return fetchJson<any>(`${API_BASE}/admin/customers/${id}`);
  },

  async getAdmins(): Promise<UserProfile[]> {
    return fetchJson<UserProfile[]>(`${API_BASE}/admin/admins`);
  },

  async createAdmin(data: {
    email: string;
    password: string;
    full_name: string;
    role: 'admin' | 'super_admin';
    phone?: string;
    assigned_store_ids?: string[];
  }): Promise<UserProfile> {
    return fetchJson<UserProfile>(`${API_BASE}/admin/admins`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateAdmin(id: string, data: {
    full_name?: string;
    phone?: string;
    role?: 'admin' | 'super_admin';
    password?: string;
    assigned_store_ids?: string[];
  }): Promise<UserProfile> {
    return fetchJson<UserProfile>(`${API_BASE}/admin/admins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteAdmin(id: string): Promise<{ success: boolean; message?: string }> {
    return fetchJson<{ success: boolean; message?: string }>(`${API_BASE}/admin/admins/${id}`, {
      method: 'DELETE'
    });
  },

  // Stores
  async getStores(all = false): Promise<StoreLocation[]> {
    return fetchJson<StoreLocation[]>(`${API_BASE}/stores${all ? '?all=true' : ''}`);
  },

  async getStoreById(id: string): Promise<StoreLocation> {
    return fetchJson<StoreLocation>(`${API_BASE}/stores/${id}`);
  },

  async createStore(data: Partial<StoreLocation>): Promise<StoreLocation> {
    return fetchJson<StoreLocation>(`${API_BASE}/stores`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateStore(id: string, data: Partial<StoreLocation>): Promise<StoreLocation> {
    return fetchJson<StoreLocation>(`${API_BASE}/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteStore(id: string): Promise<{ success: boolean; message?: string }> {
    return fetchJson<{ success: boolean; message?: string }>(`${API_BASE}/stores/${id}`, {
      method: 'DELETE'
    });
  },

  async sendTestEmail(to?: string): Promise<{ success: boolean; message: string; messageId?: string; previewUrl?: string; error?: string }> {
    return fetchJson<{ success: boolean; message: string; messageId?: string; previewUrl?: string; error?: string }>(`${API_BASE}/admin/send-test-email`, {
      method: 'POST',
      body: JSON.stringify({ to })
    });
  },

  async sendCustomEmail(data: {
    to: string;
    subject: string;
    message: string;
    recipient_name?: string;
  }): Promise<{ success: boolean; message?: string; messageId?: string; previewUrl?: string; error?: string }> {
    return fetchJson<{ success: boolean; message?: string; messageId?: string; previewUrl?: string; error?: string }>(`${API_BASE}/admin/send-custom-email`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async submitContactForm(data: {
    name: string;
    email?: string;
    phone?: string;
    enquiry_type?: string;
    message: string;
    user_id?: string;
  }): Promise<{ success: boolean; message: string; id?: string }> {
    return fetchJson<{ success: boolean; message: string; id?: string }>(`${API_BASE}/contact`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getContactMessages(): Promise<any[]> {
    return fetchJson<any[]>(`${API_BASE}/admin/contact-messages`);
  },

  async retryEmailLog(id: string): Promise<{ success: boolean; message: string }> {
    return fetchJson<{ success: boolean; message: string }>(`${API_BASE}/admin/email-logs/${id}/retry`, {
      method: 'POST'
    });
  },

  // Support Queries & Helpdesk (Requirement 3)
  async getSupportQueries(optionsOrEmail?: { all?: boolean; user_id?: string; email?: string } | string, userIdParam?: string): Promise<SupportQuery[]> {
    const q = new URLSearchParams();
    if (typeof optionsOrEmail === 'object') {
      if (optionsOrEmail.all) q.set('all', 'true');
      if (optionsOrEmail.user_id) q.set('user_id', optionsOrEmail.user_id);
      if (optionsOrEmail.email) q.set('email', optionsOrEmail.email);
    } else if (typeof optionsOrEmail === 'string') {
      q.set('email', optionsOrEmail);
      if (userIdParam) q.set('user_id', userIdParam);
    }
    const qs = q.toString() ? `?${q.toString()}` : '';
    return fetchJson<SupportQuery[]>(`${API_BASE}/queries${qs}`);
  },

  async getSupportQuery(id: string): Promise<SupportQuery> {
    return fetchJson<SupportQuery>(`${API_BASE}/queries/${id}`);
  },

  async submitSupportQuery(data: {
    name: string;
    email: string;
    phone?: string;
    enquiry_type?: string;
    subject?: string;
    message: string;
    user_id?: string;
  }): Promise<SupportQuery> {
    return fetchJson<SupportQuery>(`${API_BASE}/queries`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async replySupportQuery(
    id: string,
    messageOrData: string | {
      message: string;
      sender?: 'user' | 'admin';
      sender_name?: string;
    },
    arg3?: string,
    arg4?: string
  ): Promise<SupportQuery> {
    let payload: { message: string; sender?: 'user' | 'admin'; sender_name?: string };
    if (typeof messageOrData === 'object') {
      payload = messageOrData;
    } else {
      let sender: 'user' | 'admin' = 'admin';
      let sender_name = 'Admin Support';

      if (arg3 === 'user' || arg3 === 'Customer' || arg3 === 'customer') {
        sender = 'user';
        sender_name = arg4 || 'Customer';
      } else if (arg4 === 'user' || arg4 === 'Customer' || arg4 === 'customer') {
        sender = 'user';
        sender_name = arg3 || 'Customer';
      } else if (arg3 === 'admin' || arg3 === 'Admin') {
        sender = 'admin';
        sender_name = arg4 || 'Admin Support';
      } else if (arg3) {
        sender_name = arg3;
      }
      payload = {
        message: messageOrData,
        sender,
        sender_name
      };
    }
    return fetchJson<SupportQuery>(`${API_BASE}/queries/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async updateSupportQueryStatus(id: string, status: string): Promise<SupportQuery> {
    return fetchJson<SupportQuery>(`${API_BASE}/queries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Auth & Addresses
  async login(
    email: string,
    password: string
  ): Promise<{ user?: UserProfile; token?: string; otp_required?: boolean; email?: string; message?: string }> {
    return fetchJson<{ user?: UserProfile; token?: string; otp_required?: boolean; email?: string; message?: string }>(
      `${API_BASE}/auth/login`,
      {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }
    );
  },

  async verifyOtp(
    emailOrData: string | { email: string; otp: string; type?: 'login' | 'register' },
    otpParam?: string,
    typeParam?: 'login' | 'register'
  ): Promise<{ user: UserProfile; token: string; message: string }> {
    let payload: { email: string; otp: string; type?: 'login' | 'register' };
    if (typeof emailOrData === 'object') {
      payload = emailOrData;
    } else {
      payload = {
        email: emailOrData,
        otp: otpParam || '',
        type: typeParam
      };
    }
    return fetchJson<{ user: UserProfile; token: string; message: string }>(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async resendOtp(email: string, type: 'login' | 'register' = 'login'): Promise<{ success: boolean; message: string }> {
    return fetchJson<{ success: boolean; message: string }>(`${API_BASE}/auth/resend-otp`, {
      method: 'POST',
      body: JSON.stringify({ email, type })
    });
  },

  async loginWithGoogle(data: {
    email: string;
    full_name?: string;
    google_id?: string;
    avatar_url?: string;
  }): Promise<{ user: UserProfile; token: string }> {
    return fetchJson<{ user: UserProfile; token: string }>(`${API_BASE}/auth/google`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async register(data: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
  }): Promise<{ user?: UserProfile; token?: string; otp_required?: boolean; email?: string; message?: string }> {
    return fetchJson<{ user?: UserProfile; token?: string; otp_required?: boolean; email?: string; message?: string }>(
      `${API_BASE}/auth/register`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    );
  },

  async getAddresses(userId: string): Promise<Address[]> {
    return fetchJson<Address[]>(`${API_BASE}/addresses?userId=${userId}`);
  },

  async saveAddress(address: Address): Promise<Address> {
    if (address.id && !address.id.startsWith('temp_')) {
      return fetchJson<Address>(`${API_BASE}/addresses/${address.id}`, {
        method: 'PUT',
        body: JSON.stringify(address)
      });
    } else {
      const { id: _, ...payload } = address;
      return fetchJson<Address>(`${API_BASE}/addresses`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }
  },

  async deleteAddress(id: string): Promise<{ success: boolean }> {
    return fetchJson<{ success: boolean }>(`${API_BASE}/addresses/${id}`, {
      method: 'DELETE'
    });
  },

  async getMe(): Promise<{ user: UserProfile; valid: boolean }> {
    return fetchJson<{ user: UserProfile; valid: boolean }>(`${API_BASE}/auth/me`);
  },

  async updateProfile(data: { full_name?: string; phone?: string }): Promise<{ user: UserProfile; message: string }> {
    return fetchJson<{ user: UserProfile; message: string }>(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async logoutServer(): Promise<{ success: boolean }> {
    try {
      return await fetchJson<{ success: boolean }>(`${API_BASE}/auth/logout`, {
        method: 'POST'
      });
    } catch {
      return { success: true };
    }
  }
};
