let body = document.querySelector("body");
// let grid = document.querySelector(".grid");
let modalvisible = false;
let deletestate = false;
// function id() {
//   let id = "#" + Math.random().toString(36).substr(2, 5);
//   return id;
// }
let uid = new ShortUniqueId();
let coloridx = ["pink", "blue", "green", "black"];
let realcolors = {
  pink: "#d595aa",
  blue: "#5ecdde",
  green: "#91e6c7",
  black: "black",
};

let backcolors = [
  "linear-gradient(to right, #ff8008, #ffc837)",
  "linear-gradient(to right, #40e0d0, #ff8c00, #ff0080)",
  "linear-gradient(to right, #000000, #0f9b0f)",
  "linear-gradient(to right, #fceabb, #f8b500)",
  "linear-gradient(to right, #ad5389, #3c1053)",
  " linear-gradient(to right, #200122, #6f0000)",
  " linear-gradient(to right, #833ab4, #fd1d1d, #fcb045)",
  " linear-gradient(to right, #6441a5, #2a0845)",
];

let boolean_login = false;
let after_login = "";
let login_div = document.querySelector(".login-container");
let otp_btn = login_div.querySelector(".otp");
let otp = Date.now();
otp_btn.addEventListener("click", function () {
  let email_entered = login_div.querySelector(".email");
  let email = email_entered.value;
  // console.log(email);
  if (email == "") {
    alert("Enter a valid email");
    return;
    // console.log("err");
  } else {
    sendEmail(email, otp);
  }
});
function sendEmail(email, otp) {
  Email.send({
    SecureToken: "e83e1cee-00d5-49c5-a5e5-08aeb74a2e63",
    To: email,
    From: "jiraapp813@gmail.com",
    Subject: "OTP for Jira App Authentication",
    Body: otp,
  }).then((message) => alert("OTp has been sent to your email address"));
}

