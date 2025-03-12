import { useState, useEffect } from 'react';
import { User, Session, AuthChangeEvent, Provider } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface AuthError {
  message: string;
  isInfo?: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // 获取初始用户状态
    getUser();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error getting user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      setError({ message: error.message || '登录过程中出现错误' });
      return false;
    } finally {
      setLoading(false);
    }
    return true;
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      setError({ message: '请检查您的邮箱以验证账户', isInfo: true });
      return true;
    } catch (error: any) {
      setError({ message: error.message || '注册过程中出现错误' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      return true;
    } catch (error: any) {
      setError({ message: error.message || '社交登录过程中出现错误' });
      return false;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      return true;
    } catch (error: any) {
      setError({ message: error.message || '退出登录过程中出现错误' });
      return false;
    }
  };

  const clearError = () => setError(null);

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithProvider,
    clearError,
  };
}
