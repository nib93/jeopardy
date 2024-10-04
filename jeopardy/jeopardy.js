function createTable() {
  return $(`<table class="jeopardy-board">
  <thead>
    <tr>
      <th><div class="game-category"></th>
      <th><div class="game-category"></th>
      <th><div class="game-category"></th>
      <th><div class="game-category"></th>
      <th><div class="game-category"></th>
      <th><div class="game-category"></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><div class="question-answer" id="cell-1-1"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-2-1"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-3-1"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-4-1"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-5-1"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-6-1"><div class="icon">?</div></div></td>
    </tr>
    <tr>
      <td><div class="question-answer" id="cell-1-2"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-2-2"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-3-2"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-4-2"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-5-2"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-6-2"><div class="icon">?</div></div></td>
    </tr>
    <tr>
      <td><div class="question-answer" id="cell-1-3"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-2-3"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-3-3"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-4-3"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-5-3"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-6-3"><div class="icon">?</div></div></td>
    </tr>
    <tr>
      <td><div class="question-answer" id="cell-1-4"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-2-4"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-3-4"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-4-4"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-5-4"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-6-4"><div class="icon">?</div></div></td>
    </tr>
    <tr>
      <td><div class="question-answer" id="cell-1-5"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-2-5"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-3-5"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-4-5"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-5-5"><div class="icon">?</div></div></td>
      <td><div class="question-answer" id="cell-6-5"><div class="icon">?</div></div></td>
    </tr>
  </tbody>
  </table>`);
}

// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

function shuffle(arr) {
  // shuffeing the array to get random categories
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function getCategoryIds() {
  try {
    
    categories.length = 0;
    let categoryIds = [];
    let response = await axios.get(
      "https://rithm-jeopardy.herokuapp.com/api/categories?count=100"
    );
    // When start or restart the game, push all the ids in category
    for (let allData of response.data) {
      categoryIds.push(allData.id);
    }
    // Get random categories from the list
    shuffle(categoryIds);
    for (let i = 0; i < 6; i++) {
      categories.push(categoryIds[i]);
    }
  } catch (error) {
    console.error("Error fetching category IDs:", error);
    throw error;
  }
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
  //Request the data from the api. If it's not accessible them throw feting error
  try {
    let response = await axios.get(
      `https://rithm-jeopardy.herokuapp.com/api/category?id=${catId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching category IDs:", error);
    throw error;
  }
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */
let questionsList = [
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
];

let answersList = [
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
  [null, null, null, null, null, null],
];

// push all the the questions from the clue arr
async function getQuestionIds(categoryId, questionIdsArr = []) {
  try {
    let questionIdList = [];
    let responseData = await getCategory(categoryId);
    for (let everyQuestion of responseData.clues) {
      questionIdList.push(everyQuestion.id);
    }
    shuffle(questionIdList);
    for (let i = 0; i < 5; i++) {
      questionIdsArr.push(questionIdList[i]);
    }
  } catch (error) {
    console.error("Error in fetching category IDs:", error);
    throw error;
  }
}

// Store the questions details in the array randomly
async function getQuestions(catId, questionArr = []) {
  try {
    let responseObj = await getCategory(catId);
    let randomQuesIds = [];
    let respQuestionIds = await getQuestionIds(catId, randomQuesIds);
    for (let id of randomQuesIds) {
      for (let everyQuestion of responseObj.clues) {
        if (everyQuestion.id == id) {
          questionArr.push(everyQuestion.question);
        }
      }
    }
  } catch (error) {
    console.error("Error in fetching category IDs:", error);
    throw error;
  }
}

// Store the answers to the questions in the array from the clues
async function getAnswers(catId, questionArr = [], answerArr) {
  try {
    let responseObj = await getCategory(catId);
    for (let question of questionArr) {
      for (let obj of responseObj.clues) {
        if (obj.question === question) {
          answerArr.push(obj.answer);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching category IDs:", error);
    throw error;
  }
}

async function fillTable() {
  try {
    let headingCells = $(".game-category");
    await getCategoryIds();
    // fill the heading/catgory of the game in the first row
    for (let i = 0; i < headingCells.length; i++) {
      let categoryData = await getCategory(categories[i]);
      let categoryTitle = categoryData.title;
      headingCells[i].textContent = categoryTitle;
    }

    let row = 0;
    let column = -1;

    for (let eachId of categories) {
      let questions = [];
      let answers = [];
      await getQuestions(eachId, questions);
      await getAnswers(eachId, questions, answers);

      // adding questions and answers to question/answer table
      column++;
      respColumn = 0;
      while (row < 5) {
        questionsList[row][column] = questions[respColumn];
        answersList[row][column] = answers[respColumn];
        row++;
        respColumn++;
      }
      row = 0;
    }
  } catch (error) {
    console.error("Error filling table:", error);
  }
}

function extractRowColumn(htmlString) {
  //fetch column and row data
  let column = parseInt(htmlString[htmlString.indexOf(`id="cell`) + 9]);
  let row = parseInt(htmlString[htmlString.indexOf(`id="cell`) + 11]);
  
  return { row, column };
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
  let $loadingOverlay = $("#loading-overlay");
  $loadingOverlay.show();
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
  let $loadingOverlay = $("#loading-overlay");
  $loadingOverlay.hide();
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
  let $restartBtn = $("#restart-btn");
  showLoadingView();
  $restartBtn.text("Loading...");
  if ($(".board-game").find(".jeopardy-board")) {
    $(".board-game").find(".jeopardy-board").remove();
    $(".board-game").append(createTable());
  } else {
    $(".board-game").append(createTable());
  }
  await fillTable();
  hideLoadingView();
  $restartBtn.text("Restart!");
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */
function handleClick(evt) {
  let $cell = $(evt.currentTarget);
  let html = evt.currentTarget.outerHTML;
  let { row, column } = extractRowColumn(html);
  if (!$cell.hasClass("question") && !$cell.hasClass("answer")) {
    $cell.empty();
    $cell.addClass("question");
    $cell.append(
      `<p id="cell-${column}-${row}">${questionsList[row - 1][column - 1]}</p>`
    );
  } else if ($cell.attr("class") === "question") {
    $cell.empty();
    $cell.removeClass("question");
    $cell.addClass("answer");
    $cell.append(
      `<p id="cell-${column}-${row}">${answersList[row - 1][column - 1]}</p>`
    );
  } else {
    return;
  }
}
/** On click of start / restart button, set up game. */

let $restartBtn = $("#restart-btn");
$restartBtn.on("click", setupAndStart);

// On click of table cells, show questions & answers
let gameTableCells = $(".board-game .jeopardy-board tbody tr td");
$(".board-game").on("click", ".jeopardy-board td", handleClick);