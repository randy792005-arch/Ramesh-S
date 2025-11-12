import { supabase } from '../lib/supabase';

/**
 * Transaction Service - Handles all transaction-related database operations
 */

/**
 * Create a new transaction
 * @param {Object} transactionData - Transaction information
 * @returns {Promise<Object>} Created transaction
 */
export const createTransaction = async (transactionData) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: transactionData.userId,
          booking_id: transactionData.bookingId,
          transaction_type: transactionData.transactionType, // 'payment', 'refund', 'adjustment'
          amount: transactionData.amount,
          currency: transactionData.currency || 'USD',
          payment_method: transactionData.paymentMethod,
          payment_provider: transactionData.paymentProvider, // 'stripe', 'paypal', 'upi', etc.
          payment_provider_transaction_id: transactionData.paymentProviderTransactionId,
          status: transactionData.status || 'pending', // 'pending', 'completed', 'failed', 'refunded'
          description: transactionData.description,
          metadata: transactionData.metadata, // Additional data as JSON
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating transaction:', error);
    return { data: null, error };
  }
};

/**
 * Get all transactions for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of transactions
 */
export const getUserTransactions = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    return { data: null, error };
  }
};

/**
 * Get a single transaction by ID
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<Object>} Transaction details
 */
export const getTransactionById = async (transactionId) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return { data: null, error };
  }
};

/**
 * Get transactions by booking ID
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Array>} List of transactions
 */
export const getTransactionsByBookingId = async (bookingId) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching transactions by booking:', error);
    return { data: null, error };
  }
};

/**
 * Update transaction status
 * @param {string} transactionId - Transaction ID
 * @param {string} status - New status (pending, completed, failed, refunded)
 * @returns {Promise<Object>} Updated transaction
 */
export const updateTransactionStatus = async (transactionId, status) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating transaction status:', error);
    return { data: null, error };
  }
};

/**
 * Get transactions by status
 * @param {string} userId - User ID
 * @param {string} status - Transaction status
 * @returns {Promise<Array>} List of transactions
 */
export const getTransactionsByStatus = async (userId, status) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching transactions by status:', error);
    return { data: null, error };
  }
};

/**
 * Get transaction summary/stats for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Transaction summary
 */
export const getTransactionSummary = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, status, transaction_type')
      .eq('user_id', userId);

    if (error) throw error;

    const summary = {
      totalTransactions: data.length,
      totalAmount: 0,
      completedAmount: 0,
      pendingAmount: 0,
      refundedAmount: 0,
      byType: {
        payment: 0,
        refund: 0,
        adjustment: 0,
      },
    };

    data.forEach((transaction) => {
      if (transaction.transaction_type === 'payment') {
        summary.totalAmount += transaction.amount;
        summary.byType.payment += transaction.amount;
      } else if (transaction.transaction_type === 'refund') {
        summary.refundedAmount += transaction.amount;
        summary.byType.refund += transaction.amount;
      } else {
        summary.byType.adjustment += transaction.amount;
      }

      if (transaction.status === 'completed') {
        summary.completedAmount += transaction.amount;
      } else if (transaction.status === 'pending') {
        summary.pendingAmount += transaction.amount;
      }
    });

    return { data: summary, error: null };
  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    return { data: null, error };
  }
};









