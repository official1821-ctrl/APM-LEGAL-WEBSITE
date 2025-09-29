import React from "react";

/* Tiny image fallback component (no external files needed) */
function Img({ src, alt, className = "" }) {
  const [usePlaceholder, setUsePlaceholder] = React.useState(false);
  const placeholder =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
         <rect width="100%" height="100%" fill="#0A0A0B"/>
         <text x="50%" y="52%" fill="#C8A04D" font-family="Playfair Display, serif"
               font-size="42" font-weight="600" text-anchor="middle">APM LEGAL</text>
       </svg>`
    );

  return (
    <img
      src={usePlaceholder ? placeholder : src}
      alt={alt}
      className={className}
      onError={() => setUsePlaceholder(true)}
      loading="lazy"
      decoding="async"
    />
  );
}

/* Main App component */
function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl md:text-6xl font-serif text-[#C8A04D] mb-4">
        APM Legal
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
        Boutique criminal defence & litigation firm — coming soon.
      </p>
      <div className="w-full max-w-xl">
        <Img alt="hero" src="/assets/hero1.jpg" className="rounded-xl w-full" />
      </div>
    </div>
  );
}

export default App;
