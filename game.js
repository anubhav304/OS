
// /* =========================================================
//    OPERATING SYSTEMS — FIELD GUIDE
//    PLAYABLE LAB
//    FILE: game.js
//    ========================================================= */

// "use strict";

// /* =========================================================
//    GAME DATA
//    ========================================================= */

// const GAME = {
//   score: 0,
//   streak: 0,
//   lives: 3,
//   level: 1,
//   question: 0,
//   answered: false,
//   completed: false,

//   levels: [
//     {
//       id: 1,
//       title: "Process / State",
//       type: "quiz",
//       description:
//         "A process is not permanently running. The kernel moves it between states as it waits, runs, and finishes.",
//       questions: [
//         {
//           question: "A process is waiting for keyboard input. Which state describes it?",
//           options: [
//             "Running",
//             "Ready",
//             "Waiting / Blocked",
//             "Terminated"
//           ],
//           answer: 2,
//           explanation:
//             "The process cannot continue until the input arrives, so it is blocked waiting for an event."
//         },
//         {
//           question: "Which state means the process is eligible to run but is waiting for CPU time?",
//           options: [
//             "Ready",
//             "Waiting",
//             "Terminated",
//             "Sleeping forever"
//           ],
//           answer: 0,
//           explanation:
//             "A ready process has everything it needs except access to the CPU."
//         },
//         {
//           question: "A process finishes normally. What happens next?",
//           options: [
//             "It becomes ready again",
//             "It becomes blocked",
//             "It enters the terminated state",
//             "It becomes the kernel"
//           ],
//           answer: 2,
//           explanation:
//             "Once execution finishes, the process is terminated and its resources can be reclaimed."
//         }
//       ]
//     },

//     {
//       id: 2,
//       title: "CPU / Scheduling",
//       type: "scheduler",
//       description:
//         "The CPU is finite. Scheduling decides which runnable process gets the next slice of execution.",
//     },

//     {
//       id: 3,
//       title: "Memory / Translation",
//       type: "quiz",
//       description:
//         "Virtual memory separates the addresses a process sees from the physical locations used by RAM.",
//       questions: [
//         {
//           question: "What does a page table primarily translate?",
//           options: [
//             "Files into folders",
//             "Virtual pages into physical frames",
//             "Processes into users",
//             "CPU instructions into electricity"
//           ],
//           answer: 1,
//           explanation:
//             "The page table maps virtual page numbers to physical frame numbers."
//         },
//         {
//           question: "Why does an OS use virtual memory?",
//           options: [
//             "To give every process an isolated address space",
//             "To remove the need for RAM",
//             "To make every program single-threaded",
//             "To eliminate system calls"
//           ],
//           answer: 0,
//           explanation:
//             "Virtual memory gives processes controlled, isolated address spaces and enables techniques such as paging."
//         },
//         {
//           question: "A page fault means...",
//           options: [
//             "The CPU has permanently failed",
//             "A requested page is not currently mapped in physical memory",
//             "The filesystem has been deleted",
//             "A process has finished"
//           ],
//           answer: 1,
//           explanation:
//             "A page fault occurs when a process accesses a page that is not currently available in the required physical memory mapping."
//         }
//       ]
//     },

//     {
//       id: 4,
//       title: "Kernel / System Calls",
//       type: "terminal",
//       description:
//         "User programs do not directly control protected hardware. They request privileged operations through system calls.",
//     },

//     {
//       id: 5,
//       title: "Deadlock / Resources",
//       type: "quiz",
//       description:
//         "Deadlock occurs when processes become permanently stuck waiting for resources held by one another.",
//       questions: [
//         {
//           question: "Which condition is required for deadlock?",
//           options: [
//             "Mutual exclusion",
//             "Unlimited resources",
//             "No process waiting",
//             "A powered-off CPU"
//           ],
//           answer: 0,
//           explanation:
//             "Mutual exclusion is one of the four Coffman conditions associated with deadlock."
//         },
//         {
//           question: "What does circular wait mean?",
//           options: [
//             "Every process runs in a circle",
//             "Processes form a cycle where each waits for a resource held by another",
//             "The CPU clock loops",
//             "The filesystem is circular"
//           ],
//           answer: 1,
//           explanation:
//             "Circular wait means P1 waits for P2, P2 waits for P3, and eventually another process waits for P1."
//         },
//         {
//           question: "Which is a deadlock recovery strategy?",
//           options: [
//             "Terminate one or more processes",
//             "Give every process infinite RAM",
//             "Remove all system calls",
//             "Disable the keyboard"
//           ],
//           answer: 0,
//           explanation:
//             "An OS can recover by terminating processes or forcibly reclaiming resources, depending on its design."
//         }
//       ]
//     }
//   ]
// };

