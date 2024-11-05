const boardSize = 8;
let board = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
let playerSide = '01'; // กำหนดค่าเริ่มต้นของฝั่งผู้เล่น

// สร้างตัวหมากแต่ละตัวในทีม
function createPiece(team, name) {
    return { team: team, name: name }; // เปลี่ยนเป็น Object
}

// วางหมากในตำแหน่งเริ่มต้น
function setupPieces() {
    for (let i = 0; i < boardSize; i++) {
        // แถวบนสำหรับทีม B
        board[0][i] = createPiece('01', `P(B${i + 1})`);
        board[1][i] = createPiece('01', `P(B${i + 1})`);
        // แถวล่างสำหรับทีม W
        board[boardSize - 2][i] = createPiece('02', `P(W${i + 1})`);
        board[boardSize - 1][i] = createPiece('02', `P(W${i + 1})`);
    }
}

function setPlayerSide(side) {
    playerSide = side; // เปลี่ยนฝั่งที่เลือก
    renderBoard(); // เรียกใช้ฟังก์ชัน renderBoard เพื่อแสดงกระดานใหม่
}

// แสดงกระดาน
function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    const rowOrder = playerSide === '01' ? [...board].reverse() : [...board];

    rowOrder.forEach((row, i) => {
        row.forEach((piece, j) => {
            const square = document.createElement('div');
            square.classList.add('square', (i + j) % 2 === 0 ? 'white' : 'black');

            // ใส่ตัวหมากในช่อง
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.classList.add('piece', `team${piece.team}`);
                pieceElement.textContent = piece.name; // แสดงชื่อหมาก
                square.appendChild(pieceElement);
            }

            // ตั้งค่า Event Click สำหรับ Square
            square.onclick = () => {
                handleSquareClick(i, j);
            };

            boardElement.appendChild(square);
        });
    });
}

// เริ่มต้นกระดาน
setupPieces();
renderBoard();
