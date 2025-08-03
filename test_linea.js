const fetch = require('node-fetch');

async function testLinea() {
  try {
    const response = await fetch('http://localhost:3002/api/lineas/111');
    const data = await response.json();
    console.log('Línea 111:', JSON.stringify(data, null, 2));
    
    // Test también algunas líneas del getAll
    const allResponse = await fetch('http://localhost:3002/api/lineas');
    const allData = await allResponse.json();
    console.log('\nPrimeras 2 líneas de getAll:');
    console.log(JSON.stringify(allData.slice(0, 2), null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testLinea();