// /* =========================================================
//    DOM HELPERS
//    ========================================================= */

// const $ = (selector, parent = document) =>
//   parent.querySelector(selector);

// const $$ = (selector, parent = document) =>
//   [...parent.querySelectorAll(selector)];

// function escapeHTML(value) {
//   return String(value)
//     .replaceAll("&", "&amp;")
//     .replaceAll("<", "&lt;")
//     .replaceAll(">", "&gt;")
//     .replaceAll('"', "&quot;")
//     .replaceAll("'", "&#039;");
// }

// /* =========================================================
//    HUD
//    ========================================================= */

// function updateHUD() {
//   const score = $("#score");
//   const streak = $("#streak");
//   const lives = $("#lives");
//   const level = $("#level");

//   if (score) score.textContent = GAME.score;
//   if (streak) streak.textContent = GAME.streak;
//   if (lives) lives.textContent = "●".repeat(GAME.lives) + "○".repeat(3 - GAME.lives);
//   if (level) level.textContent = `${GAME.level} / ${GAME.levels.length}`;
// }

// /* =========================================================
//    SCORE
//    ========================================================= */

// function awardPoints(points) {
//   GAME.score += points;
//   GAME.streak += 1;

//   if (GAME.streak >= 3) {
//     GAME.score += 10;
//   }

//   updateHUD();
// }

// function loseLife() {
//   GAME.lives = Math.max(0, GAME.lives - 1);
//   GAME.streak = 0;

//   updateHUD();

//   if (GAME.lives <= 0) {
//     showGameOver();
//   }
// }

// /* =========================================================
//    GAME OVER
//    ========================================================= */

// function showGameOver() {
//   const complete = $("#gameComplete");

//   if (!complete) return;

//   complete.classList.add("is-visible");

//   const label = $(".complete-label", complete);
//   const heading = $("h2", complete);
//   const score = $(".complete-score strong", complete);
//   const copy = $(".complete-copy", complete);

//   if (label) label.textContent = "SESSION ENDED";
//   if (heading) heading.innerHTML = "Kernel said <em>no.</em>";
//   if (score) score.textContent = GAME.score;

//   if (copy) {
//     copy.textContent =
//       "You ran out of lives. The useful part is understanding why the answer failed. Reset the lab and try again.";
//   }

//   complete.scrollIntoView({
//     behavior: "smooth",
//     block: "center"
//   });
// }

// /* =========================================================
//    COMPLETION
//    ========================================================= */

// function showCompletion() {
//   GAME.completed = true;

//   const complete = $("#gameComplete");

//   if (!complete) return;

//   complete.classList.add("is-visible");

//   const label = $(".complete-label", complete);
//   const heading = $("h2", complete);
//   const score = $(".complete-score strong", complete);
//   const copy = $(".complete-copy", complete);

//   if (label) label.textContent = "LAB COMPLETE";

//   if (heading) {
//     heading.innerHTML = "You understand the <em>machine.</em>";
//   }

//   if (score) {
//     score.textContent = GAME.score;
//   }

//   if (copy) {
//     copy.textContent =
//       "You moved through process state, scheduling, memory translation, system calls, and deadlock. The point was never memorisation. It was learning what the machine is actually doing.";
//   }

//   updateLevelMap();

//   complete.scrollIntoView({
//     behavior: "smooth",
//     block: "center"
//   });
// }

// /* =========================================================
//    LEVEL MAP
//    ========================================================= */

// function updateLevelMap() {
//   $$(".level-map-item").forEach((item) => {
//     const level = Number(item.dataset.level);

//     item.classList.toggle(
//       "is-current",
//       level === GAME.level && !GAME.completed
//     );

//     item.classList.toggle(
//       "is-complete",
//       level < GAME.level || GAME.completed
//     );
//   });
// }

// /* =========================================================
//    GENERIC LEVEL SHELL
//    ========================================================= */

// function renderLevel() {
//   const level = GAME.levels[GAME.level - 1];

//   if (!level) {
//     showCompletion();
//     return;
//   }

