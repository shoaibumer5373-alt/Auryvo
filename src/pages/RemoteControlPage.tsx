import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Keyboard,
  Laptop,
  Link2,
  MousePointer2,
  Play,
  QrCode,
  Radio,
  ShieldCheck,
  Smartphone,
  Volume2,
  Wifi,
} from 'lucide-react';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { createPairingQr } from '../lib/qr';
import { cn } from '../lib/cn';

const PAIRING_PAYLOAD = {
  app: 'auryvo',
  protocol: 'auryvo-remote-v1',
  transport: 'ws',
  host: 'auryvo.local',
  port: 8080,
  session: 'preview-pairing',
};

const REMOTE_ACTIONS = [
  { label: 'Enter', icon: Keyboard, event: 'key_enter' },
  { label: 'Backspace', icon: Keyboard, event: 'key_backspace' },
  { label: 'Copy', icon: Copy, event: 'key_copy' },
  { label: 'Paste', icon: Copy, event: 'key_paste' },
  { label: 'Select all', icon: MousePointer2, event: 'key_select_all' },
  { label: 'Volume up', icon: Volume2, event: 'volume_up' },
  { label: 'Volume down', icon: Volume2, event: 'volume_down' },
  { label: 'Play / pause', icon: Play, event: 'media_play_pause' },
] as const;

