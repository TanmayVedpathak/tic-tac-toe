const board_box = document.querySelectorAll(".board_box");
const container_text = document.getElementById("container_text");
const reset_btn = document.getElementById("reset_btn");

const user_points = document.getElementById("user_points");
const bot_points = document.getElementById("bot_points");

const X_input = document.querySelector("#X_input");
const O_input = document.querySelector("#O_input");

const X_img = `<img src='./assets/cross.svg' alt='cross' />`;
const O_img = `<img src='./assets/circle.svg' alt='circle' />`;

const filled_box = ["", "", "", "", "", "", "", "", ""];

let audio1 = new Audio("./assets/success-1.mp3");
let audio2 = new Audio("./assets/success-2.mp3");
let draw = new Audio("./assets/draw.mp3");

var user_mark = "";
var bot_mark = "";

// var points = {
//   user: 0,
//   bot: 0,
// };

const wining_pattern = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// localStorage.setItem("points", JSON.stringify(points));

X_input.addEventListener("change", markSelector);

O_input.addEventListener("change", markSelector);

board_box.forEach((ele, index) => {
  ele.addEventListener("click", (e) => {
    if (X_input.checked || O_input.checked) {
      X_input.disabled = true;
      O_input.disabled = true;
      if (!filled_box[index]) {
        filled_box[index] = "X";
        ele.innerHTML += user_mark;
        ele.children[1].style.animation = "scaling 0.8s linear";

        if (win("X")) {
          container_text.innerText = "User won";

          user_points.innerText = Number(user_points.innerText) + 1;
          markSelector("over");
          container_text.style.color = "#756ab6";
          blank_space();
          audio1.play();
        } else {
          const game_over = filled_box.every((ele) => ele.length > 0);
          if (!game_over) {
            bot_chance();
          } else {
            container_text.innerText = "Draw";
            markSelector("over");
            draw.play();
          }
        }
      }
    }
  });
});

reset_btn.addEventListener("click", () => {
  // location.reload();

  container_text.innerText = "Start the game!";
  markSelector();
  X_input.disabled = false;
  O_input.disabled = false;
  filled_box.forEach((ele, index) => {
    filled_box[index] = "";
    board_box[index].innerHTML = `<div class="line"></div>`;
  });
});

function markSelector(over) {
  if (over === "over") {
    board_box.forEach((ele) => {
      ele.classList.remove("circle_pointer");
      ele.classList.remove("cross_pointer");
    });
  } else if (O_input.checked) {
    user_mark = O_img;
    bot_mark = X_img;
    board_box.forEach((ele) => {
      ele.classList.add("circle_pointer");
      ele.classList.remove("cross_pointer");
    });
  } else if (X_input.checked) {
    user_mark = X_img;
    bot_mark = O_img;
    board_box.forEach((ele) => {
      ele.classList.add("cross_pointer");
      ele.classList.remove("circle_pointer");
    });
  }
}

function bot_chance() {
  const box_number = Math.floor(Math.random() * 9);
  if (!filled_box[box_number]) {
    filled_box[box_number] = "O";
    setTimeout(function () {
      board_box[box_number].innerHTML += bot_mark;
      board_box[box_number].children[1].style.animation = "scaling 0.8s linear";
    }, 800);

    if (win("O")) {
      container_text.innerText = "Bot won";
      bot_points.innerText = Number(bot_points.innerText) + 1;
      markSelector("over");
      container_text.style.color = "#756ab6";
      blank_space();
      audio2.play();
    } else {
      const game_over = filled_box.every((ele) => ele.length > 0);
      if (game_over) {
        container_text.innerText = "Draw";
        markSelector("over");
        draw.play();
      }
    }
  } else {
    bot_chance();
  }
}

function win(mark) {
  var result;
  for (let i = 0; i < wining_pattern.length; i++) {
    const ele = wining_pattern[i];
    if (
      mark === filled_box[ele[0]] &&
      mark === filled_box[ele[1]] &&
      mark === filled_box[ele[2]]
    ) {
      result = true;
      won_pattern(ele);
      break;
    } else {
      result = false;
    }
  }
  return result;
}

function blank_space() {
  filled_box.forEach((ele, index) => {
    if (ele.length === 0) {
      filled_box[index] = "-";
      board_box[
        index
      ].innerHTML += `<img src="./assets/dash.svg" alt="dash" />`;
    }
  });
}

function won_pattern(pattern) {
  const pattern_maker = (className) => {
    pattern.forEach((ele) => {
      setTimeout(function () {
        board_box[ele].children[0].classList.add(className);
      }, 600);
    });
  };

  if (
    pattern === wining_pattern[0] ||
    pattern === wining_pattern[1] ||
    pattern === wining_pattern[2]
  ) {
    pattern_maker("horizontal_line");
  } else if (
    pattern === wining_pattern[3] ||
    pattern === wining_pattern[4] ||
    pattern === wining_pattern[5]
  ) {
    pattern_maker("vertical_line");
  } else if (pattern === wining_pattern[6]) {
    pattern_maker("diagonal_line1");
  } else if (pattern === wining_pattern[7]) {
    pattern_maker("diagonal_line2");
  }
}