//   GAME.answered = false;
//   GAME.question = 0;

//   const title = $("#levelTitle");
//   const description = $("#levelDescription");
//   const number = $("#levelNumber");

//   if (title) title.textContent = level.title;
//   if (description) description.textContent = level.description;
//   if (number) number.textContent = String(level.id).padStart(2, "0");

//   updateHUD();
//   updateLevelMap();

//   const mount = $("#gameMount");

//   if (!mount) return;

//   mount.innerHTML = "";

//   if (level.type === "quiz") {
//     renderQuiz(mount, level);
//   }

//   if (level.type === "scheduler") {
//     renderScheduler(mount, level);
//   }

//   if (level.type === "terminal") {
//     renderTerminal(mount, level);
//   }
// }

// /* =========================================================
//    QUIZ
//    ========================================================= */

// function renderQuiz(mount, level) {
//   const question = level.questions[GAME.question];

//   mount.innerHTML = `
//     <div class="playfield">
//       <div class="quiz-panel">

//         <section class="quiz-question">
//           <div class="question-meta">
//             <span>QUESTION ${GAME.question + 1} / ${level.questions.length}</span>
//             <strong>+100 POINTS</strong>
//           </div>

//           <h3>${escapeHTML(question.question)}</h3>

//           <p>
//             Choose the answer that describes what the operating system
//             is actually doing, not the answer that merely sounds plausible.
//           </p>
//         </section>

//         <section class="quiz-options" aria-label="Answer choices">
//           ${question.options
//             .map(
//               (option, index) => `
//                 <button
//                   class="quiz-option"
//                   type="button"
//                   data-answer="${index}"
//                 >
//                   <span class="quiz-option-number">
//                     ${String.fromCharCode(65 + index)}
//                   </span>

//                   <span class="quiz-option-text">
//                     ${escapeHTML(option)}
//                   </span>
//                 </button>
//               `
//             )
//             .join("")}
//         </section>
//       </div>

//       <div class="answer-feedback" id="answerFeedback">
//         <div class="feedback-status"></div>
//         <div class="feedback-message"></div>
//         <button class="feedback-next" type="button">
//           NEXT →
//         </button>
//       </div>
//     </div>
//   `;

//   const options = $$(".quiz-option", mount);

//   options.forEach((button) => {
//     button.addEventListener("click", () => {
//       answerQuiz(button, question, options);
//     });
//   });

//   $(".feedback-next", mount)?.addEventListener("click", nextQuizQuestion);
// }

// function answerQuiz(selected, question, options) {
//   if (GAME.answered) return;

//   GAME.answered = true;

//   const selectedAnswer = Number(selected.dataset.answer);
//   const correct = selectedAnswer === question.answer;

//   options.forEach((button) => {
//     button.classList.add("is-disabled");

//     const answer = Number(button.dataset.answer);

//     if (answer === question.answer) {
//       button.classList.add("is-correct");
//     }
//   });

//   const feedback = $("#answerFeedback");
//   const status = $(".feedback-status", feedback);
//   const message = $(".feedback-message", feedback);

//   if (correct) {
//     selected.classList.add("is-correct");

//     awardPoints(100);

//     if (status) status.textContent = "CORRECT / +100";
//   } else {
//     selected.classList.add("is-wrong");

//     loseLife();

//     if (status) status.textContent = "WRONG / LIFE LOST";
//   }

//   if (message) {
//     message.textContent = question.explanation;
//   }

//   feedback?.classList.add("is-visible");
// }

// function nextQuizQuestion() {
//   const level = GAME.levels[GAME.level - 1];

//   GAME.question += 1;

//   if (GAME.question >= level.questions.length) {
//     finishLevel();
//     return;
//   }

//   renderLevel();
// }

// /* =========================================================
//    LEVEL COMPLETION
//    ========================================================= */

// function finishLevel() {
//   const current = GAME.level;

//   $$(".level-map-item").forEach((item) => {
//     if (Number(item.dataset.level) === current) {
//       item.classList.add("is-complete");
//     }
//   });

//   GAME.level += 1;

//   if (GAME.level > GAME.levels.length) {
//     showCompletion();
//     return;
//   }

//   renderLevel();

//   window.scrollTo({
//     top: document.querySelector(".game-area")?.offsetTop || 0,
//     behavior: "smooth"
//   });
// }

