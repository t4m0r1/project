/* ===== Тарифы ===== */
const TARIFF = {
  electricity: 5.50,   // ₽ за 1 кВт·ч
  coldWater:   45.00,  // ₽ за 1 м³
  hotWater:    190.00  // ₽ за 1 м³
};

/* ===== Переключение страниц ===== */
const subtitles = {
  home:     "Управление крупным жилым комплексом",
  services: "Что входит в ежемесячный платёж",
  calc:     "Введите показания счётчиков"
};

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', () => {
    const page = link.dataset.page;

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page).classList.add('active');

    document.getElementById('page-subtitle').textContent = subtitles[page];

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* ===== Расчёт платежа ===== */
function calculate() {
  const get = id => parseFloat(document.getElementById(id).value);

  const eStart = get('e-start');
  const eEnd   = get('e-end');
  const cStart = get('c-start');
  const cEnd   = get('c-end');
  const hStart = get('h-start');
  const hEnd   = get('h-end');

  const resultEl = document.getElementById('result');

  if ([eStart, eEnd, cStart, cEnd, hStart, hEnd].some(v => isNaN(v))) {
    resultEl.innerHTML = '<span style="color:#b00;">Пожалуйста, заполните все поля корректными числами.</span>';
    resultEl.classList.add('show');
    return;
  }

  const eUsed = eEnd - eStart;
  const cUsed = cEnd - cStart;
  const hUsed = hEnd - hStart;

  if (eUsed < 0 || cUsed < 0 || hUsed < 0) {
    resultEl.innerHTML = '<span style="color:#b00;">Конечные показания не могут быть меньше начальных.</span>';
    resultEl.classList.add('show');
    return;
  }

  const eSum = eUsed * TARIFF.electricity;
  const cSum = cUsed * TARIFF.coldWater;
  const hSum = hUsed * TARIFF.hotWater;
  const total = eSum + cSum + hSum;

  const fmt = n => n.toFixed(2).replace('.', ',') + ' ₽';

  resultEl.innerHTML = `
    <div>Электроэнергия: <strong>${eUsed.toFixed(1)} кВт·ч</strong> × ${TARIFF.electricity} ₽ = <strong>${fmt(eSum)}</strong></div>
    <div>Холодная вода: <strong>${cUsed.toFixed(1)} м³</strong> × ${TARIFF.coldWater} ₽ = <strong>${fmt(cSum)}</strong></div>
    <div>Горячая вода: <strong>${hUsed.toFixed(1)} м³</strong> × ${TARIFF.hotWater} ₽ = <strong>${fmt(hSum)}</strong></div>
    <hr>
    <div class="total">Итого к оплате: ${fmt(total)}</div>
  `;
  resultEl.classList.add('show');
}

/* ===== Привязка кнопки ===== */
document.getElementById('calcBtn').addEventListener('click', calculate);