let verify_btn = login_div.querySelector(".verify");
verify_btn.addEventListener("click", function (e) {
  let entered_otp = login_div.querySelector(".otp_ent");
  console.log(entered_otp.value );
  if (entered_otp.value = otp) {
    alert("Login Successfull");
    after_login += `<div class="container">
		<div class="navigation">
			<div class="filter-container">
				<div class="filter">
					<div class="pink-color-btn"></div>
				</div>
				<div class="filter">
					<div class="blue-color-btn"></div>
				</div>
				<div class="filter">
					<div class="green-color-btn"></div>
				</div>
				<div class="filter">
					<div class="black-color-btn"></div>
				</div>
			</div>
			<div class="action-bar">
				<div class="add">
					<i class="fas fa-plus"></i>
				</div>
				<div class="remove">
					<i class="fas fa-trash"></i>
				</div>
			</div>
			<div class="title">JIRA</div>
      <div class="background-color">
      <div></div>
      </div>
			</div>
		<div class="grid">
			<div class="ticket">
				<div class="ticket-color"></div>
				<div class="ticket-id">#dgjsk</div>
				<div class="ticket-box" contenteditable></div>
			</div>
		</div>
		</div>`;
    login_div.remove();
    body.innerHTML = after_login;
    boolean_login = true;

    // console.log(location.reload())
    let grid = document.querySelector(".grid");
    let idx_bc = 0;
    let bkgnd_color = document.querySelector(".background-color div");
    bkgnd_color.addEventListener("click", function () {
      if (bkgnd_color.style.background) {
        console.log(bkgnd_color.style.background);
      }

      idx_bc = idx_bc % 8;
      grid.style.background = backcolors[idx_bc];
      idx_bc++;
    });

    window.onbeforeunload = function () {
      return "Are you sure want to LOGOUT the session ?";
    };

    loadtickets();

    if (!localStorage.getItem("tasks")) {
      //Initialization of localstorage
      localStorage.setItem("tasks", JSON.stringify([]));
    }
    let del = document.querySelector(".remove");

    del.addEventListener("click", function (e) {
      if (deletestate == false) {
        deletestate = true;
        del.classList.add("remove-active");
      } else {
        deletestate = false;
        del.classList.remove("remove-active");
      }
    });
    let addbtn = document.querySelector(".add");

    addbtn.addEventListener("click", function (e) {
      if (modalvisible) {
        alert("WARNING! Invalid Attempt");
        return;
      }

      if (del.classList.contains("remove-active")) {
        deletestate = false;
        del.classList.remove("remove-active");
      }
      let modal = document.createElement("div");
      modal.classList.add("modal-container");
      modal.setAttribute("click-first", true);
      modal.innerHTML = `<div  class="writing-area" contenteditable>Enter your task</div>
		<div class="filter-area">
			<div class="modal-filter pink"></div>
			<div class="modal-filter blue"></div>
			<div class="modal-filter green"></div>
			<div class="modal-filter black active"></div>
		</div>`;
      document.addEventListener("keydown", function (e) {
        //Escape button functioning
        if (e.key == "Escape") {
          modal.remove();
          modalvisible = false;
        }
      });
      let modalfilters = modal.querySelectorAll(".modal-filter");
      for (let i = 0; i < modalfilters.length; i++) {
        modalfilters[i].addEventListener("click", function (e) {
          for (let j = 0; j < modalfilters.length; j++) {
            modalfilters[j].classList.remove("active");
          }
          e.currentTarget.classList.add("active");
        });
      }

      let wa = modal.querySelector(".writing-area");
      wa.addEventListener("click", function () {
        if (modal.getAttribute("click-first") == "true") {
          wa.innerHTML = "";
          modal.setAttribute("click-first", false);
        }
      });

      wa.addEventListener("keypress", function (e) {
        if (e.key == "Enter") {
          //console.log(e.code);
          let task = e.currentTarget.innerText;
          let color = document.querySelector(".active").classList[1];
          let ticket = document.createElement("div");
          let id = uid();
          ticket.classList.add("ticket");
          ticket.innerHTML = `<div class="ticket-color ${color}"></div>
				<div class="ticket-id">#${id}
				<i class="fa fa-unlock-alt" aria-hidden="true"></i></div>
				   <div class="ticket-box" contenteditable>${task}</div>`;

          savedatainlocalstorage(id, color, task);

          let ticketWA = ticket.querySelector(".ticket-box");
          ticketWA.addEventListener("input", writingareahandler);

          let lock = ticket.querySelector("i");
          lock.addEventListener("click", function (e) {
            console.log(lock.classList[1]);
            if (lock.classList[1] == "fa-unlock-alt") {
              lock.classList.remove("fa-unlock-alt");
              lock.classList.add("fa-lock");
              ticketWA.removeAttribute("contenteditable");
            } else {
              lock.classList.remove("fa-lock");
              lock.classList.add("fa-unlock-alt");
              ticketWA.setAttribute("contenteditable", "true");
            }
          });

          ticket.addEventListener("click", function (e) {
            if (deletestate) {
              let id = e.currentTarget
                .querySelector(".ticket-id")
                .innerText.split("#")[1];
              let prevArry = JSON.parse(localStorage.getItem("tasks"));

              prevArry = prevArry.filter(function (ele) {
                return ele.id != id;
              });

              localStorage.setItem("tasks", JSON.stringify(prevArry));
              e.currentTarget.remove();
            }
          });

          let ticketcolor = ticket.querySelector(".ticket-color");
          ticketcolor.addEventListener("click", ticketcolorhandler);
          grid.append(ticket);
          modal.remove();
          modalvisible = false;
        }
      });

      body.append(modal);
      modalvisible = true;
    });

    function savedatainlocalstorage(id, color, task) {
      let objrequired = { id, color, task };
      let prevSavedArray = JSON.parse(localStorage.getItem("tasks"));
      prevSavedArray.push(objrequired);
      localStorage.setItem("tasks", JSON.stringify(prevSavedArray));
    }

    function ticketcolorhandler(e) {
      let id = e.currentTarget.parentElement
        .querySelector(".ticket-id")
        .innerText.split("#")[1];
      let prevArray = JSON.parse(localStorage.getItem("tasks"));
      let indx = -1;
      for (let i = 0; i < prevArray.length; i++) {
        if (prevArray[i].id == id) {
          indx = i;
          break;
        }
      }

      let tcktcurrcolor = e.currentTarget.classList[1];
      let idx = coloridx.indexOf(tcktcurrcolor);
      idx++;
      idx = idx % 4;
      e.currentTarget.classList.remove(tcktcurrcolor);
      e.currentTarget.classList.add(coloridx[idx]);
      let newcolor = coloridx[idx];
      prevArray[indx].color = newcolor;
      localStorage.setItem("tasks", JSON.stringify(prevArray));
    }

    function writingareahandler(e) {
      let id = e.currentTarget.parentElement
        .querySelector(".ticket-id")
        .innerText.split("#")[1];
      let prevArry = JSON.parse(localStorage.getItem("tasks"));
      let idx = -1;
      for (let i = 0; i < prevArry.length; i++) {
        if (prevArry[i].id == id) {
          idx = i;
          break;
        }
      }

      // let editedticketText = e.currentTarget.innerText;
      prevArry[idx].task = e.currentTarget.innerText;
      localStorage.setItem("tasks", JSON.stringify(prevArry));
    }
let filter = document.querySelectorAll(".filter div");

    for (let i = 0; i < filter.length; i++) {
      filter[i].addEventListener("click", function (e) {
        if (
          e.currentTarget.parentElement.classList.contains("selected-filter")
        ) {
          e.currentTarget.parentElement.classList.remove("selected-filter");
          loadtickets();
        } else {
          for (let j = 0; j < filter.length; j++) {
            filter[j].parentElement.classList.remove("selected-filter");
          }
          e.currentTarget.parentElement.classList.add("selected-filter");
          let color = filter[i].classList[0].split("-")[0];
          loadtickets(color);
        }
      });
    }

    function loadtickets(passedColor) {
      let alltckts = document.querySelectorAll(".ticket");
      for (let i = 0; i < alltckts.length; i++) alltckts[i].remove();

      let tickets = JSON.parse(localStorage.getItem("tasks"));

      for (let i = 0; i < tickets.length; i++) {
        let id = tickets[i].id;
        let color = tickets[i].color;
        let task = tickets[i].task;

        if (passedColor) {
          if (passedColor != color) continue;
        }
        let ticket = document.createElement("div");
        ticket.classList.add("ticket");
        ticket.innerHTML = `<div class="ticket-color ${color}"></div>
			 <div class="ticket-id">#${id}
			 <i class="fa fa-unlock-alt" aria-hidden="true"></i></div>
			 <div class="ticket-box" contenteditable>${task}</div>`;

        let ticketWA = ticket.querySelector(".ticket-box");
        ticketWA.addEventListener("input", writingareahandler);

        let lock = ticket.querySelector("i");
        lock.addEventListener("click", function (e) {
          console.log(lock.classList[1]);
          if (lock.classList[1] == "fa-unlock-alt") {
            lock.classList.remove("fa-unlock-alt");
            lock.classList.add("fa-lock");
            ticketWA.removeAttribute("contenteditable");
          } else {
            lock.classList.remove("fa-lock");
            lock.classList.add("fa-unlock-alt");
            ticketWA.setAttribute("contenteditable", "true");
          }
        });

        let ticketcolor = ticket.querySelector(".ticket-color");
        ticketcolor.addEventListener("click", ticketcolorhandler);

        ticket.addEventListener("click", function (e) {
          if (deletestate) {
            let id = e.currentTarget
              .querySelector(".ticket-id")
              .innerText.split("#")[1];
            let prevArry = JSON.parse(localStorage.getItem("tasks"));

            prevArry = prevArry.filter(function (ele) {
              return ele.id != id;
            });

            localStorage.setItem("tasks", JSON.stringify(prevArry));
            e.currentTarget.remove();
          }
        });
        console.log(ticket);
        grid.append(ticket);
      }
    }
  } else {
    alert("Invalid OTP please enter Email again");
    location.reload();
  }
});