// /* =========================================================
//    CPU SCHEDULER GAME
//    ========================================================= */

// const schedulerProcesses = [
//   {
//     name: "P1",
//     burst: 4,
//     color: "red"
//   },
//   {
//     name: "P2",
//     burst: 3,
//     color: "gray"
//   },
//   {
//     name: "P3",
//     burst: 7,
//     color: "black"
//   },
//   {
//     name: "P4",
//     burst: 2,
//     color: "red"
//   }
// ];

// function renderScheduler(mount) {
//   mount.innerHTML = `
//     <div class="playfield">
//       <div class="scheduler">

//         <div class="scheduler-head">
//           <h3>Feed the CPU.</h3>

//           <p>
//             Put the processes in the correct shortest-job-first order.
//             This is deliberately simple: no preemption, one CPU,
//             shortest burst first.
//           </p>
//         </div>

//         <div class="scheduler-processes" id="schedulerProcesses">
//           ${schedulerProcesses
//             .map(
//               (process, index) => `
//                 <div
//                   class="scheduler-row"
//                   draggable="true"
//                   data-process="${process.name}"
//                   data-burst="${process.burst}"
//                 >
//                   <div class="process-name">${process.name}</div>

//                   <div
//                     class="process-burst"
//                     style="width:${Math.max(
//                       20,
//                       process.burst * 8
//                     )}%"
//                   >
//                     ${process.burst} CPU units
//                   </div>

//                   <div class="process-time">
//                     burst = ${process.burst}
//                   </div>
//                 </div>
//               `
//             )
//             .join("")}
//         </div>

//         <div class="scheduler-controls">
//           <button
//             class="scheduler-button primary"
//             id="checkSchedule"
//             type="button"
//           >
//             CHECK ORDER
//           </button>

//           <button
//             class="scheduler-button"
//             id="shuffleSchedule"
//             type="button"
//           >
//             SHUFFLE
//           </button>

//           <span
//             id="schedulerMessage"
//             style="font-size:.68rem;color:var(--muted)"
//           >
//             shortest burst first
//           </span>
//         </div>

//       </div>
//     </div>
//   `;

//   setupScheduler();
// }

// function setupScheduler() {
//   const container = $("#schedulerProcesses");

//   if (!container) return;

//   let dragged = null;

//   $$(".scheduler-row", container).forEach((row) => {
//     row.addEventListener("dragstart", () => {
//       dragged = row;
//       row.style.opacity = ".45";
//     });

//     row.addEventListener("dragend", () => {
//       dragged = null;
//       row.style.opacity = "";
//     });

//     row.addEventListener("dragover", (event) => {
//       event.preventDefault();

//       if (!dragged || dragged === row) return;

//       const rect = row.getBoundingClientRect();

//       if (event.clientY < rect.top + rect.height / 2) {
//         row.before(dragged);
//       } else {
//         row.after(dragged);
//       }
//     });
//   });

//   $("#checkSchedule")?.addEventListener("click", checkSchedule);
//   $("#shuffleSchedule")?.addEventListener("click", shuffleSchedule);
// }

// function checkSchedule() {
//   const rows = $$(".scheduler-row", $("#schedulerProcesses"));

//   const order = rows.map((row) => Number(row.dataset.burst));

//   const correct = [...order].sort((a, b) => a - b);

//   const isCorrect = order.every(
//     (value, index) => value === correct[index]
//   );

//   const message = $("#schedulerMessage");

//   if (isCorrect) {
//     awardPoints(200);

//     if (message) {
//       message.textContent = "CORRECT. Shortest burst first.";
//       message.style.color = "#526b50";
//     }

//     rows.forEach((row) => {
//       row.style.background = "#526b50";
//       row.style.color = "#fff";
//     });

//     setTimeout(finishLevel, 900);
//   } else {
//     loseLife();

//     if (message) {
//       message.textContent =
//         "Not quite. Compare the burst lengths.";
//       message.style.color = "var(--red)";
//     }
//   }
// }

// function shuffleSchedule() {
//   const container = $("#schedulerProcesses");

//   if (!container) return;

//   const rows = $$(".scheduler-row", container);

//   for (let i = rows.length - 1; i > 0; i--) {
//     const random = Math.floor(Math.random() * (i + 1));

//     if (i !== random) {
//       container.insertBefore(
//         rows[random],
//         rows[i]
//       );
//     }
//   }

