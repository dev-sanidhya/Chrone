'use client';

import type { Season } from '@/lib/types';

interface Props {
  season: Season;
  month: number;
  primaryColor: string;
}

/* ─────────────────────── WINTER ─────────────────────── */
function WinterScene({ month }: { month: number }) {
  const isDecember = month === 11;
  return (
    <svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="w-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#030712"/>
          <stop offset="55%"  stopColor="#0c1a3e"/>
          <stop offset="100%" stopColor="#162555"/>
        </linearGradient>
        <linearGradient id="w-aurora" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#00c896" stopOpacity="0"/>
          <stop offset="35%"  stopColor="#00c896" stopOpacity="0.45"/>
          <stop offset="70%"  stopColor="#7c3aed" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="w-snow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#c8dcf0"/>
          <stop offset="100%" stopColor="#e8f4ff"/>
        </linearGradient>
        <filter id="w-glow"><feGaussianBlur stdDeviation="5"/></filter>
        <filter id="w-soft"><feGaussianBlur stdDeviation="2"/></filter>
      </defs>

      {/* Sky */}
      <rect width="600" height="340" fill="url(#w-sky)"/>

      {/* Stars */}
      {[
        [22,18],[65,32],[112,14],[158,42],[205,22],[248,8],[292,36],[338,16],
        [382,44],[428,10],[474,30],[516,20],[554,46],[88,62],[175,68],[265,55],
        [345,70],[435,58],[498,65],[32,82],[130,88],[220,78],[310,90],[400,75],[490,85],
      ].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r={i%3===0?1.3:i%3===1?0.9:0.6} fill="white" opacity={0.5+Math.sin(i)*0.35}/>
      ))}

      {/* Aurora */}
      <ellipse cx="280" cy="88" rx="310" ry="28" fill="url(#w-aurora)" filter="url(#w-glow)" opacity="0.9"/>
      <ellipse cx="320" cy="112" rx="240" ry="20" fill="url(#w-aurora)" filter="url(#w-glow)" opacity="0.55"/>

      {/* Far mountain range */}
      <path d="M0,340 L0,208 L55,168 L100,195 L155,148 L215,178 L268,132 L330,168 L385,128 L445,158 L500,122 L555,150 L600,132 L600,210 L600,340 Z"
            fill="#1a2d56" opacity="0.75"/>
      {/* Snow caps far */}
      <path d="M155,148 L144,172 L166,172 Z" fill="white" opacity="0.7"/>
      <path d="M268,132 L255,158 L281,158 Z" fill="white" opacity="0.7"/>
      <path d="M385,128 L372,155 L398,155 Z" fill="white" opacity="0.7"/>
      <path d="M500,122 L486,150 L514,150 Z" fill="white" opacity="0.7"/>

      {/* Near mountain range */}
      <path d="M0,340 L0,258 L55,220 L115,252 L178,198 L245,238 L308,188 L372,228 L435,185 L498,222 L560,182 L600,205 L600,340 Z"
            fill="#0d1a33"/>
      {/* Snow caps near */}
      <path d="M178,198 L163,224 L193,224 Z" fill="white" opacity="0.88"/>
      <path d="M308,188 L292,216 L324,216 Z" fill="white" opacity="0.88"/>
      <path d="M435,185 L418,214 L452,214 Z" fill="white" opacity="0.88"/>

      {/* Snowy ground */}
      <path d="M0,322 Q80,308 160,318 Q250,326 340,312 Q430,300 520,315 Q565,320 600,308 L600,340 L0,340 Z"
            fill="url(#w-snow)" opacity="0.92"/>

      {/* Moon (crescent) */}
      {!isDecember ? (
        <>
          <circle cx="508" cy="52" r="24" fill="#dde8ff" opacity="0.88" filter="url(#w-soft)"/>
          <circle cx="518" cy="46" r="20" fill="#0c1a3e"/>
        </>
      ) : (
        /* Christmas star for December */
        <>
          <circle cx="508" cy="52" r="18" fill="#ffffaa" opacity="0.5" filter="url(#w-glow)"/>
          <circle cx="508" cy="52" r="6" fill="#ffffee" opacity="0.95"/>
          <line x1="508" y1="34" x2="508" y2="70" stroke="#ffffcc" strokeWidth="1.5" opacity="0.7"/>
          <line x1="490" y1="52" x2="526" y2="52" stroke="#ffffcc" strokeWidth="1.5" opacity="0.7"/>
          <line x1="495" y1="39" x2="521" y2="65" stroke="#ffffcc" strokeWidth="1" opacity="0.5"/>
          <line x1="521" y1="39" x2="495" y2="65" stroke="#ffffcc" strokeWidth="1" opacity="0.5"/>
        </>
      )}
    </svg>
  );
}

