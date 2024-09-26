const weights = {
  Thin: 100,
  Light: 300,
  Regular: 400,
  Medium: 500,
  Bold: 700,
  Black: 900,
}

for (const [ name, weight ] of Object.entries(weights)) {
  console.log(`
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: ${weight};
  src: url('Roboto-${name}.woff2') format('woff2'),
       url('Roboto-${name}.ttf') format('truetype');
}

@font-face {
  font-family: 'Roboto';
  font-style: italic;
  font-weight: ${weight};
  src: url('Roboto-${name}Italic.woff2') format('woff2'),
       url('Roboto-${name}Italic.ttf') format('truetype');
}`)
}