//   const message = $("#schedulerMessage");

//   if (message) {
//     message.textContent = "Order scrambled.";
//     message.style.color = "var(--muted)";
//   }
// }

// /* =========================================================
//    TERMINAL GAME
//    ========================================================= */

// const terminalCommands = {
//   help: {
//     output: [
//       "Available commands:",
//       "  read       inspect a protected file",
//       "  syscall    request kernel service",
//       "  user       show current privilege level",
//       "  clear      clear terminal",
//       "  help       show this message"
//     ],
//     type: "system"
//   },

//   user: {
//     output: ["user mode / privilege: restricted"],
//     type: "system"
//   },

//   read: {
//     output: [
//       "permission denied",
//       "protected resource requires kernel mediation"
//     ],
//     type: "error"
//   },

//   syscall: {
//     output: [
//       "trap instruction issued",
//       "CPU switched privilege level",
//       "kernel handler entered",
//       "request validated",
//       "return to user mode"
//     ],
//     type: "success"
//   }
// };

// function renderTerminal(mount) {
//   mount.innerHTML = `
//     <div class="terminal-game">

//       <div class="terminal-top">
//         <span>TTY / KERNEL GATEWAY</span>
//         <span class="terminal-status">● ONLINE</span>
//       </div>

//       <div class="terminal-body">

//         <div class="terminal-output" id="terminalOutput">
//           <div class="terminal-line system">
//             OS FIELD GUIDE / PRIVILEGE LAB
//           </div>

//           <div class="terminal-line system">
//             Type "help" to inspect available commands.
//           </div>

//           <div class="terminal-line system">
//             Goal: demonstrate how user programs reach privileged services.
//           </div>
//         </div>

//         <form class="terminal-prompt" id="terminalForm">
//           <span>user@fieldguide:$</span>

//           <input
//             id="terminalInput"
//             class="terminal-input"
//             type="text"
//             autocomplete="off"
//             spellcheck="false"
//             placeholder="type a command..."
//             aria-label="Terminal command"
//           />
//         </form>

//       </div>
//     </div>
//   `;

//   setupTerminal();
// }

// function setupTerminal() {
//   const form = $("#terminalForm");
//   const input = $("#terminalInput");
//   const output = $("#terminalOutput");

//   if (!form || !input || !output) return;

//   form.addEventListener("submit", (event) => {
//     event.preventDefault();

//     const command = input.value.trim().toLowerCase();

//     if (!command) return;

//     appendTerminalLine(
//       `user@fieldguide:$ ${command}`,
//       "command"
//     );

//     if (command === "clear") {
//       output.innerHTML = "";
//       input.value = "";
//       return;
//     }

//     const result = terminalCommands[command];

//     if (!result) {
//       appendTerminalLine(
//         `command not found: ${command}`,
//         "error"
//       );

//       input.value = "";
//       return;
//     }

//     result.output.forEach((line) => {
//       appendTerminalLine(line, result.type);
//     });

//     if (command === "syscall") {
//       awardPoints(200);

//       setTimeout(() => {
//         finishLevel();
//       }, 1100);
//     }

//     input.value = "";

//     output.scrollTop = output.scrollHeight;
//   });

//   input.focus();
// }

// function appendTerminalLine(text, type) {
//   const output = $("#terminalOutput");

//   if (!output) return;

//   const line = document.createElement("div");

//   line.className = `terminal-line ${type || ""}`;
//   line.textContent = text;

//   output.appendChild(line);
// }

// /* =========================================================
//    LEVEL NAVIGATION
//    ========================================================= */

// function setupLevelMap() {
//   $$(".level-map-item").forEach((item) => {
//     item.addEventListener("click", () => {
//       const target = Number(item.dataset.level);

//       if (!target) return;

//       /*
//        * Do not allow jumping into levels that have not
//        * been completed. This keeps the learning sequence intact.
//        */

//       if (target > GAME.level) {
//         return;
//       }

//       GAME.level = target;
//       GAME.completed = false;

//       $("#gameComplete")?.classList.remove("is-visible");

//       renderLevel();

//       window.scrollTo({
//         top: document.querySelector(".game-area")?.offsetTop || 0,
//         behavior: "smooth"
//       });
//     });
//   });
// }

// /* =========================================================
//    RESET
//    ========================================================= */

