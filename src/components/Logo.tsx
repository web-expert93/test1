export function NovaStar({ className = '' }: { className?: string }) {
  return <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 5h14v14H5z" /><path d="m12 2 10 10-10 10L2 12Z" /><path d="m12 8 4 4-4 4-4-4Z" fill="var(--paper)" /></svg>
}

export function Logo({ footer = false }: { footer?: boolean }) {
  return <a className={`logo ${footer ? 'logo-footer' : ''}`} href="#home" aria-label="Nova Mart home"><NovaStar /><span>NOVA <span className="wordmark-mart">MART</span>{footer && <small lang="bn">নোভা মার্ট</small>}</span></a>
}
