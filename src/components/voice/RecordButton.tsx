import { Mic, Square } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useAppState } from '../../state/useAppState';

interface RecordButtonProps {
  size?: 'md' | 'lg';
  className?: string;
}

export function RecordButton({ size = 'md', className }: RecordButtonProps) {
  const { session, startRecording, stopRecording } = useAppState();
  const isRecording = session.isRecording;
  const Icon = isRecording ? Square : Mic;

  return (
    <button
      type="button"
      aria-label={isRecording ? 'Stop dictation' : 'Start dictation'}
      aria-pressed={isRecording}
      onClick={isRecording ? stopRecording : startRecording}
      className={cn(
        'record-shadow relative grid shrink-0 place-items-center rounded-full text-white transition-transform hover:scale-[1.04] active:scale-[0.97]',
        size === 'lg' ? 'h-20 w-20' : 'h-14 w-14',
        className,
      )}
      style={{ backgroundColor: 'var(--accent)' }}
    >
      {isRecording && (
        <span
          className="pulse-ring absolute inset-0 rounded-full"
          style={{ backgroundColor: 'var(--accent)' }}
        />
      )}
      <Icon
        className={cn('relative', size === 'lg' ? 'h-7 w-7' : 'h-5 w-5')}
        strokeWidth={2}
        fill={isRecording ? 'currentColor' : 'none'}
      />
    </button>
  );
}
