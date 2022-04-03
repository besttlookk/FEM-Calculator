import "./sass/style.scss";

const STORAGE_KEY = "calc-fem-theme";
const toggleSections = document.querySelectorAll(".toggle__section");
const toggleSwitchEl = document.querySelector("#toggle-switch")! as HTMLElement;

toggleSections.forEach((section) => {
  section.addEventListener("click", (e) => {
    const el = e.target as HTMLInputElement;
    const themeNumber: string | null = el.getAttribute("data-section");

    if (typeof themeNumber === "string") {
      applySetting(themeNumber);
    }
  });
});

const getInitialTheme = () => {
  const preferedTheme = localStorage.getItem(STORAGE_KEY);

  if (typeof preferedTheme === "string") return preferedTheme;
  else return "1"; // default-theme
};

const applySetting = (themeNumber: string) => {
  toggleSwitchEl.classList.remove("left", "center", "right");

  const root = document.documentElement;
  root.setAttribute("data-theme", themeNumber);

  if (themeNumber === "1") toggleSwitchEl.classList.add("left");
  else if (themeNumber === "2") toggleSwitchEl.classList.add("center");
  else if (themeNumber === "3") toggleSwitchEl.classList.add("right");

  localStorage.setItem(STORAGE_KEY, themeNumber);
};

applySetting(getInitialTheme());

// ============Calculation

class Calculator {
  previousOperandEl: HTMLElement;
  currentOperandEl: HTMLElement;
  previousOperand: string = "";
  currentOperand: string = "";
  operation: string | undefined = "";

  constructor(previousOperandEl: HTMLElement, currentOperandEl: HTMLElement) {
    (this.previousOperandEl = previousOperandEl),
      (this.currentOperandEl = currentOperandEl);
    this.reset();
  }

  reset(this: Calculator) {
    this.previousOperand = "";
    this.currentOperand = "";
    this.operation = undefined;
  }

  delete(this: Calculator) {
    this.currentOperand = this.currentOperand.slice(0, -1);
  }

  appendNumber(this: Calculator, number: string) {
    if (number === "." && this.currentOperand.includes(".")) return;
    this.currentOperand = this.currentOperand + number;
  }

  chooseOperation(operation: string) {
    //! do nothing if there is no current operand
    if (this.currentOperand === "") return;
    // ! if there is previous operand do calculation
    if (this.previousOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  compute() {
    let computation: number | undefined;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        computation = prev / current;
        break;
      default:
        return;
    }
    this.currentOperand = computation.toString();
    computation = undefined;
    this.previousOperand = "";
    this.operation = undefined;
  }

  getDisplayNumber(number: string) {
    const integerDigits = parseFloat(number.split(".")[0]);
    const decimalDigits = number.split(".")[1];

    let intergerDisplay: string;
    if (isNaN(integerDigits)) {
      intergerDisplay = "";
    } else {
      intergerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }

    if (decimalDigits != null) {
      return `${intergerDisplay}.${decimalDigits}`;
    } else {
      return intergerDisplay;
    }
  }

  updateDisplay(this: Calculator) {
    this.currentOperandEl.innerText = this.getDisplayNumber(
      this.currentOperand
    );
    if (this.operation != null) {
      this.previousOperandEl.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandEl.innerText = "";
    }
  }
}
const numberButtons = document.querySelectorAll(
  "[data-number"
)! as NodeListOf<HTMLElement>;
const operationButtons = document.querySelectorAll(
  "[data-operation"
)! as NodeListOf<HTMLElement>;
const resetButton = document.querySelector("[data-reset")! as HTMLElement;
const deleteButton = document.querySelector("[data-del")! as HTMLElement;
const equalsButton = document.querySelector("[data-equals")! as HTMLElement;
const previousOperandEl = document.querySelector(
  "[data-previous-operand"
)! as HTMLElement;
const currentOperandEl = document.querySelector(
  "[data-current-operand"
)! as HTMLElement;

const calculator = new Calculator(previousOperandEl, currentOperandEl);

numberButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    calculator.appendNumber(btn.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.innerText === "x") calculator.chooseOperation("*");
    else calculator.chooseOperation(btn.innerText);

    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", () => {
  calculator.compute();
  calculator.updateDisplay();
});

resetButton.addEventListener("click", () => {
  calculator.reset();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", () => {
  calculator.delete();
  calculator.updateDisplay();
});
