import './style.css'
import './css/general-sans.css'

function findValidAirPatternsAllowAdjacents(wallLength) {
  const cornerLeft = 0;
  const cornerRight = wallLength - 1;
  const innerStart = 1;
  const innerEnd = wallLength - 2;
  const innerLength = innerEnd - innerStart + 1;

  function isSymmetrical(arr) {
    const len = arr.length;
    for (let i = 0; i < len / 2; i++) {
      if (arr[i] !== arr[len - 1 - i]) return false;
    }
    return true;
  }

  const maxPatterns = 1 << innerLength;
  const validPatterns = [];

  for (let bits = 0; bits < maxPatterns; bits++) {
    const pattern = new Array(wallLength).fill(1);

    for (let i = 0; i < innerLength; i++) {
      pattern[innerStart + i] = (bits & (1 << i)) ? 0 : 1;
    }

    if (pattern[innerStart] === 0 || pattern[innerEnd] === 0) continue;

    if (!pattern.includes(0)) continue;

    if (!isSymmetrical(pattern)) continue;

    validPatterns.push(pattern);
  }

  return validPatterns;
}

function renderPattern(pattern, index) {
  const patternContainer = document.createElement('div');
  patternContainer.className = 'pattern';

  const title = document.createElement('span');
  title.textContent = `pattern ${index + 1}`;
  patternContainer.appendChild(title);

  const blocksContainer = document.createElement('div');
  blocksContainer.className = 'blocks';

  pattern.forEach(value => {
    const block = document.createElement('div');
    block.className = value === 1 ? 'block filled' : 'block empty';
    blocksContainer.appendChild(block);
  });

  patternContainer.appendChild(blocksContainer);
  return patternContainer;
}

document.getElementById('generateBtn').addEventListener('click', () => {
  const wallLength = parseInt(document.getElementById('wallLength').value, 10);

  const results = findValidAirPatternsAllowAdjacents(wallLength);
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (results.length === 0) {
    resultsDiv.textContent = 'no valid patterns found';
    return;
  }

  const heading = document.createElement('h2');
  heading.textContent = 'patterns';
  resultsDiv.appendChild(heading);

  results.forEach((pattern, i) => {
    const rendered = renderPattern(pattern, i);
    resultsDiv.appendChild(rendered);

    const hr = document.createElement('hr');
    resultsDiv.appendChild(hr);
  });
});