/* Service data mirrors SERVICES.md. Recommendation functions below contain no DOM or animation code. */
const SERVICES = {
  essential: { name: "Essential Clean", price: "From £45", duration: "Approx. 2 hours", purpose: "A standard maintenance clean for a vehicle that is already fairly clean.", included: ["Exterior hand wash and snow foam/pre-wash", "Wheels, tyres, glass and door shuts cleaned", "Professional vacuum throughout the interior", "High-SiO₂ spray ceramic sealant as a regular protection step"], excluded: ["Deep interior cleaning", "Paint decontamination", "Machine polishing", "Pet hair removal"] },
  full: { name: "Full Valet", price: "From £85", duration: "Approx. 3–4 hours depending on vehicle size", purpose: "A complete interior deep clean combined with a more thorough exterior clean.", included: ["Complete interior deep clean with professional vacuuming", "Seats, carpets and mats shampooed and professionally extracted", "Thorough exterior wash, wheels and accessible wheel barrels cleaned", "High-SiO₂ spray ceramic sealant as a regular protection step"], excluded: ["Paint decontamination", "Machine polishing", "Paint correction", "Pet hair removal"] },
  interior: { name: "Interior Deep Clean", price: "From £80", duration: "Approx. 2–3 hours", purpose: "An interior-only deep cleaning service.", included: ["Professional vacuum throughout the interior", "Seats, carpets and mats shampooed and professionally extracted", "Plastics, seams, crevices, vents and cracks steamed", "Interior glass, dashboard, door cards and boot area cleaned"], excluded: ["Exterior cleaning", "Machine polishing", "Paint correction", "Pet hair removal"] },
  maintenance: { name: "Maintenance Plans", price: null, duration: null, purpose: "Ongoing professional maintenance after an initial Full Valet brings the vehicle to a clean baseline.", included: ["Initial Full Valet required before entering the plan", "Subsequent visits based around an Essential Clean", "Choice of designer fragrance, no fragrance, and optional carpet stripe patterns"], excluded: ["Pet hair removal"] },
  decontamination: { name: "Paint Decontamination", price: "From £60", duration: null, purpose: "A standalone service to remove bonded and embedded contamination from exterior paintwork.", included: ["Tar, road grease and grime, bird lime, mould and iron fallout removal", "Clay bar process to remove remaining bonded contamination"], excluded: [] },
  enhancement: { name: "Paint Enhancement", price: "£170", duration: "Approx. 3–4 hours", purpose: "Restores gloss, clarity and depth on tired, dull or lacklustre paintwork.", included: ["Paint decontamination included", "Machine polishing with fine pad and finishing polish", "Refinement of the clear coat and paintwork", "Up-to-3-month paint protection"], excluded: [] },
  correction: { name: "Paint Correction", price: "£200", duration: "Approximately 5 hours / most of a day", purpose: "Machine polishing and correction for swirl marks and suitable defects within the clear coat.", included: ["Paint decontamination included", "Machine polishing/correction", "Approximately 95% of safely correctable swirl marks and defects", "Up-to-3-month paint protection"], excluded: ["Deeper scratches beyond the clear coat", "Sanding and colour-matched paint repair"] },
  ceramic: { name: "Ceramic Coating", price: "From £250 depending on vehicle size", duration: "Approximately one full day", purpose: "Paint preparation, machine polishing and one 3-year ceramic coating service.", included: ["3-year ceramic coating", "Paint decontamination, fallout removal and preparation included", "Machine polishing included", "Wheel face coating and all exterior glass coating included"], excluded: ["Wheel barrels"] },
  headlights: { name: "Headlight Restoration", price: "£60", duration: "Approx. 1–2 hours", purpose: "Restores the clarity and appearance of faded, cloudy or weathered headlights.", included: ["Specialist cleaning", "Progressive wet sanding", "Two-stage machine polishing", "3-year ceramic coating protection"], excluded: [] },
  caravan: { name: "Caravan & Motorhome", price: null, duration: null, purpose: "We offer services for caravans and motorhomes. Tell us what you would like done and we will advise on the best option.", included: [], excluded: [] },
  ppf: { name: "PPF (Paint Protection Film)", price: null, duration: null, purpose: "PPF is available, but we will need details about your vehicle and what you want protected.", included: [], excluded: [] }
};

