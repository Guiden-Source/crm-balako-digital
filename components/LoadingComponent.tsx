import Image from "next/image";

const LoadingComponent = () => {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <Image
            src="/images/balako-logo-svg4.svg"
            alt="Balako Digital"
            width={120}
            height={120}
            className="animate-pulse"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#21808D] animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 rounded-full bg-[#21808D] animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 rounded-full bg-[#21808D] animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-lg font-medium text-muted-foreground">
            Carregando dashboard...
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;
