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

function renderRoomDivision(rooms, roomWidth, dividerThickness) {
  const container = document.createElement('div');
  container.className = 'blocks';

  for (let i = 0; i < rooms; i++) {
    for (let j = 0; j < roomWidth; j++) {
      const roomBlock = document.createElement('div');
      roomBlock.className = 'block room';
      container.appendChild(roomBlock);
    }
    if (i < rooms - 1) {
      for (let k = 0; k < dividerThickness; k++) {
        const dividerBlock = document.createElement('div');
        dividerBlock.className = 'block divider';
        container.appendChild(dividerBlock);
      }
    }
  }

  return container;
}

// NEW: function to get possible room divisions
function getPossibleRooms(wallLength, dividerThickness) {
  const results = [];
  for (let rooms = 2; rooms <= wallLength; rooms++) {
    const dividers = rooms - 1;
    const remainingLength = wallLength - (dividers * dividerThickness);
    const roomWidth = remainingLength / rooms;

    if (Number.isInteger(roomWidth) && roomWidth > 0) {
      results.push({ rooms, roomWidth });
    }
  }
  return results;
}

document.getElementById('generateBtn').addEventListener('click', () => {
  const wallLength = parseInt(document.getElementById('wallLength').value, 10);
  const dividerThickness = 1; // fixed as in your example

  // PATTERN RESULTS
  const patterns = findValidAirPatternsAllowAdjacents(wallLength);
  const patternResultsDiv = document.getElementById('patternResults');
  patternResultsDiv.innerHTML = '';
  patternResultsDiv.style.opacity = '1';

  if (patterns.length === 0) {
    patternResultsDiv.textContent = 'no valid patterns found';
  } else {
    const heading = document.createElement('h2');
    heading.textContent = 'glass patterns';
    patternResultsDiv.appendChild(heading);

    patterns.forEach((pattern, i) => {
      const rendered = renderPattern(pattern, i);
      patternResultsDiv.appendChild(rendered);
    });
  }

  // ROOM DIVISION RESULTS
  const divisions = getPossibleRooms(wallLength, dividerThickness);
  const divisionResultsDiv = document.getElementById('divisionResults');
  divisionResultsDiv.innerHTML = '';
  divisionResultsDiv.style.opacity = '1';

  const divisionHeading = document.createElement('h2');
  divisionHeading.textContent = 'even room divisions';
  divisionResultsDiv.appendChild(divisionHeading);

  if (divisions.length === 0) {
    const noDivisions = document.createElement('p');
    noDivisions.textContent = 'no even divisions found';
    divisionResultsDiv.appendChild(noDivisions);
  } else {
    divisions.forEach((d, i) => {
      const label = document.createElement('p');
      label.textContent = `${d.rooms} rooms → each ${d.roomWidth} wide`;
      divisionResultsDiv.appendChild(label);

      const blocks = renderRoomDivision(d.rooms, d.roomWidth, dividerThickness);
      divisionResultsDiv.appendChild(blocks);
    });
  }
});