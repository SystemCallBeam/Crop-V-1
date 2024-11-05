const boardSize = 8;
let board = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
let playerSide = '01'; // กำหนดค่าเริ่มต้นของฝั่งผู้เล่น
let selectedPiece = null;  // ตัวแปรสำหรับเก็บหมากที่เลือก
let selectedPosition = null; // ตัวแปรสำหรับเก็บตำแหน่งของหมากที่เลือก


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

function handleSquareClick(x, y) {
    const piece = board[x] ? board[x][y] : null;
    console.log("Clicked position:", x, y);
    console.log("Current piece:", piece);

    if (piece) {
        // เลือกหมาก
        selectedPiece = { ...piece, prevX: x, prevY: y }; // บันทึกตำแหน่งเดิมของหมากที่เลือก
        console.log("Selected piece:", selectedPiece);
    } else if (selectedPiece) {
        // ตรวจสอบว่าตำแหน่งที่ต้องการย้ายหมากมีอยู่
        if (!board[x]) board[x] = []; // สร้างแถวใหม่ถ้าไม่มีแถวนี้ในกระดาน
        console.log("Moving selected piece to:", x, y);

        // อัปเดตตำแหน่งใหม่ในกระดาน
        board[x][y] = selectedPiece; // ย้ายหมากไปยังตำแหน่งใหม่

        // ตรวจสอบว่าตำแหน่งเดิมมีอยู่ก่อนที่จะลบหมาก
        if (board[selectedPiece.prevX]) {
            board[selectedPiece.prevX][selectedPiece.prevY] = null; // ลบหมากจากตำแหน่งเดิม
        }

        console.log("Updating board with:", selectedPiece);

        // ส่งข้อมูลไปยังเซิร์ฟเวอร์
        fetch('/api/update_board', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ x, y, piece: selectedPiece })
        }).then(response => response.json()).then(data => {
            if (data.success) {
                renderBoard(); // อัปเดตกระดานถ้าเรียก API สำเร็จ
                selectedPiece = null; // รีเซ็ตการเลือก
            } else {
                console.error("Failed to update the board:", data);
            }
        }).catch(error => {
            console.error("Error during fetch:", error);
        });
    }

    // ถ้าเลือกหมากที่มีอยู่แล้ว
    /* if (piece && !selectedPiece) {
        selectedPiece = piece;  // เก็บหมากที่เลือก
        selectedPosition = { x, y };  // เก็บตำแหน่งที่เลือก
        console.log("Selected piece:", piece);
    } else if (selectedPiece) {
        // ถ้าเลือกช่องที่ว่างหรือไม่ใช่หมากของตัวเอง
        if (board[x][y] === null || (board[x][y].team !== selectedPiece.team)) {
            movePiece(selectedPosition.x, selectedPosition.y, x, y);
            selectedPiece = null;  // รีเซ็ตการเลือกหมาก
            selectedPosition = null;  // รีเซ็ตตำแหน่งหมากที่เลือก
        }
    } */
}

function selectPiece(x, y) {
    const piece = board[x][y];
    if (piece) {
        selectedPiece = { ...piece, prevX: x, prevY: y }; // เก็บข้อมูลหมากรวมถึงตำแหน่งเดิม
    }
}

function movePiece(fromX, fromY, toX, toY) {
    const piece = board[fromX][fromY];  // หามากจากตำแหน่งเดิม
    const targetPiece = board[toX][toY];  // หามากจากตำแหน่งที่ทับ

    // ถ้ามีหมากอยู่ในตำแหน่งที่ทับ ให้แทนที่ด้วยหมากใหม่
    if (targetPiece) {
        // ทับหมากที่อยู่เดิม
        console.log(`Overwriting piece at position (${toX}, ${toY})`);
    }

    // วางหมากใหม่ที่ตำแหน่งปลายทาง
    board[toX][toY] = piece;
    // ลบหมากจากตำแหน่งเดิม
    board[fromX][fromY] = null;

    fetch('/api/update_board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromX, fromY, toX, toY, piece })
    }).then(response => response.json())
      .then(data => {
        if (data.success) {
            renderBoard();  // รีเฟรชการแสดงผลกระดาน
        }
    });
}

// แสดงกระดาน
function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    // กำหนดลำดับแถวตามฝั่งที่เลือก
    const rowOrder = playerSide === '01' ? [...board].reverse() : board;

    rowOrder.forEach((row, rowIndex) => {
        // กำหนดลำดับคอลัมน์ตามฝั่งที่เลือก
        const colOrder = playerSide === '01' ? [...row].reverse() : row;

        colOrder.forEach((piece, colIndex) => {
            const square = document.createElement('div');
            square.classList.add('square', (rowIndex + colIndex) % 2 === 0 ? 'white' : 'black');

            // ใส่ตัวหมากในช่อง
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.classList.add('piece', `team${piece.team}`);
                pieceElement.textContent = piece.name; // แสดงชื่อหมาก
                square.appendChild(pieceElement);
            }

            // คำนวณตำแหน่งจริงที่ส่งไปใน `handleSquareClick`
            const actualRowIndex = playerSide === '01' ? board.length - rowIndex - 1 : rowIndex;
            const actualColIndex = playerSide === '01' ? row.length - colIndex - 1 : colIndex;

            // ตั้งค่า Event Click สำหรับ Square
            square.onclick = () => {
                handleSquareClick(actualRowIndex, actualColIndex);
            };

            boardElement.appendChild(square);
        });
    });
}



// เริ่มต้นกระดาน
setupPieces();
renderBoard();
