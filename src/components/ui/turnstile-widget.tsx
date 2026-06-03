'use client';

import { Turnstile, type TurnstileProps } from '@marsidev/react-turnstile';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: () => void;
}

export default function TurnstileWidget({ onVerify, onError }: TurnstileWidgetProps) {
  const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) {
    console.warn('PUBLIC_TURNSTILE_SITE_KEY is not set');
    return null;
  }

  const handleSuccess: TurnstileProps['onSuccess'] = (token) => {
    onVerify(token);
  };

  return (
    <div className="flex justify-center">
      <Turnstile
        siteKey={siteKey}
        onSuccess={handleSuccess}
        onError={onError}
        options={{
          theme: 'dark',
        }}
      />
    </div>
  );
}
