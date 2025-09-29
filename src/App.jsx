/* Tiny image fallback component (no external files needed) */
function Img({ src, alt, className='' }){
  const [usePlaceholder, setUsePlaceholder] = React.useState(false);
  // Minimal gold-on-black SVG placeholder encoded as data URI:
  const placeholder = 'data:image/svg+xml;utf8,' +
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