const QUESTIONS = {
  main: { title: "What are you looking to achieve?", answers: [
    ["cleaning", "Get it properly clean", "Give the interior and/or exterior a thorough clean."],
    ["paint", "Improve the paintwork", "Bring back gloss, clarity and improve the finish."],
    ["protection", "Protect the paintwork", "Add long-lasting protection and make future maintenance easier."],
    ["restoration", "Restore something that's looking tired", "Improve a specific area such as faded or cloudy headlights."],
    ["caravan", "Caravan or motorhome", "Tell us what your caravan or motorhome needs."],
    ["unsure", "I'm not sure", "Ask me a few simple questions and help me work it out."]
  ]},
  cleaning: { title: "What needs the most attention?", answers: [
    ["full", "The whole car", "A thorough clean of both the interior and exterior."],
    ["interior", "Mainly the interior", "The cabin needs the deepest clean."],
    ["essential", "It's already fairly clean", "Keep a well-maintained vehicle looking its best."],
    ["maintenance", "I want regular upkeep", "Ongoing professional maintenance rather than a one-off clean."]
  ]},
  paint: { title: "What's bothering you most about the paint?", answers: [
    ["enhancement", "It's dull or lacks gloss", "Restore gloss, clarity and depth."],
    ["correction", "I'm seeing swirls and paint defects", "Reduce suitable swirl marks and visible defects."],
    ["ceramic", "I want the paint improved and protected", "Combine preparation and machine polishing with long-term protection."],
    ["decontamination", "The paint feels rough / contaminated", "Remove bonded and embedded contamination."],
    ["paint-unsure", "I'm not sure", "Help me choose between finish, correction and protection."]
  ]},
  "paint-unsure": { title: "What matters most to you?", answers: [
    ["enhancement", "More gloss and a better finish", "Restore gloss, clarity and depth."],
    ["correction", "Reduce swirls and visible defects", "Correct suitable defects within the clear coat."],
    ["ceramic", "Long-term protection", "Protect the paint for 3 years."]
  ]},
  protection: { title: "What type of protection are you looking for?", answers: [
    ["ceramic", "Long-term protection for my paint", "A single 3-year ceramic coating service."],
    ["protection-cleaning", "Protection as part of regular cleaning", "A regular protection step within a cleaning service."],
    ["ppf", "I'm interested in PPF", "Ask about Paint Protection Film for your vehicle."],
    ["protection-unsure", "I'm not sure", "Help me decide whether the paint should be improved first."]
  ]},
  "protection-cleaning": { title: "What sort of cleaning does your vehicle need?", answers: [
    ["full", "The whole car", "A thorough clean of the interior and exterior."],
    ["interior", "Mainly the interior", "A deep clean focused on the cabin."],
    ["essential", "It's already fairly clean", "Regular cleaning and upkeep."],
    ["maintenance", "I want regular upkeep", "Ongoing professional maintenance."]
  ]},
  "protection-unsure": { title: "Do you want the paint improved before it's protected?", answers: [
    ["ceramic", "Yes", "Improve the paint and add long-term protection."],
    ["essential", "No / mainly regular cleaning", "Keep the vehicle maintained with a regular clean."]
  ]},
  restoration: { title: "What would you like to restore?", answers: [
    ["headlights", "Headlights", "Restore faded or cloudy headlights."],
    ["paint", "Paintwork", "Continue to the paintwork questions."],
    ["quote-restoration", "Something else", "Let's take a closer look before recommending a service."]
  ]},
  unsure: { title: "What's the main thing you're unhappy with?", answers: [
    ["cleaning", "It's just generally dirty", "Find the right cleaning service."],
    ["interior", "The interior is particularly dirty", "Deep clean the interior."],
    ["enhancement", "The paint looks dull", "Restore gloss and finish."],
    ["correction", "The paint has swirls or defects", "Reduce suitable defects."],
    ["ceramic", "I want long-term protection", "Protect the paint for 3 years."],
    ["headlights", "The headlights are cloudy or faded", "Restore headlight clarity."],
    ["maintenance", "I want regular professional upkeep", "Keep the vehicle maintained."],
    ["quote-unsure", "Something else", "Get help with a requirement not covered here."]
  ]}
};

const state = { screen: "intro", currentQuestion: "main", answers: {}, history: [], recommendation: null };
const app = document.querySelector("#app");
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));

