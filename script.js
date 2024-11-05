let board = Array(8).fill().map(() => Array(8).fill(null)); // สร้างกระดานเปล่า 8x8
let playerSide = 'bottom'; // กำหนดค่าเริ่มต้นของฝั่งผู้เล่น

// สร้างตัวหมากแต่ละตัวในทีม
function createPiece(team, name) {
    const piece = document.createElement('div');
    piece.classList.add('piece', `team-${team}`);
    piece.textContent = name;
    return piece;
}

// วางหมากในตำแหน่งเริ่มต้น
function setupPieces() {
    for (let i = 0; i < 8; i++) {
        // แถวบนสำหรับทีม B
        board[0][i] = createPiece('b', `P(B)`);
        board[1][i] = createPiece('b', `P(B)`);
        // แถวล่างสำหรับทีม W
        board[6][i] = createPiece('w', `P(W)`);
        board[7][i] = createPiece('w', `P(W)`);
    }
}

// สลับกระดานตามฝั่งที่เลือก
function setPlayerSide(side) {
    playerSide = side;
    renderBoard();
}

// แสดงกระดาน
function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    // กำหนดลำดับการแสดงแถว
    const rowOrder = playerSide === 'bottom' ? [...board].reverse() : [...board];

    rowOrder.forEach((row, i) => {
        row.forEach((piece, j) => {
            const square = document.createElement('div');
            square.classList.add('square', (i + j) % 2 === 0 ? 'white' : 'black');

            // ใส่ตัวหมากในช่อง
            if (piece) {
                square.appendChild(piece.cloneNode(true));
            }

            boardElement.appendChild(square);
        });
    });
}

// เริ่มต้นกระดาน
setupPieces();
renderBoard();
