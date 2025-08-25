import toast from 'react-hot-toast'

export interface ToastOptions {
  duration?: number
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  style?: React.CSSProperties
  className?: string
  icon?: string | React.ReactElement
}

export function useToast() {
  const showToast = (message: string, options?: ToastOptions) => {
    return toast(message, {
      duration: options?.duration ?? 4000,
      position: options?.position ?? 'top-right',
      style: {
        background: 'hsl(var(--card))',
        color: 'hsl(var(--foreground))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        ...options?.style,
      },
      className: options?.className,
      icon: options?.icon,
    })
  }

  const success = (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      duration: options?.duration ?? 4000,
      position: options?.position ?? 'top-right',
      style: {
        background: 'hsl(var(--card))',
        color: 'hsl(var(--foreground))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        ...options?.style,
      },
      className: options?.className,
      icon: options?.icon,
    })
  }

  const error = (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      duration: options?.duration ?? 5000,
      position: options?.position ?? 'top-right',
      style: {
        background: 'hsl(var(--card))',
        color: 'hsl(var(--foreground))',
        border: '1px solid hsl(var(--destructive))',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        ...options?.style,
      },
      className: options?.className,
      icon: options?.icon,
    })
  }

  const loading = (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      position: options?.position ?? 'top-right',
      style: {
        background: 'hsl(var(--card))',
        color: 'hsl(var(--foreground))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        ...options?.style,
      },
      className: options?.className,
      icon: options?.icon,
    })
  }

  const dismiss = (toastId?: string) => {
    toast.dismiss(toastId)
  }

  const promise = <T,>(
    promise: Promise<T>,
    msgs: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    },
    options?: ToastOptions
  ) => {
    return toast.promise(promise, msgs, {
      style: {
        background: 'hsl(var(--card))',
        color: 'hsl(var(--foreground))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        ...options?.style,
      },
      position: options?.position ?? 'top-right',
    })
  }

  return {
    toast: showToast,
    success,
    error,
    loading,
    dismiss,
    promise,
  }
}

// Export individual functions for convenience
export const toast = {
  success: (message: string, options?: ToastOptions) => toast.success(message, options),
  error: (message: string, options?: ToastOptions) => toast.error(message, options),
  loading: (message: string, options?: ToastOptions) => toast.loading(message, options),
  dismiss: (toastId?: string) => toast.dismiss(toastId),
}