/* ─────────────────────── SPRING ─────────────────────── */
function SpringScene({ month }: { month: number }) {
  const isApril = month === 3;
  return (
    <svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={isApril ? "#4a1942" : "#1a3a5c"}/>
          <stop offset="40%"  stopColor={isApril ? "#c2185b" : "#2e6da4"}/>
          <stop offset="100%" stopColor={isApril ? "#f48fb1" : "#87ceeb"}/>
        </linearGradient>
        <linearGradient id="sp-hill1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={isApril ? "#7b1fa2" : "#388e3c"}/>
          <stop offset="100%" stopColor={isApril ? "#4a148c" : "#1b5e20"}/>
        </linearGradient>
        <linearGradient id="sp-hill2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={isApril ? "#9c27b0" : "#4caf50"}/>
          <stop offset="100%" stopColor={isApril ? "#6a1b9a" : "#2e7d32"}/>
        </linearGradient>
        <linearGradient id="sp-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={isApril ? "#ce93d8" : "#66bb6a"}/>
          <stop offset="100%" stopColor={isApril ? "#ba68c8" : "#43a047"}/>
        </linearGradient>
        <filter id="sp-glow"><feGaussianBlur stdDeviation="8"/></filter>
        <filter id="sp-bloom"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>

      {/* Sky */}
      <rect width="600" height="340" fill="url(#sp-sky)"/>

      {/* Sun / soft glow */}
      <circle cx="480" cy="65" r="55" fill={isApril ? "#f8bbd0" : "#fff176"} opacity="0.25" filter="url(#sp-glow)"/>
      <circle cx="480" cy="65" r="28" fill={isApril ? "#f48fb1" : "#fff59d"} opacity="0.6" filter="url(#sp-bloom)"/>
      <circle cx="480" cy="65" r="18" fill={isApril ? "#ffffff" : "#ffff8d"} opacity="0.88"/>

      {/* Far hills */}
      <path d="M0,340 L0,225 Q80,175 160,210 Q240,175 320,195 Q400,160 480,190 Q540,170 600,185 L600,340 Z"
            fill="url(#sp-hill1)" opacity="0.7"/>

      {/* Near hills */}
      <path d="M0,340 L0,268 Q100,228 200,255 Q300,225 400,248 Q500,218 600,240 L600,340 Z"
            fill="url(#sp-hill2)" opacity="0.85"/>

      {/* Ground */}
      <path d="M0,295 Q150,278 300,288 Q450,296 600,278 L600,340 L0,340 Z"
            fill="url(#sp-ground)"/>

      {/* Cherry blossom tree (April) / Pine tree (other spring) */}
      {isApril ? (
        <g>
          {/* Trunk */}
          <path d="M95,340 L95,230 Q92,210 88,190 Q95,200 100,185 Q105,200 108,210 Q110,225 110,340 Z"
                fill="#5d4037" opacity="0.9"/>
          {/* Branches */}
          <path d="M95,210 Q60,185 30,175 Q50,180 65,190 Q80,195 95,205" fill="none" stroke="#5d4037" strokeWidth="4" opacity="0.8"/>
          <path d="M100,220 Q135,195 165,185 Q148,192 135,205 Q120,212 105,218" fill="none" stroke="#5d4037" strokeWidth="3" opacity="0.8"/>
          <path d="M92,235 Q62,225 42,235 Q58,230 75,235" fill="none" stroke="#5d4037" strokeWidth="2.5" opacity="0.7"/>
          {/* Blossom clouds */}
          {[
            [65,165,28],[35,185,22],[50,148,18],[90,145,24],[120,158,20],
            [155,175,22],[140,145,18],[100,130,16],[75,195,20],[158,195,16],
          ].map(([cx,cy,r],i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill={i%2===0?"#f8bbd0":"#f48fb1"} opacity="0.82"/>
          ))}
          {/* Highlight blossoms */}
          {[[80,152],[110,140],[45,172],[145,162]].map(([cx,cy],i)=>(
            <circle key={i} cx={cx} cy={cy} r={7} fill="white" opacity="0.35"/>
          ))}
        </g>
      ) : (
        /* Lush tree for May/March */
        <g>
          <rect x="92" y="225" width="16" height="115" rx="4" fill="#5d4037"/>
          {[
            [100,215,38],[100,180,32],[82,200,26],[118,195,24],[70,185,20],[130,185,20],
          ].map(([cx,cy,r],i)=>(
            <circle key={i} cx={cx} cy={cy} r={r} fill={i%2===0?"#2e7d32":"#388e3c"} opacity="0.9"/>
          ))}
        </g>
      )}

      {/* Birds (V shapes) */}
      {[[300,80],[340,68],[365,76],[390,60],[420,72]].map(([cx,cy],i)=>(
        <path key={i} d={`M${cx-8},${cy+4} Q${cx},${cy} Q${cx+8},${cy+4}`}
              fill="none" stroke={isApril?"#e91e63":"#1565c0"} strokeWidth="1.5" opacity="0.6"/>
      ))}

      {/* Floating petals (static, Particles handles animation) */}
      {isApril && [[200,120],[280,90],[350,110],[440,95],[520,130]].map(([cx,cy],i)=>(
        <ellipse key={i} cx={cx} cy={cy} rx="5" ry="3" fill="#f8bbd0" opacity="0.7" transform={`rotate(${i*35},${cx},${cy})`}/>
      ))}
    </svg>
  );
}

