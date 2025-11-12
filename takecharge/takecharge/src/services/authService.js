import { supabase } from '../lib/supabase';

/**
 * Authentication Service - Handles all authentication operations
 */

/**
 * Sign up a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Object} metadata - Additional user metadata (name, phone, etc.)
 * @returns {Promise<Object>} User data and session
 */
export const signUp = async (email, password, metadata = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata.fullName || metadata.name || '',
          phone: metadata.phone || '',
        },
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { data: null, error };
  }
};

/**
 * Sign in a user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and session
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { data: null, error };
  }
};

/**
 * Sign out the current user
 * @returns {Promise<Object>} Success status
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
};

/**
 * Get the current authenticated user
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, error };
  }
};

/**
 * Get the current session
 * @returns {Promise<Object>} Current session data
 */
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session, error: null };
  } catch (error) {
    console.error('Error getting session:', error);
    return { session: null, error };
  }
};

/**
 * Reset password - sends password reset email
 * @param {string} email - User email
 * @returns {Promise<Object>} Success status
 */
export const resetPassword = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { data: null, error };
  }
};

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Success status
 */
export const updatePassword = async (newPassword) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating password:', error);
    return { data: null, error };
  }
};

/**
 * Sign in with Google OAuth
 * @returns {Promise<Object>} Redirect URL or error
 */
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/main-dashboard`,
        queryParams: {
          prompt: 'select_account', // Force Google to show account selector every time
        },
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return { data: null, error };
  }
};

/**
 * Update user metadata
 * @param {Object} metadata - User metadata to update
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserMetadata = async (metadata) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user metadata:', error);
    return { data: null, error };
  }
};

/**
 * Resend email confirmation
 * @param {string} email - User email address
 * @returns {Promise<Object>} Success status
 */
export const resendEmailConfirmation = async (email) => {
  try {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/main-dashboard`,
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error resending email confirmation:', error);
    return { data: null, error };
  }
};

/**
 * Update user email address
 * @param {string} newEmail - New email address
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserEmail = async (newEmail) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user email:', error);
    return { data: null, error };
  }
};

