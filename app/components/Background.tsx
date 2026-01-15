export default function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="orb-1"></div>
      <div className="orb-2"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
    </div>
  );
}