/* ─────────────────────── SUMMER ─────────────────────── */
function SummerScene({ month }: { month: number }) {
  const isJuly = month === 6;
  return (
    <svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="su-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={isJuly?"#0d1b4a":"#1a237e"}/>
          <stop offset="35%"  stopColor={isJuly?"#1a237e":"#1565c0"}/>
          <stop offset="70%"  stopColor={isJuly?"#b71c1c":"#e65100"}/>
          <stop offset="100%" stopColor={isJuly?"#e65100":"#f57f17"}/>
        </linearGradient>
        <linearGradient id="su-ocean" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1565c0"/>
          <stop offset="100%" stopColor="#0d47a1"/>
        </linearGradient>
        <linearGradient id="su-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#d4a547"/>
          <stop offset="100%" stopColor="#c8963a"/>
        </linearGradient>
        <filter id="su-glow"><feGaussianBlur stdDeviation="10"/></filter>
        <filter id="su-fw"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>

      {/* Sky */}
      <rect width="600" height="340" fill="url(#su-sky)"/>

      {isJuly ? (
        /* Fireworks for July */
        <>
          {/* Stars */}
          {[[50,25],[130,15],[220,30],[310,10],[400,28],[500,12],[560,35]].map(([cx,cy],i)=>(
            <circle key={i} cx={cx} cy={cy} r={0.8} fill="white" opacity="0.7"/>
          ))}
          {/* Firework bursts */}
          {[
            { cx:150, cy:100, color:"#ff4444", rays:12, r:55 },
            { cx:320, cy:75,  color:"#44aaff", rays:10, r:48 },
            { cx:480, cy:95,  color:"#ffdd44", rays:14, r:52 },
            { cx:85,  cy:140, color:"#ff88cc", rays:10, r:38 },
            { cx:540, cy:130, color:"#88ff88", rays:12, r:42 },
          ].map(({cx,cy,color,rays,r},fi)=>(
            <g key={fi}>
              <circle cx={cx} cy={cy} r={r} fill={color} opacity="0.12" filter="url(#su-glow)"/>
              {Array.from({length:rays},((_,i)=>{
                const angle = (i/rays)*Math.PI*2;
                const x2 = cx + Math.cos(angle)*r;
                const y2 = cy + Math.sin(angle)*r;
                const mx = cx + Math.cos(angle)*(r*0.55);
                const my = cy + Math.sin(angle)*(r*0.55);
                return (
                  <g key={i}>
                    <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" opacity="0.75"/>
                    <circle cx={x2} cy={y2} r="2.5" fill={color} opacity="0.9"/>
                    <circle cx={mx} cy={my} r="1.2" fill="white" opacity="0.4"/>
                  </g>
                );
              }))}
            </g>
          ))}
          {/* City silhouette */}
          <path d="M0,340 L0,255 L40,255 L40,235 L55,235 L55,220 L70,220 L70,210 L85,210 L85,235 L100,235 L100,245 L120,245 L120,225 L135,225 L135,215 L150,215 L150,230 L165,230 L165,240 L185,240 L185,250 L200,250 L200,255 L220,255 L220,235 L240,235 L240,220 L260,220 L260,215 L275,215 L275,228 L295,228 L295,242 L315,242 L315,255 L340,255 L340,238 L360,238 L360,220 L380,220 L380,230 L400,230 L400,248 L420,248 L420,255 L450,255 L450,240 L470,240 L470,228 L490,228 L490,218 L510,218 L510,232 L530,232 L530,248 L555,248 L555,255 L580,255 L580,260 L600,260 L600,340 Z"
                fill="#070d1a"/>
          {/* Windows */}
          {[[42,245],[57,228],[72,218],[127,232],[142,222],[262,222],[277,225],[462,245],[475,232],[495,225]].map(([x,y],i)=>(
            <rect key={i} x={x} y={y} width="5" height="5" rx="1" fill="#ffee88" opacity="0.7"/>
          ))}
        </>
      ) : (
        /* Beach sunset for June/August */
        <>
          {/* Sun on horizon */}
          <circle cx="480" cy="218" r="65" fill="#ff6f00" opacity="0.25" filter="url(#su-glow)"/>
          <circle cx="480" cy="218" r="38" fill="#ff8f00" opacity="0.5" filter="url(#su-fw)"/>
          <circle cx="480" cy="218" r="24" fill="#ffca28" opacity="0.9"/>
          {/* Sun reflection in water */}
          <path d="M440,225 Q480,218 520,225 Q510,255 480,260 Q450,255 440,225 Z" fill="#ffca28" opacity="0.18"/>

          {/* Ocean */}
          <path d="M0,222 Q150,215 300,222 Q450,228 600,215 L600,340 L0,340 Z" fill="url(#su-ocean)"/>
          {/* Wave highlights */}
          <path d="M0,228 Q100,222 200,228 Q300,234 400,228 Q500,222 600,228" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3"/>
          <path d="M0,238 Q120,232 240,238 Q360,244 480,238 Q540,234 600,240" fill="none" stroke="white" strokeWidth="1" opacity="0.2"/>

          {/* Beach/sand */}
          <path d="M0,290 Q150,280 300,288 Q450,294 600,280 L600,340 L0,340 Z" fill="url(#su-sand)"/>

          {/* Palm tree */}
          <path d="M78,340 Q76,295 72,268 Q75,255 80,250 Q85,255 88,268 Q84,295 82,340 Z" fill="#3e2723" opacity="0.9"/>
          {/* Palm fronds */}
          {[
            [-40,-18, 38,4],
            [-32,-28, -5,-42],
            [-8,-42, 28,-38],
            [20,-32, 50,-10],
            [28,-16, 52,10],
          ].map(([dx1,dy1,dx2,dy2],i)=>(
            <path key={i} d={`M80,250 Q${80+dx1},${250+dy1} ${80+dx2},${250+dy2}`}
                  fill="none" stroke="#2e7d32" strokeWidth="7" strokeLinecap="round" opacity="0.85"/>
          ))}
          {/* Coconuts */}
          <circle cx="72" cy="255" r="5" fill="#5d4037" opacity="0.85"/>
          <circle cx="82" cy="252" r="4.5" fill="#4e342e" opacity="0.8"/>

          {/* Seagulls */}
          {[[200,140],[240,128],[275,136]].map(([cx,cy],i)=>(
            <path key={i} d={`M${cx-9},${cy+5} Q${cx},${cy} Q${cx+9},${cy+5}`}
                  fill="none" stroke="white" strokeWidth="1.5" opacity="0.65"/>
          ))}
        </>
      )}
    </svg>
  );
}

