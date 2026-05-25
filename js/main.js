document.addEventListener("DOMContentLoaded", () => {
  alert(`Please note there are limitations, such as disallowing blank tiles on the floor and ceiling, which are designed to guard the programme from bugs.`);
});

const paths = ["assets/floor3.png", "assets/wall5.png", "assets/ceiling.png"];

const defaultTiles = [0, -1, 2];

let width = 10;
let height = 15;

let selectedTile = 0;
let currentGrid = 0;

const arrays = [
  new Int8Array,
  new Int8Array,
  new Int8Array,
];



function createGrid() {
  const container = document.getElementById("tiles");

  container.addEventListener("click", function (e) {
    if (e.target.classList.contains("cell")) {
      const coords = e.target.id.split("-");
      changeTile(parseInt(coords[0]), parseInt(coords[1]));
    }
  });

  for (let r = 0; r < height; ++r) {
    const row = document.createElement("div");
    row.className = "row";

    for (let c = 0; c < width; ++c) {
      const cell = document.createElement("div");
      cell.className = "cell";
      row.appendChild(cell);

      cell.style.width = "32px";
      cell.style.height = "32px";
      cell.id = `${c}-${r}`;
    }

    container.appendChild(row);
  }
}

function resetGrid(i) {
  for (let r = 0; r < height; ++r) {
    for (let c = 0; c < width; ++c) {
      arrays[i][r * width + c] = defaultTiles[i];

      if (i == 1 && (r == 0 || c == 0 || r == height - 1 || c == width - 1)) {
        arrays[i][r * width + c] = 1;
      }
    }
  }
}

function fillGrid() {
  for (let r = 0; r < height; ++r) {
    for (let c = 0; c < width; ++c) {
      const cell = document.getElementById(`${c}-${r}`);

      const tile = arrays[currentGrid][r * width + c];

      if (tile == -1) {
        cell.style.backgroundColor = "#ccc";
        cell.style.backgroundImage = "none";
      } else {
        cell.style.backgroundColor = "transparent";
        cell.style.backgroundImage = `url('${paths[tile]}')`;
      }
    }
  }
}

function changeTile(x, y) {
  if (currentGrid == 1 && selectedTile == -1) {
    if (y == 0 || x == 0 || y == height - 1 || x == width - 1) {
      return;
    }
  } else if (currentGrid != 1 && selectedTile == -1) {
    return;
  }
  const item = document.getElementById(`${x}-${y}`);
  item.style.backgroundImage = `url('${paths[selectedTile]}')`;
  arrays[currentGrid][y * width + x] = selectedTile;
}



document.getElementById("surface").addEventListener("change", (e) => {
  currentGrid = parseInt(e.target.value);
  fillGrid();
});

document.getElementById("tile-picker").addEventListener("change", (e) => {
  selectedTile = parseInt(e.target.value);
});

document.getElementById("reset").addEventListener("click", () => {
  resetGrid(currentGrid);
  fillGrid();
});

document.getElementById("reset-all").addEventListener("click", () => {
  for (let i = 0; i < 3; ++i) {
    resetGrid(i);
  }
  fillGrid();
});

document.getElementById("save").addEventListener("click", () => {
  const size = 4 + 4 + width * height * 3;
  const buffer = new ArrayBuffer(size);
  const view = new DataView(buffer);

  let offset = 0;

  view.setInt32(offset, width, true);
  offset += 4;
  view.setInt32(offset, height, true);
  offset += 4;

  for (let layer = 0; layer < 3; ++layer) {
    for (let i = 0; i < width * height; ++i) {
      view.setUint8(offset, arrays[layer][i] + 1);
      offset++;
    }
  }

  const file = new Blob([buffer], { type: "application/octet-stream" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  document.body.appendChild(a);
  a.download = "world.wld";
  document.body.removeChild(a);
  a.click();
});

document.getElementById("start").addEventListener("click", () => {
  document.getElementById("menu").classList.remove("active");
  document.getElementById("editor").classList.add("active");
  width = parseInt(document.getElementById("width").value);
  height = parseInt(document.getElementById("height").value);
  arrays[0] = new Int8Array(width * height);
  arrays[1] = new Int8Array(width * height);
  arrays[2] = new Int8Array(width * height);
  arrays[0].fill(0);
  arrays[1].fill(-1);
  for (let r = 0; r < height; ++r) {
    for (let c = 0; c < width; ++c) {
      if (r == 0 || c == 0 || r == height - 1 || c == width - 1) {
        arrays[1][r * width + c] = 1;
      }
    }
  }
  arrays[2].fill(2);
  createGrid();
  fillGrid();
});
