// AIToggleSwitch - Toggle AI on/off (admin)
'use client';

interface AIToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export function AIToggleSwitch({ enabled, onChange, disabled = false }: AIToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          enabled 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
            : 'bg-gray-300 dark:bg-gray-600'
        }`}>
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100">AI Assistant</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {enabled ? 'Auto-replying to messages' : 'Manual responses only'}
          </p>
        </div>
      </div>

      <button
        onClick={() => onChange(!enabled)}
        disabled={disabled}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
