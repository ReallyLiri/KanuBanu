type AuthScreenProps = {
  error: string;
  onSignIn: () => void;
};

export function AuthScreen({ error, onSignIn }: AuthScreenProps) {
  const screen =
    "grid min-h-screen place-items-center bg-[radial-gradient(circle_at_75%_20%,#241544_0,transparent_28%),#090714] p-6 font-sans text-[#f5efff]";
  return (
    <main className={screen}>
      <div className="w-full max-w-[455px]">
        <h1 className="mb-4 text-[clamp(38px,6vw,57px)] leading-[1.02] font-bold tracking-[-.06em]">
          KanuBanu
        </h1>
        <img
          src="/lim-sleep.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-[20%] select-none md:top-[5%]"
        />
        <button
          className="mt-[29px] flex w-full cursor-pointer items-center justify-center gap-3 rounded-[9px] border border-[#7df9ff80] bg-[#171126] p-[15px] font-semibold text-[#f5efff] shadow-[0_0_24px_#7df9ff33] hover:bg-[#21193a]"
          onClick={onSignIn}
        >
          Continue with Google
        </button>
        {error && (
          <small className="mt-3.5 block text-[#ff9ed8]">{error}</small>
        )}
      </div>
    </main>
  );
}