export function RemoteControlPage() {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState<string[]>(['Waiting for a local WebSocket connection…']);
  const lastPointerLogRef = useRef(0);
  const payload = useMemo(() => JSON.stringify(PAIRING_PAYLOAD), []);

  useEffect(() => {
    let cancelled = false;

    createPairingQr(payload)
      .then((dataUrl) => {
        if (!cancelled) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl('');
      });

    return () => {
      cancelled = true;
    };
  }, [payload]);

  useEffect(() => {
    if (!copied) return;
    const timerId = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timerId);
  }, [copied]);

  function addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLogs((current) => [`${timestamp} · ${message}`, ...current].slice(0, 7));
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.buttons !== 1) return;
    const now = Date.now();
    if (now - lastPointerLogRef.current < 220) return;
    lastPointerLogRef.current = now;
    addLog(`mouse_move dx ${event.movementX} dy ${event.movementY}`);
  }

  async function copyPairingCode() {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      addLog('Pairing payload copied.');
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Remote control"
        title="Your phone is the remote."
        description="Pair over your local network, dictate from anywhere, and control the cursor with a touch surface."
        actions={
          <span className="pill pill-soft px-4 py-3">
            <Wifi className="h-4 w-4" />
            Local network
          </span>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[0.83fr_1.17fr]">
        <article className="panel rounded-[2.2rem] p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Pair a device</h2>
              <p className="muted mt-1 text-xs">Scan with the Auryvo mobile companion.</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-xl accent-surface">
              <QrCode className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </span>
          </div>

          <div className="mt-6 flex flex-col items-center rounded-[1.7rem] bg-[var(--panel-soft)] p-5">
            <div className="grid h-56 w-56 place-items-center overflow-hidden rounded-[1.5rem] bg-white p-3 shadow-sm">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Auryvo local pairing QR code" className="h-full w-full" />
              ) : (
                <div className="skeleton-shimmer h-full w-full rounded-xl" />
              )}
            </div>
            <p className="mt-4 text-sm font-bold">auryvo.local:8080</p>
            <p className="faint mt-1 text-xs">Session · preview-pairing</p>
            <button
              type="button"
              onClick={copyPairingCode}
              className="pill pill-soft mt-4 px-4 py-2.5"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy pairing payload'}
            </button>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-[1.4rem] bg-[var(--panel-soft)] p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 accent-text" strokeWidth={1.8} />
            <p className="muted text-xs leading-5">
              The QR encodes a preview pairing payload. The production desktop build starts the
              local WebSocket bridge and accepts devices only on your network.
            </p>
          </div>
        </article>

        <div className="space-y-5">
          <article className="panel rounded-[2.2rem] p-6 sm:p-7">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight">Wireless trackpad</h2>
                <p className="muted mt-1 text-xs">Drag here to preview pointer messages.</p>
              </div>
              <span className="pill accent-surface px-3 py-2 text-[0.66rem]">Live preview</span>
            </div>

            <div
              onPointerMove={handlePointerMove}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                addLog('mouse_click left');
              }}
              className="hero-gradient relative grid h-52 cursor-crosshair touch-none place-items-center overflow-hidden rounded-[1.7rem]"
            >
              <div className="grain-overlay" />
              <div className="relative flex flex-col items-center text-[#2b2338] dark:text-white">
                <MousePointer2 className="h-6 w-6" strokeWidth={1.7} />
                <p className="mt-2 text-xs font-bold opacity-70">Move, tap, and scroll</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => addLog('mouse_click left')}
                className="pill pill-soft py-3"
              >
                Left click
              </button>
              <button
                type="button"
                onClick={() => addLog('mouse_click right')}
                className="pill pill-soft py-3"
              >
                Right click
              </button>
              <button
                type="button"
                onClick={() => addLog('scroll dy 120')}
                className="pill pill-soft py-3"
              >
                Scroll
              </button>
            </div>
          </article>

          <article className="panel-flat rounded-[2rem] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 accent-text" strokeWidth={1.8} />
                <h2 className="text-sm font-bold">Connection log</h2>
              </div>
              <button
                type="button"
                onClick={() => setLogs(['Log cleared. Waiting for events…'])}
                className="faint text-xs font-bold hover:text-[var(--accent)]"
              >
                Clear
              </button>
            </div>
            <ul className="soft-scrollbar mt-3 max-h-36 space-y-1.5 overflow-y-auto font-mono text-[0.68rem]">
              {logs.map((log, index) => (
                <li
                  key={`${log}-${index}`}
                  className="muted truncate rounded-lg bg-[var(--panel)] px-3 py-2"
                >
                  {log}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <article className="panel rounded-[2.2rem] p-6 sm:p-7">
          <h2 className="text-lg font-bold tracking-tight">Nearby devices</h2>
          <div className="mt-5 space-y-3">
            {[
              { name: 'Pixel 9 Pro', detail: 'Ready to pair', icon: Smartphone, active: true },
              { name: 'Studio PC', detail: 'Desktop bridge', icon: Laptop, active: false },
            ].map(({ name, detail, icon: Icon, active }) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-[1.4rem] border border-[var(--line)] bg-[var(--panel-soft)] p-4"
              >
                <span
                  className={cn(
                    'grid h-10 w-10 place-items-center rounded-xl',
                    active ? 'accent-surface' : 'bg-[var(--panel)]',
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold">{name}</p>
                  <p className="muted text-xs">{detail}</p>
                </div>
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    active ? 'bg-[#55c79e]' : 'bg-[var(--text-tertiary)]',
                  )}
                />
              </div>
            ))}
          </div>
        </article>

        <article className="panel rounded-[2.2rem] p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Remote keystroke deck</h2>
              <p className="muted mt-1 text-xs">Common controls at your fingertips.</p>
            </div>
            <Keyboard className="h-5 w-5 accent-text" strokeWidth={1.8} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {REMOTE_ACTIONS.map(({ label, icon: Icon, event }, index) => (
              <button
                key={label}
                type="button"
                onClick={() => addLog(event)}
                className="panel-hover group flex flex-col items-center gap-2 rounded-[1.35rem] border border-[var(--line)] bg-[var(--panel-soft)] px-3 py-4 text-center"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--panel)] transition group-hover:accent-surface">
                  {index === 5 ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : index === 6 ? (
                    <ArrowDown className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  )}
                </span>
                <span className="text-[0.7rem] font-bold">{label}</span>
              </button>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
