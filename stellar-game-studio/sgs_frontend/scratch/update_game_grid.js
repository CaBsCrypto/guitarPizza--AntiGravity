import fs from 'fs';
import path from 'path';

const filePath = 'd:/00 PROGRAMANDO/guitarPizza--AntiGravity/stellar-game-studio/sgs_frontend/src/games/guitar-pizza/GuitarPizzaGame.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// We target the section of the menu after song selector
const targetString = `                                    </button>
                                </div>


                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>`;

// Since Windows can have different spacing or \r\n, let's do a normalized find
const normalizedContent = content.replace(/\r\n/g, '\n');

const findSegment = `                                    </button>\n                                </div>\n\n\n                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>`;

const replacementSegment = `                                    </button>\n                                </div>\n\n                                <div className="grid grid-cols-2 gap-2 w-full">\n                                    <button\n                                        className="secondary-btn lobby-nav-btn"\n                                        style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, rgba(230, 95, 30, 0.2), rgba(212, 175, 55, 0.25))', borderColor: 'rgba(212, 175, 55, 0.6)', borderWidth: '2px', padding: '0.6rem 0', cursor: 'pointer' }}\n                                        onClick={() => setView('bakery')}\n                                    >\n                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', width: '100%' }}>\n                                            <span style={{ fontSize: '1.4rem' }}>🍕</span>\n                                            <span style={{ fontWeight: 'bold', letterSpacing: '0.05em', color: '#DAA520', textShadow: '0 0 5px rgba(218,165,32,0.3)' }}>\n                                                {language === 'es' ? 'PANADERÍA Y FAUCET' : 'BAKERY & FAUCET'}\n                                            </span>\n                                        </div>\n                                    </button>\n                                    <button\n                                        className="secondary-btn lobby-nav-btn"\n                                        style={{ position: 'relative', overflow: 'hidden' }}\n                                        onClick={() => setView('store')}\n                                    >\n                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>`;

if (normalizedContent.includes(findSegment)) {
    console.log("Found segment! Performing replacement...");
    const updatedNormalized = normalizedContent.replace(findSegment, replacementSegment);
    // Write back with Windows line endings
    const finalContent = updatedNormalized.replace(/\n/g, '\r\n');
    fs.writeFileSync(filePath, finalContent, 'utf-8');
    console.log("Replacement successful!");
} else {
    console.log("Could not find exact segment. Printing snippet around that area for inspection...");
    const lines = normalizedContent.split('\n');
    for (let i = 1520; i < 1545; i++) {
        console.log(`${i}: ${lines[i]}`);
    }
}