function recommendationFor(key, answers) {
  const service = SERVICES[key];
  if (service) return { key, service, alternatives: alternativesFor(key, answers) };
  if (key === "quote-restoration") return enquiry("Let's take a closer look", "We don't want to point you towards the wrong service. Tell us what you'd like restored and we'll help you work out the best option.");
  if (key === "quote-unsure") return enquiry("Let's take a closer look", "Tell us a little more about what your vehicle needs and we'll help you work out the best option.");
  return enquiry("Let's find the right option", "Tell us a little more about your vehicle and what you would like done and we'll advise you on the best option.");
}
function enquiry(title, purpose) { return { key: "enquiry", service: { name: title, price: null, duration: null, purpose, included: [], excluded: [] }, alternatives: [] }; }
function alternativesFor(key) {
  const map = {
    enhancement: ["correction", "ceramic"], correction: ["enhancement", "ceramic"], ceramic: ["correction"],
    full: ["interior"], interior: ["full"], essential: ["full"], decontamination: ["enhancement"],
    headlights: [], maintenance: ["full"]
  };
  return (map[key] || []).map(item => SERVICES[item]);
}
function nextFor(answer) {
  const direct = ["full", "interior", "essential", "maintenance", "enhancement", "correction", "ceramic", "decontamination", "headlights", "caravan", "ppf", "quote-restoration", "quote-unsure"];
  return direct.includes(answer) ? null : answer;
}
function selectAnswer(value) {
  const question = state.currentQuestion;
  state.answers[question] = value;
  const questionIndex = state.history.indexOf(question);
  state.history = state.history.slice(0, questionIndex === -1 ? state.history.length : questionIndex + 1);
  const next = nextFor(value);
  if (next) { state.history.push(next); state.currentQuestion = next; renderQuestion(); return; }
  state.recommendation = recommendationFor(value, state.answers);
  state.screen = "result";
  renderResult();
}
function goBack() {
  if (!state.history.length) return;
  delete state.answers[state.currentQuestion];
  state.history.pop();
  state.currentQuestion = state.history[state.history.length - 1] || "main";
  state.screen = "question";
  renderQuestion();
}
function startFinder() { state.screen = "question"; state.currentQuestion = "main"; state.history = ["main"]; renderQuestion(); }
function reset() { state.screen = "intro"; state.currentQuestion = "main"; state.answers = {}; state.history = []; state.recommendation = null; renderIntro(); }
function transition(render) { app.classList.remove("view-enter"); void app.offsetWidth; render(); app.classList.add("view-enter"); }
function renderIntro() {
  transition(() => { app.innerHTML = `<div class="eyebrow">Service finder · Prototype V1</div><h1>Let's find the right service for your car</h1><p class="lede">Answer a few quick questions and we'll point you towards the service that's right for your vehicle.</p><div class="actions"><button class="button" data-action="start">Help me choose</button><button class="button secondary" data-action="browse">Browse all services</button></div><p class="intro-note">A focused way to compare the services that match what you want to achieve. No sign-up and no jargon required.</p>`; });
}
function progress() { return `${state.history.length} of ${Math.max(state.history.length, 3)}`; }
function summary() {
  const labels = [];
  Object.entries(state.answers).forEach(([question, answer]) => { const item = QUESTIONS[question]?.answers.find(entry => entry[0] === answer); if (item) labels.push(item[1]); });
  return labels.length ? `<aside class="summary"><strong>Your requirements</strong>${labels.map(escapeHtml).join(" · ")}</aside>` : "";
}
function renderQuestion() {
  const question = QUESTIONS[state.currentQuestion];
  const cards = question.answers.map(([value, title, description]) => `<button class="answer-card" type="button" data-answer="${value}"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(description)}</span></button>`).join("");
  transition(() => { app.innerHTML = `<div class="question-top"><div><div class="eyebrow">Your service finder</div><div class="progress-line"><span style="width:${Math.min(100, state.history.length / 3 * 100)}%"></span></div></div><span class="progress">${progress()}</span></div><div class="question-copy"><h2>${escapeHtml(question.title)}</h2></div><div class="answer-grid">${cards}</div><div class="question-footer"><button class="back-button" type="button" data-action="back"${state.history.length <= 1 ? " disabled" : ""}>← Back</button></div>${summary()}`; });
}
function renderResult() {
  const result = state.recommendation;
  const service = result.service;
  const enquiryResult = !service.price;
  const meta = service.price ? `<div class="result-meta">${escapeHtml(service.price)}${service.duration ? ` · ${escapeHtml(service.duration)}` : ""}</div>` : "";
  const facts = service.included.length ? `<div class="result-section"><h3>What's included</h3><ul class="facts">${service.included.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>` : "";
  const alternatives = result.alternatives.length ? `<div class="result-section"><h3>You might also consider</h3><div class="alternatives">${result.alternatives.slice(0, 2).map(item => `<div class="alternative"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.price || "Enquiry required")}</span></div>`).join("")}</div>` : "";
  const reason = enquiryResult ? service.purpose : `Based on what you've told us, ${service.name} is the best fit. ${service.purpose}`;
  transition(() => { app.innerHTML = `<div class="eyebrow">Your best match</div><article class="result-card"><h1>${escapeHtml(service.name)}</h1>${meta}<p class="result-reason">${escapeHtml(reason)}</p>${!enquiryResult ? `<div class="result-section"><h3>Why we recommend it</h3><p class="lede">${escapeHtml(service.purpose)}</p></div>` : ""}${facts}${alternatives}<div class="actions result-actions"><button class="button" data-action="quote">Get a quote</button>${!enquiryResult ? `<button class="button secondary" data-action="service">View full service</button>` : ""}<button class="link-button" data-action="change">Change my answers</button></div></article>`; });
}
function handleClick(event) {
  const answer = event.target.closest("[data-answer]"); if (answer) { selectAnswer(answer.dataset.answer); return; }
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "start") startFinder();
  if (action === "start-again") reset();
  if (action === "back") goBack();
  if (action === "change") { state.screen = "question"; renderQuestion(); }
  if (action === "browse" || action === "quote" || action === "service") window.alert(action === "browse" ? "Prototype placeholder: this would return to the normal service browsing experience." : "Prototype placeholder: this would connect to the existing quote or service page.");
}
document.addEventListener("click", handleClick);
renderIntro();
