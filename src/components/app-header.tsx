import { ArrowUpRight, Github, SearchCode, Sparkles } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="border-b border-white/10 bg-gradient-to-r from-zinc-950 via-slate-950 to-zinc-900 text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 text-white shadow-lg shadow-cyan-500/30">
            <SearchCode className="w-6 h-6" />
          </div>

          <div>
            <div className="mb-1 inline-flex items-center gap-1 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
              Made by Mr Moosa
            </div>
            <h1 className="text-2xl font-black font-headline tracking-tight text-white md:text-3xl">
              Code SherLock
            </h1>
          </div>
        </div>

        <a
          href="https://github.com/Mr-Moosa-official/Code-SherLock"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-300"
        >
          <Github className="w-4 h-4" />
          GitHub Repo
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}