// function resetGame() {
//   GAME.score = 0;
//   GAME.streak = 0;
//   GAME.lives = 3;
//   GAME.level = 1;
//   GAME.question = 0;
//   GAME.answered = false;
//   GAME.completed = false;

//   $("#gameComplete")?.classList.remove("is-visible");

//   updateHUD();
//   renderLevel();

//   window.scrollTo({
//     top: 0,
//     behavior: "smooth"
//   });
// }

// /* =========================================================
//    GLOBAL RESET BUTTONS
//    ========================================================= */

// function setupResetButtons() {
//   $$("[data-reset-game]").forEach((button) => {
//     button.addEventListener("click", resetGame);
//   });

//   $("#restartGame")?.addEventListener("click", resetGame);
// }

// /* =========================================================
//    KEYBOARD SHORTCUTS
//    ========================================================= */

// function setupKeyboard() {
//   document.addEventListener("keydown", (event) => {
//     /*
//      * Number keys 1-4 select quiz answers.
//      */
//     if (
//       ["1", "2", "3", "4"].includes(event.key)
//     ) {
//       const options = $$(".quiz-option");

//       const index = Number(event.key) - 1;

//       if (options[index]) {
//         options[index].click();
//       }
//     }

//     /*
//      * Enter advances a visible answer.
//      */
//     if (event.key === "Enter") {
//       const next = $(".feedback-next");

//       if (
//         next &&
//         $(".answer-feedback")?.classList.contains("is-visible")
//       ) {
//         next.click();
//       }
//     }

//     /*
//      * R resets the game unless the user is typing.
//      */
//     if (
//       event.key.toLowerCase() === "r" &&
//       !["INPUT", "TEXTAREA"].includes(
//         document.activeElement?.tagName
//       )
//     ) {
//       resetGame();
//     }
//   });
// }

// /* =========================================================
//    INITIALISE
//    ========================================================= */

// function initGame() {
//   updateHUD();
//   setupLevelMap();
//   setupResetButtons();
//   setupKeyboard();
//   renderLevel();
// }

// if (document.readyState === "loading") {
//   document.addEventListener("DOMContentLoaded", initGame);
// } else {
//   initGame();
// }




