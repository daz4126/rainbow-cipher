// imports
import { pickRandom } from "jog-list"
import { words } from "./words.js"
import surge from "@daz4126/surge"
import JSConfetti from "js-confetti"

const jsConfetti = new JSConfetti()

const keys = words.filter(word => word.length === new Set([...word]).size)
const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"
const fruit = ["🔴","🟡","🟢","🔵","🟣"]
const veg =  ["🟥","🟨","🟩","🟦","🟪"]

const encrypt = (word,key) => [...word].map(letter => {
  const char = letter === "J" ? "I" : letter
  const cipher = key + [...alphabet].filter(x => !key.includes(x)).join``
  const n = cipher.indexOf(char)
  return fruit[Math.floor(n/5)] + veg[n%5] + "  "
 }).join``

const table = `
  <table>
    <thead>
      <td></td>
      <td>${veg[0]}</td>
      <td>${veg[1]}</td>
      <td>${veg[2]}</td>
      <td>${veg[3]}</td>
      <td>${veg[4]}</td>
    </thead>
    ${fruit.map(f => `<tr><td>${f}</td><td><input data-fruit=${f} data-veg=${veg[0]} data-action="updateSolution"></td><td><input data-fruit=${f} data-veg=${veg[1]} data-action="updateSolution"></td><td><input data-fruit=${f} data-veg=${veg[2]} data-action="updateSolution"></td><td><input data-fruit=${f} data-veg=${veg[3]} data-action="updateSolution"></td><td><input data-fruit=${f} data-veg=${veg[4]} data-action="updateSolution"></td></tr>`).join``}
  </table>
`

surge({
  start: $ => {
    $.instructions.hidden = true
    $.gameOver.hidden = true
    $.game.hidden = false
    Array.from($.solution.childNodes).forEach(cell => cell.value = "")
    Array.from($.table.querySelectorAll("input")).forEach(cell => cell.value = "")
    $.table.value = ""
    $.clues.value = ""
    $.score.value = 10
    $.correct.value = 0
    $.table.append(table)
    console.log($._id,keys[$._id])
    $._key = ($._id ? keys[$._id] : pickRandom(keys)).toUpperCase()
    $._id = null
    $._word = pickRandom(words).toUpperCase()
    $._remainingWords = words.filter(w => w !== $._word)
    $.word.value = encrypt($._word,$._key)
  },
  clue: $ => {
    const word = pickRandom($._remainingWords).toUpperCase()
    $.clues.append(`<h1>${word}:</h1><h1>${encrypt(word,$._key)}</h1>`)
    $.score.value --
  },
  updateGrid: ($,e) => {
    const char = $._word[Number(e.target.id.split("-")[1])]
    const letter = char === "J" ? "I" : char
    const cipher = $._key + [...alphabet].filter(x => !$._key.includes(x)).join``
    const index = cipher.indexOf(letter)
    const cell = $.table.querySelectorAll("input")[index]
    cell.value = e.target.value
  },
  updateSolution: ($,e) => {
    const array = encrypt($._word,$._key).split("  ")
    const letter = e.target.value.toUpperCase()
    const fruit = e.target.dataset.fruit
    const veg = e.target.dataset.veg
    array.forEach((x,i) => {
      if(x === fruit+veg){
        $.solution.childNodes[i].value = (letter === "J" && $._word[i] === "I") ? "I" : (letter === "I" && $._word[i] === "J") ? "J" : letter
      }
    })
  },
    check: $ => {
           const correctLetters = Array.from($.solution.childNodes).reduce((sum,node,i) => sum + (node.value.toUpperCase() === $._word[i] ? 1 : 0),0)
     $.correct.value = correctLetters
     if(correctLetters === 5){
         jsConfetti.addConfetti()
         $.game.hidden = true
         $.gameOver.hidden = false
         $.finalScore.value = $.score.value
     } else {
       $.score.value --
     }
     if($.score.value === 0){
       $.game.hidden = true
        $.gameOver.hidden = false
       $.message.value = "Hard luck, you didn't break the code"
     }
  },
  clear: $ =>  Array.from($.table.querySelectorAll("input")).forEach(cell => cell.value = ""),
  connect: $ => {
    [$._url,$._id] = window.location.href.split("#")
    console.log($._id)
  }
})
