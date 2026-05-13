type LogoMarkProps = {
  className?: string;
};

export function LogoMark({ className = "h-9 w-9" }: LogoMarkProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="29" width="50" height="23" rx="11.5" fill="#FFFACC" stroke="#53131E" strokeWidth="3" />
      <path d="M17 29V18.5C17 16.6 18.6 15 20.5 15H43.5C45.4 15 47 16.6 47 18.5V29" stroke="#53131E" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 24C26 20 29 14.5 27 8C34 12 38.5 17 38.5 24" fill="#B5D6B2" />
      <path d="M22 24C26 20 29 14.5 27 8C34 12 38.5 17 38.5 24" stroke="#53131E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 26C33 23.5 34 20.5 33.5 17.5C37.5 20 40 23.5 40 29" stroke="#53131E" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 38H50" stroke="#53131E" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="44" r="2" fill="#53131E" />
      <circle cx="32" cy="44" r="2" fill="#53131E" />
      <circle cx="40" cy="44" r="2" fill="#53131E" />
    </svg>
  );
}
