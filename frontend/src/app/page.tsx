export default function Home() {
  return (
    <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center relative">
      <div className="text-center z-10 w-full max-w-4xl p-12 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl">
        <h1 className="text-5xl font-bold bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Código do Eu Profundo
        </h1>
        <p className="mt-6 text-xl text-gray-300">
          Iniciando a Mandala Arquetípica. O seu Hash Simbólico aguarda.
        </p>
      </div>
      
      {/* Decorative background elements for Glassmorphism/Cyberpunk feel */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -z-10" />
    </main>
  );
}
