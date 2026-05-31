const http = require('http');

// Test viewport sizes
const viewports = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'iPad', width: 768, height: 1024 },
];

// Fetch game.html and check for mobile issues
http.get('http://localhost:3001/game.html', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('=== Mobile Responsiveness Audit ===\n');
    
    // Check for viewport meta tag
    if (data.includes('viewport')) {
      const match = data.match(/<meta[^>]*viewport[^>]*>/);
      console.log('✅ Viewport meta tag:', match ? 'FOUND' : 'MISSING');
      if (match) console.log('   ', match[0]);
    } else {
      console.log('❌ Viewport meta tag: MISSING');
    }
    
    // Check for media queries
    const cssMatches = data.match(/max-width.*?px|@media/g);
    console.log('\n📱 Responsive CSS rules found:', cssMatches ? cssMatches.length : 0);
    
    // Check button sizing
    if (data.includes('min-height: 80px')) {
      console.log('✅ Answer buttons have adequate size (80px min)');
    } else {
      console.log('⚠️  Answer buttons may need larger touch targets');
    }
    
    // Check padding/spacing
    if (data.match(/padding:\s*[0-9.]+rem|padding:\s*[0-9]+px/)) {
      console.log('✅ Padding defined for spacing');
    }
    
    // Check overflow/width
    if (data.includes('max-width: 1200px') || data.includes('max-width: 600px')) {
      console.log('✅ Container width constrained');
    }
    
    console.log('\n🎮 Critical mobile elements:');
    const elements = [
      { name: 'Volume controls', check: 'gb-vol|volume' },
      { name: 'Arcade panel', check: 'arcade-panel' },
      { name: 'Answer buttons', check: 'answer-btn' },
      { name: 'Modals', check: 'modal-overlay' },
      { name: 'Game container', check: 'screen-game' },
    ];
    
    elements.forEach(el => {
      const found = new RegExp(el.check, 'i').test(data);
      console.log(found ? '✅' : '❌', el.name);
    });
    
    // Check for font-size issues
    console.log('\n📝 Font sizing:');
    const fontSizes = data.match(/font-size:\s*[^;]+/g) || [];
    const smallFonts = fontSizes.filter(f => f.includes('0.5') || f.includes('0.6') || f.includes('0.65'));
    if (smallFonts.length > 0) {
      console.log('⚠️  Found very small fonts (0.5-0.65rem) that may be hard to read on mobile:');
      smallFonts.slice(0, 3).forEach(f => console.log('   ', f));
    }
    
    // Check touch target sizes
    console.log('\n👆 Touch targets:');
    if (data.match(/min-height:\s*[4-9][0-9]px|min-height:\s*[0-9]rem/)) {
      console.log('✅ Adequate touch target heights');
    } else {
      console.log('⚠️  Some touch targets may be too small');
    }
  });
}).on('error', e => console.error('Error:', e.message));
