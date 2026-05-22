const billInput = document.querySelector("#bill");
const customTipInput = document.querySelector("#custom-tip");
const peopleInput = document.querySelector("#people");
const presetButtons = Array.from(document.querySelectorAll(".preset"));
const resetButton = document.querySelector("#reset");

const billError = document.querySelector("#bill-error");
const tipError = document.querySelector("#tip-error");
const peopleError = document.querySelector("#people-error");

const totalTipEl = document.querySelector("#total-tip");
const grandTotalEl = document.querySelector("#grand-total");
const perPersonEl = document.querySelector("#per-person");

const MAX_TIP_PERCENT = 50;

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const parseNumber = (raw) => {
  const normalized = raw.replace(/,/g, "").trim();
  if (normalized === "") {
    return null;
  }
  if (!/^-?\d*\.?\d+$/.test(normalized)) {
    return Number.NaN;
  }
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : Number.NaN;
};

const parseInteger = (raw) => {
  const normalized = raw.replace(/,/g, "").trim();
  if (normalized === "") {
    return null;
  }
  if (!/^-?\d+$/.test(normalized)) {
    return Number.NaN;
  }
  const value = Number.parseInt(normalized, 10);
  return Number.isFinite(value) ? value : Number.NaN;
};

const setActivePreset = (button) => {
  presetButtons.forEach((btn) => btn.classList.remove("active"));
  if (button) {
    button.classList.add("active");
  }
};

const clearOutputs = () => {
  totalTipEl.textContent = formatCurrency(0);
  grandTotalEl.textContent = formatCurrency(0);
  perPersonEl.textContent = formatCurrency(0);
};

const setError = (el, message) => {
  el.textContent = message;
};

const validateBill = (value) => {
  if (value === null) {
    setError(billError, "Enter a bill amount.");
    return false;
  }
  if (Number.isNaN(value)) {
    setError(billError, "Enter a valid number.");
    return false;
  }
  if (value <= 0) {
    setError(billError, "Bill must be greater than 0.");
    return false;
  }
  setError(billError, "");
  return true;
};

const validateTip = (value) => {
  if (value === null) {
    setError(tipError, "Pick a tip or enter a custom %.");
    return false;
  }
  if (Number.isNaN(value)) {
    setError(tipError, "Enter a valid tip %.");
    return false;
  }
  if (value < 0) {
    setError(tipError, "Tip cannot be negative.");
    return false;
  }
  if (value > MAX_TIP_PERCENT) {
    setError(tipError, `Tip must be ${MAX_TIP_PERCENT}% or less.`);
    return false;
  }
  setError(tipError, "");
  return true;
};

const validatePeople = (value) => {
  if (value === null) {
    setError(peopleError, "Enter the number of people.");
    return false;
  }
  if (Number.isNaN(value)) {
    setError(peopleError, "Use a whole number.");
    return false;
  }
  if (value < 1) {
    setError(peopleError, "Must be at least 1 person.");
    return false;
  }
  setError(peopleError, "");
  return true;
};

const getTipValue = () => {
  const activePreset = presetButtons.find((btn) =>
    btn.classList.contains("active")
  );
  if (activePreset) {
    return Number(activePreset.dataset.tip);
  }
  return parseNumber(customTipInput.value);
};

const calculate = () => {
  const bill = parseNumber(billInput.value);
  const tipPercent = getTipValue();
  const people = parseInteger(peopleInput.value);

  const billOk = validateBill(bill);
  const tipOk = validateTip(tipPercent);
  const peopleOk = validatePeople(people);

  if (!(billOk && tipOk && peopleOk)) {
    clearOutputs();
    return;
  }

  const tipAmount = (bill * tipPercent) / 100;
  const total = bill + tipAmount;
  const perPersonRaw = total / people;
  const perPersonRounded = Math.ceil(perPersonRaw * 100) / 100;
  const roundedTotal = perPersonRounded * people;
  const overage = roundedTotal - total;
  const adjustedTip = tipAmount + overage;

  totalTipEl.textContent = formatCurrency(adjustedTip);
  grandTotalEl.textContent = formatCurrency(bill + adjustedTip);
  perPersonEl.textContent = formatCurrency(perPersonRounded);
};

presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActivePreset(button);
    customTipInput.value = "";
    calculate();
  });
});

customTipInput.addEventListener("input", () => {
  if (customTipInput.value.trim() !== "") {
    setActivePreset(null);
  }
  calculate();
});

[billInput, peopleInput].forEach((input) => {
  input.addEventListener("input", () => {
    calculate();
  });
});

resetButton.addEventListener("click", () => {
  billInput.value = "";
  customTipInput.value = "";
  peopleInput.value = "";
  setActivePreset(null);
  setError(billError, "");
  setError(tipError, "");
  setError(peopleError, "");
  clearOutputs();
});

document.querySelector("#tip-form").addEventListener("submit", (event) => {
  event.preventDefault();
});

clearOutputs();