/* ─────────────────────── FALL ─────────────────────── */
function FallScene({ month }: { month: number }) {
  const isOctober = month === 9;
  return (
    <svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="fa-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={isOctober?"#1a0536":"#4a1000"}/>
          <stop offset="50%"  stopColor={isOctober?"#4a1269":"#b34700"}/>
          <stop offset="100%" stopColor={isOctober?"#7b1fa2":"#e65100"}/>
        </linearGradient>
        <linearGradient id="fa-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffcc80" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#ffcc80" stopOpacity="0"/>
        </linearGradient>
        <filter id="fa-blur"><feGaussianBlur stdDeviation="6"/></filter>
        <filter id="fa-soft"><feGaussianBlur stdDeviation="2"/></filter>
      </defs>

      {/* Sky */}
      <rect width="600" height="340" fill="url(#fa-sky)"/>

      {isOctober ? (
        /* Halloween moon */
        <>
          <circle cx="490" cy="72" r="55" fill="#ff6f00" opacity="0.15" filter="url(#fa-blur)"/>
          <circle cx="490" cy="72" r="36" fill="#ffa000" opacity="0.8" filter="url(#fa-soft)"/>
          <circle cx="490" cy="72" r="30" fill="#ffe082" opacity="0.95"/>
          {/* Moon craters */}
          <circle cx="480" cy="65" r="5" fill="#ffca28" opacity="0.5"/>
          <circle cx="498" cy="78" r="3.5" fill="#ffca28" opacity="0.4"/>
          <circle cx="485" cy="82" r="2.5" fill="#ffca28" opacity="0.45"/>
          {/* Bats */}
          {[[120,55],[160,40],[200,60],[250,45],[290,58],[540,48],[570,62]].map(([cx,cy],i)=>(
            <g key={i} transform={`translate(${cx},${cy})`}>
              <ellipse cx="-7" cy="0" rx="9" ry="5" fill="#1a0536" opacity="0.85"/>
              <ellipse cx="7"  cy="0" rx="9" ry="5" fill="#1a0536" opacity="0.85"/>
              <ellipse cx="0"  cy="-2" rx="4" ry="3.5" fill="#2d0849" opacity="0.9"/>
            </g>
          ))}
        </>
      ) : (
        /* Autumn sun */
        <>
          <circle cx="490" cy="68" r="55" fill="#ff6f00" opacity="0.2" filter="url(#fa-blur)"/>
          <circle cx="490" cy="68" r="28" fill="#ff8f00" opacity="0.75"/>
        </>
      )}

      {/* Far tree silhouettes */}
      {[0,60,120,180,240,300,360,420,480,540].map((x,i) => {
        const h = 100 + (i%3)*30;
        const w = 38 + (i%2)*14;
        const colors = isOctober
          ? ["#2d0040","#3a0060","#1a0030"]
          : ["#bf360c","#e64a19","#d84315"];
        return (
          <g key={i}>
            {/* Trunk */}
            <rect x={x+w/2-4} y={250+100-h} width="8" height={h*0.4} rx="3" fill={isOctober?"#1a0030":"#4e342e"} opacity="0.8"/>
            {/* Canopy layers */}
            <ellipse cx={x+w/2} cy={250+100-h}      rx={w*0.6} ry={w*0.45} fill={colors[i%3]} opacity="0.88"/>
            <ellipse cx={x+w/2} cy={250+100-h+15}   rx={w*0.7} ry={w*0.42} fill={colors[(i+1)%3]} opacity="0.9"/>
            <ellipse cx={x+w/2} cy={250+100-h+30}   rx={w*0.65} ry={w*0.38} fill={colors[(i+2)%3]} opacity="0.85"/>
          </g>
        );
      })}

      {/* Mist layer */}
      <path d="M0,240 Q150,225 300,238 Q450,248 600,230 L600,285 L0,285 Z" fill="url(#fa-mist)"/>

      {/* Ground */}
      <path d="M0,300 Q150,285 300,295 Q450,303 600,285 L600,340 L0,340 Z"
            fill={isOctober?"#2d0040":"#8d3300"} opacity="0.75"/>
      {/* Ground leaves */}
      {[[50,315],[120,308],[200,318],[300,305],[380,315],[460,308],[540,320]].map(([cx,cy],i)=>(
        <ellipse key={i} cx={cx} cy={cy} rx="12" ry="6"
                 fill={isOctober?"#7b1fa2":["#e65100","#d84315","#ff6f00"][i%3]}
                 opacity="0.65" transform={`rotate(${i*25},${cx},${cy})`}/>
      ))}

      {/* Path winding through scene */}
      <path d="M240,340 Q255,320 265,305 Q275,290 285,280 Q295,268 310,262"
            fill="none" stroke={isOctober?"#4a1269":"#6d2600"} strokeWidth="18" opacity="0.45"/>
      <path d="M240,340 Q255,320 265,305 Q275,290 285,280 Q295,268 310,262"
            fill="none" stroke={isOctober?"#7b1fa2":"#8d3300"} strokeWidth="8" opacity="0.3"/>
    </svg>
  );
}

export default function SeasonScene({ season, month, primaryColor }: Props) {
  if (season === 'winter') return <WinterScene month={month} />;
  if (season === 'spring') return <SpringScene month={month} />;
  if (season === 'summer') return <SummerScene month={month} />;
  return <FallScene month={month} />;
}