(() => {
  "use strict";

  const state = {
    score: 0,
    errors: 0,
    mission: 1,
    interruptStep: 0,
    locked: false
  };

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const introScreen = $("#introScreen");
  const simulation = $("#simulation");
  const completeScreen = $("#completeScreen");

  const scoreEl = $("#score");
  const errorEl = $("#errorCount");
  const progressBar = $("#progressBar");

  const missionNumber = $("#missionNumber");
  const roundNumber = $("#roundNumber");
  const missionTitle = $("#missionTitle");

  /* =======================================================
     SCORE
     ======================================================= */

  function updateScore(points) {
    state.score += points;

    if (state.score < 0) {
      state.score = 0;
    }

    scoreEl.textContent =
      String(state.score).padStart(3, "0");
  }

  function registerError() {
    state.errors++;

    errorEl.textContent =
      String(state.errors).padStart(2, "0");

    updateScore(-10);
  }

  /* =======================================================
     PROGRESS
     ======================================================= */

  function updateProgress() {
    const percentage =
      ((state.mission - 1) / 4) * 100;

    progressBar.style.width = `${percentage}%`;
  }

  /* =======================================================
     START
     ======================================================= */

  $("#startGame").addEventListener("click", () => {

    introScreen.classList.add("hidden");
    simulation.classList.remove("hidden");

    state.mission = 1;

    showMission(1);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  /* =======================================================
     MISSION SWITCHING
     ======================================================= */

  function showMission(number) {

    $$(".mission").forEach(mission => {
      mission.classList.remove("active");
    });

    const target =
      $(`#mission${number}`);

    if (target) {
      target.classList.add("active");
    }

    state.mission = number;

    missionNumber.textContent =
      String(number).padStart(2, "0");

    roundNumber.textContent =
      String(number).padStart(2, "0");

    const titles = {
      1: "KEEP THE CPU ALIVE.",
      2: "A PROCESS GOT BLOCKED.",
      3: "MEMORY IS NOT INFINITE.",
      4: "HANDLE THE INTERRUPT."
    };

    missionTitle.textContent = titles[number];

    updateProgress();

    window.scrollTo({
      top: simulation.offsetTop - 30,
      behavior: "smooth"
    });
  }

  function nextMission() {

    if (state.mission >= 4) {
      finishGame();
      return;
    }

    showMission(state.mission + 1);
  }

  /* =======================================================
     MISSION 1 — CPU SCHEDULING
     ======================================================= */

  const processCards =
    $$(".process-card");

  const cpuScreen =
    $("#cpuScreen");

  const mission1Feedback =
    $("#mission1Feedback");

  processCards.forEach(card => {

    card.addEventListener("click", () => {

      if (state.locked) {
        return;
      }

      const burst =
        Number(card.dataset.burst);

      const allBursts =
        processCards.map(item =>
          Number(item.dataset.burst)
        );

      const shortest =
        Math.min(...allBursts);

      processCards.forEach(item => {
        item.classList.remove(
          "selected",
          "wrong"
        );
      });

      if (burst === shortest) {

        card.classList.add("selected");

        cpuScreen.classList.add("running");

        cpuScreen.innerHTML = `
          <strong>${card.dataset.process}</strong>
        `;

        mission1Feedback.className =
          "feedback success";

        mission1Feedback.innerHTML =
          `Correct. ${card.dataset.process} has the shortest burst time: ${burst} ms. The scheduler gets the CPU moving.`;

        updateScore(100);

        state.locked = true;

        setTimeout(() => {
          state.locked = false;
          nextMission();
        }, 1200);

      } else {

        card.classList.add("wrong");

        mission1Feedback.className =
          "feedback error";

        mission1Feedback.innerHTML =
          `Not quite. ${card.dataset.process} needs ${burst} ms. Look for the smallest remaining burst.`;

        registerError();

        setTimeout(() => {
          card.classList.remove("wrong");
        }, 700);
      }
    });
  });

  /* =======================================================
     MISSION 2 — PROCESS STATES
     ======================================================= */

  const stateChoices =
    $$(".state-choice");

  const mission2Feedback =
    $("#mission2Feedback");

  stateChoices.forEach(choice => {

    choice.addEventListener("click", () => {

      if (state.locked) {
        return;
      }

      const selected =
        choice.dataset.state;

      stateChoices.forEach(item => {
        item.classList.remove(
          "correct",
          "wrong"
        );
      });

      if (selected === "blocked") {

        choice.classList.add("correct");

        mission2Feedback.className =
          "feedback success";

        mission2Feedback.textContent =
          "Correct. P2 is waiting for I/O, so it leaves RUNNING and enters BLOCKED.";

        updateScore(100);

        state.locked = true;

        setTimeout(() => {
          state.locked = false;
          nextMission();
        }, 1200);

      } else {

        choice.classList.add("wrong");

        mission2Feedback.className =
          "feedback error";

        if (selected === "ready") {
          mission2Feedback.textContent =
            "READY means waiting for CPU time. P2 is waiting for I/O instead.";
        } else {
          mission2Feedback.textContent =
            "TERMINATED means the process has finished. P2 is still alive.";
        }

        registerError();

        setTimeout(() => {
          choice.classList.remove("wrong");
        }, 700);
      }
    });
  });

  /* =======================================================
     MISSION 3 — MEMORY
     ======================================================= */

  const memoryBlocks =
    $$(".memory-block");

  const mission3Feedback =
    $("#mission3Feedback");

  memoryBlocks.forEach(block => {

    block.addEventListener("click", () => {

      if (state.locked) {
        return;
      }

      const size =
        Number(block.dataset.size);

      memoryBlocks.forEach(item => {
        item.classList.remove(
          "correct",
          "wrong"
        );
      });

      /*
       * Request = 180 KB.
       *
       * Blocks that fit:
       * 256 KB
       * 512 KB
       * 192 KB
       *
       * Best fit = 192 KB.
       */

      if (size === 192) {

        block.classList.add("correct");

        mission3Feedback.className =
          "feedback success";

        mission3Feedback.textContent =
          "Correct. 192 KB is the smallest block that can hold the 180 KB request. That is best-fit allocation.";

        updateScore(100);

        state.locked = true;

        setTimeout(() => {
          state.locked = false;
          nextMission();
        }, 1200);

      } else {

        block.classList.add("wrong");

        mission3Feedback.className =
          "feedback error";

        if (size < 180) {
          mission3Feedback.textContent =
            `${size} KB is too small. The process needs 180 KB.`;
        } else {
          mission3Feedback.textContent =
            `${size} KB works, but it is not the smallest block that fits. Look for the best fit.`;
        }

        registerError();

        setTimeout(() => {
          block.classList.remove("wrong");
        }, 700);
      }
    });
  });

  /* =======================================================
     MISSION 4 — INTERRUPTS
     ======================================================= */

  const interruptEvents =
    $$(".interrupt-event");

  const timelineSlots =
    $$(".timeline-slot");

  const mission4Feedback =
    $("#mission4Feedback");

  interruptEvents.forEach(event => {

    event.addEventListener("click", () => {

      if (state.locked) {
        return;
      }

      const expectedOrder =
        Number(event.dataset.order);

      /*
       * The only legal sequence is:
       *
       * 1. Device signals
       * 2. CPU saves context
       * 3. Handler runs
       * 4. Resume P1
       */

      if (expectedOrder === state.interruptStep + 1) {

        const slot =
          timelineSlots[state.interruptStep];

        slot.classList.add("filled");

        slot.querySelector("div").textContent =
          event.querySelector("strong").textContent;

        event.classList.add("used");

        state.interruptStep++;

        updateScore(25);

        mission4Feedback.className =
          "feedback success";

        mission4Feedback.textContent =
          state.interruptStep === 4
            ? "Sequence complete. The CPU can safely return to P1."
            : "Correct. Keep building the sequence.";

        if (state.interruptStep === 4) {

          updateScore(75);

          state.locked = true;

          setTimeout(() => {
            state.locked = false;
            finishGame();
          }, 1200);
        }

      } else {

        mission4Feedback.className =
          "feedback error";

        mission4Feedback.textContent =
          "Wrong order. Think about what the CPU must do before the interrupt handler can safely run.";

        registerError();
      }
    });
  });

  /* =======================================================
     FINISH
     ======================================================= */

  function finishGame() {

    $$(".mission").forEach(mission => {
      mission.classList.remove("active");
    });

    completeScreen.classList.remove("hidden");

    progressBar.style.width = "100%";

    $("#finalScore").textContent =
      String(state.score).padStart(3, "0");

    $("#finalErrors").textContent =
      String(state.errors).padStart(2, "0");

    const status =
      $("#finalStatus");

    const message =
      $("#finalMessage");

    if (state.errors === 0) {

      status.textContent = "PERFECT";

      message.textContent =
        "Four missions. Zero mistakes. The scheduler, memory manager and interrupt machinery survived your decisions.";

    } else if (state.errors <= 2) {

      status.textContent = "PASS";

      message.textContent =
        "You made a few bad calls, but recovered. That is closer to real operating systems than you might think.";

    } else {

      status.textContent = "RECOVERED";

      message.textContent =
        "The machine survived. Your first instinct did not always. Run it again and watch where the system punished you.";
    }

    window.scrollTo({
      top: completeScreen.offsetTop - 40,
      behavior: "smooth"
    });
  }

  /* =======================================================
     RESTART
     ======================================================= */

  $("#restartGame").addEventListener("click", () => {

    state.score = 0;
    state.errors = 0;
    state.mission = 1;
    state.interruptStep = 0;
    state.locked = false;

    scoreEl.textContent = "000";
    errorEl.textContent = "00";

    completeScreen.classList.add("hidden");

    processCards.forEach(card => {
      card.classList.remove(
        "selected",
        "wrong"
      );
    });

    stateChoices.forEach(choice => {
      choice.classList.remove(
        "correct",
        "wrong"
      );
    });

    memoryBlocks.forEach(block => {
      block.classList.remove(
        "correct",
        "wrong"
      );
    });

    interruptEvents.forEach(event => {
      event.classList.remove("used");
    });

    timelineSlots.forEach((slot, index) => {
      slot.classList.remove("filled");

      slot.querySelector("div").textContent =
        "EMPTY";
    });

    cpuScreen.classList.remove("running");

    cpuScreen.innerHTML =
      "<span>WAITING</span>";

    mission1Feedback.className =
      "feedback";

    mission1Feedback.textContent =
      "Choose a process.";

    mission2Feedback.className =
      "feedback";

    mission2Feedback.textContent =
      "Identify the correct state.";

    mission3Feedback.className =
      "feedback";

    mission3Feedback.textContent =
      "Allocate P5.";

    mission4Feedback.className =
      "feedback";

    mission4Feedback.textContent =
      "Build the interrupt sequence.";

    showMission(1);
  });

})();