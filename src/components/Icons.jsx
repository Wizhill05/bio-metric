// 8-bit pixel art icons — each drawn on an 8×8 grid rendered into a 16×16 SVG
// Every '1' becomes a 2×2 rect for the authentic pixel look.

const mkIcon = (rows, size, rest) => {
  const rects = rows.trim().split('\n').flatMap((row, y) =>
    row.trim().split('').map((c, x) =>
      c === '1' ? <rect key={`${x}-${y}`} x={x * 2} y={y * 2} width={2} height={2} /> : null
    )
  );
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
      shapeRendering="crispEdges" style={{ imageRendering: 'pixelated', display: 'block' }} {...rest}>
      {rects}
    </svg>
  );
};

export const MicroscopeIcon = ({ size = 16, ...p }) => mkIcon(`
  00110000
  00110000
  01111000
  00110000
  01111100
  01001100
  01111100
  11111110
`, size, p);

export const PersonIcon = ({ size = 16, ...p }) => mkIcon(`
  01111100
  01111100
  00111000
  01111100
  11111110
  01111100
  01001100
  01001100
`, size, p);

export const SearchIcon = ({ size = 16, ...p }) => mkIcon(`
  01110000
  10001000
  10001000
  10001000
  01110000
  00011000
  00001100
  00000110
`, size, p);

export const BrainIcon = ({ size = 16, ...p }) => mkIcon(`
  01101100
  11111110
  11111110
  01111100
  01111100
  00111000
  00010000
  00010000
`, size, p);

export const DocumentIcon = ({ size = 16, ...p }) => mkIcon(`
  01111100
  01000100
  01110100
  01000100
  01111100
  01010100
  01010100
  01111100
`, size, p);

export const SunIcon = ({ size = 16, ...p }) => mkIcon(`
  00100000
  10111010
  01110000
  11111100
  01110000
  10111010
  00100000
  00000000
`, size, p);

export const MoonIcon = ({ size = 16, ...p }) => mkIcon(`
  00111000
  01110000
  11100000
  11100000
  11100000
  01110000
  00111100
  00000000
`, size, p);

export const PowerIcon = ({ size = 16, ...p }) => mkIcon(`
  00110000
  01111000
  10000100
  10110100
  10110100
  10000100
  01111000
  00110000
`, size, p);

export const ChatIcon = ({ size = 16, ...p }) => mkIcon(`
  11111110
  10000010
  10101010
  10000010
  10101010
  11111110
  01000000
  11000000
`, size, p);

export const GearIcon = ({ size = 16, ...p }) => mkIcon(`
  00110000
  01111100
  11011010
  10010110
  11011010
  01111100
  00110000
  00000000
`, size, p);

export const LightbulbIcon = ({ size = 16, ...p }) => mkIcon(`
  01110000
  11111100
  11111100
  11111100
  01111000
  00111000
  00111000
  00010000
`, size, p);

export const DNAIcon = ({ size = 16, ...p }) => mkIcon(`
  11000110
  01001100
  00111000
  01001100
  10110010
  01001100
  00111000
  01001100
`, size, p);

export const BookIcon = ({ size = 16, ...p }) => mkIcon(`
  11111110
  10110010
  10110010
  10110010
  10110010
  10110010
  11111110
  00000000
`, size, p);

export const LeafIcon = ({ size = 16, ...p }) => mkIcon(`
  00001110
  00011110
  01111100
  01111000
  11110000
  01100000
  00110000
  00110000
`, size, p);

export const ArrowRightIcon = ({ size = 16, ...p }) => mkIcon(`
  00100000
  00110000
  11111100
  11111110
  11111100
  00110000
  00100000
  00000000
`, size, p);

export const HistoryIcon = ({ size = 16, ...p }) => mkIcon(`
  01110000
  10001000
  10101000
  10111000
  10001000
  10001000
  01110000
  00000000
`, size, p);

export const TrashIcon = ({ size = 16, ...p }) => mkIcon(`
  01010000
  11111000
  11111000
  10001000
  10001000
  10001000
  11111000
  00000000
`, size, p);

export const ChevronLeftIcon = ({ size = 16, ...p }) => mkIcon(`
  00100000
  01000000
  10000000
  10000000
  10000000
  01000000
  00100000
  00000000
`, size, p);

export const ChevronRightIcon = ({ size = 16, ...p }) => mkIcon(`
  10000000
  01000000
  00100000
  00100000
  00100000
  01000000
  10000000
  00000000
`, size, p);
