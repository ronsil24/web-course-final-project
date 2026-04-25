/* ===== ViewMenu.js ===== */

/* ===== מאגר הארוחות ===== */

// ארוחות חלופיות מהירות (עד 10 דקות) להחלפה כשמשתמש בוחר "מהיר"
const QUICK_ALTS = {
    lunch:  { name: 'סנדוויץ\' טונה ואבוקדו', desc: 'לחם מלא עם טונה, אבוקדו ועגבנייה', time: '5 דק\'', mins: 5, cal: 380, ingredients: ['לחם מלא 2 פרוסות','טונה 1 קופסה','אבוקדו 0.5','עגבנייה 1','לימון'], steps: ['פתח ערבב טונה עם לימון','פרוס אבוקדו על הלחם','הוסף טונה ועגבנייה','מוכן!'] },
    dinner: { name: 'חביתה מהירה עם סלט', desc: 'חביתה 2 ביצים עם סלט ירקות קל', time: '8 דק\'', mins: 8, cal: 320, ingredients: ['ביצים 2','מלפפון 1','עגבנייה 1','שמן זית','מלח'], steps: ['בחר ביצים במחבת עם שמן','תבל במלח','קצוץ ירקות לצד','הגש יחד'] }
};

// מפת מקסימום דקות לפי העדפה
const PREP_MAX = { quick: 15, medium: 30, long: 999 };

const MEALS = {
    easy: [
        {
            day: 'ראשון', calories: 1600,
            breakfast: { name: 'יוגורט עם פירות ואגוזים', desc: 'יוגורט טבעי עם תותים, אוכמניות, כפית דבש וצנוברים', time: '5 דק\'', mins: 5, cal: 320, ingredients: ['יוגורט טבעי 200g','תותים 100g','אוכמניות 50g','כפית דבש','צנוברים 20g'], steps: ['שים יוגורט בקערה','פרוס פירות מעל','פזר אגוזים','הוסף דבש – מוכן!'] },
            lunch:     { name: 'סלט קינואה וירקות', desc: 'קינואה מבושלת עם מלפפון, עגבנייה, גמבה ולימון', time: '20 דק\'', mins: 20, cal: 450, ingredients: ['קינואה 1 כוס','מלפפון 1','עגבנייה 2','גמבה 1','לימון','שמן זית','מלח'], steps: ['בשל קינואה 15 דקות','קצוץ ירקות','ערבב הכל','תבל בלימון ושמן זית'] },
            dinner:    { name: 'שקשוקה אישית', desc: '2 ביצים ברוטב עגבניות עם לחם מלא', time: '15 דק\'', mins: 15, cal: 380, ingredients: ['ביצים 2','עגבניות מרוסקות 400g','בצל 1','שום 2 שיניים','שמן זית','פפריקה','כמון','מלח'], steps: ['טגן בצל ושום 3 דקות','הוסף עגבניות ותבלינים','בשל 5 דקות','שבור ביצים לתוך הרוטב','כסה ובשל 5 דקות'] }
        },
        {
            day: 'שני', calories: 1650,
            breakfast: { name: 'שייק בננה ושיבולת שועל', desc: 'שייק מזין עם בננה, חלב שקדים ושיבולת שועל', time: '5 דק\'', mins: 5, cal: 340, ingredients: ['בננה 1','חלב שקדים 300ml','שיבולת שועל ללא גלוטן 3כפות','כפית חמאת בוטנים','קרח'], steps: ['שים הכל בבלנדר','בלנד 30 שניות','שפוך לכוס גדולה','שתה מיד'] },
            lunch:     { name: 'מרק עדשים', desc: 'מרק עדשים כתומות עם ירקות ותבלינים', time: '25 דק\'', mins: 25, cal: 380, ingredients: ['עדשים כתומות 1 כוס','גזר 2','סלרי 2 גבעולים','בצל 1','שום 3 שיניים','כמון','כורכום','מלח'], steps: ['טגן בצל שום 3 דקות','הוסף ירקות קצוצים','הוסף עדשים ומים (4 כוסות)','בשל 20 דקות','תבל וגיש'] },
            dinner:    { name: 'עוף בגריל עם ירקות', desc: 'חזה עוף בגריל עם קישוא ופלפל', time: '20 דק\'', mins: 20, cal: 500, ingredients: ['חזה עוף 200g','קישוא 1','פלפל אדום 1','שמן זית','לימון','שום','פטרוזיליה'], steps: ['מרנד עוף עם לימון שום 10 דקות','גריל/מחבת 4 דקות כל צד','גריל ירקות 8 דקות','הגש עם טחינה'] }
        },
        {
            day: 'שלישי', calories: 1580,
            breakfast: { name: 'טוסט אבוקדו על לחם מלא', desc: 'אבוקדו מעוך עם לימון על לחם קלוי', time: '5 דק\'', mins: 5, cal: 350, ingredients: ['לחם מלא 2 פרוסות','אבוקדו בשל 1','לימון','מלח שורשים','פלפל אדום','שמן זית'], steps: ['קלה לחם','עמעם אבוקדו עם לימון ומלח','פרוס על הלחם','פזר מלח שורשים ופלפל'] },
            lunch:     { name: 'קערת אורז עם טונה', desc: 'אורז מלא עם טונה, מלפפון ורוטב סויה', time: '25 דק\'', mins: 25, cal: 430, ingredients: ['אורז מלא 1 כוס','טונה בשימורים 1 קופסה','מלפפון 1','גזר 1','רוטב סויה 2 כפות','שמן שומשום'], steps: ['בשל אורז 20 דקות','קצוץ ירקות','ערבב טונה עם ירקות','ערם על אורז ותבל'] },
            dinner:    { name: 'פסטה גלוטן-פרי עם עגבניות', desc: 'פסטה מאורז עם רוטב עגבניות טרי', time: '20 דק\'', mins: 20, cal: 460, ingredients: ['פסטה גלוטן-פרי 200g','עגבניות טריות 3','שום 3 שיניים','בזיליקום','שמן זית','מלח','פרמז\'ן (אופציה)'], steps: ['בשל פסטה לפי הוראות','טגן שום בשמן זית','הוסף עגבניות','בשל 10 דקות','ערבב עם פסטה ובזיליקום'] }
        },
        {
            day: 'רביעי', calories: 1620,
            breakfast: { name: 'חביתה עם ירקות', desc: 'חביתה 3 ביצים עם עגבנייה ופלפל', time: '10 דק\'', mins: 10, cal: 310, ingredients: ['ביצים 3','עגבנייה 1','פלפל ירוק 0.5','בצל ירוק','שמן זית','מלח'], steps: ['קצוץ ירקות','הקצף ביצים עם מלח','חמם מחבת עם שמן','טגן ירקות 2 דקות','שפוך ביצים ובשל 3 דקות'] },
            lunch:     { name: 'סלט טונה', desc: 'טונה עם ירקות טריים ואבוקדו', time: '10 דק\'', mins: 10, cal: 420, ingredients: ['טונה 1 קופסה','אבוקדו 1','עגבנייה שרי 10','מלפפון 1','בצל סגול 0.5','לימון','שמן זית'], steps: ['פתח טונה וסנן','חתוך ירקות לקוביות','ערבב הכל','תבל בלימון ושמן זית'] },
            dinner:    { name: 'דג בתנור עם תפוחי אדמה', desc: 'פילה סלמון בתנור עם תפוח אדמה צלוי', time: '30 דק\'', mins: 30, cal: 530, ingredients: ['פילה סלמון 200g','תפוח אדמה 2','שמן זית','לימון','שום','פטרוזיליה','מלח','פלפל'], steps: ['חמם תנור 200°','חתוך תפו\"א לפרוסות','תבל הכל בשמן ותבלינים','הכנס לתנור 25 דקות','הגש עם לימון'] }
        },
        {
            day: 'חמישי', calories: 1590,
            breakfast: { name: 'פודינג צ\'יה', desc: 'זרעי צ\'יה בחלב שקדים עם פירות', time: '5 דק\'', mins: 5, cal: 290, ingredients: ['זרעי צ\'יה 3 כפות','חלב שקדים 250ml','כפית דבש','תות 50g','בננה 0.5'], steps: ['ערבב צ\'יה עם חלב ודבש','שים במקרר ללילה','בבוקר פרוס פירות מעל','מוכן!'] },
            lunch:     { name: 'מרק ירקות עם קינואה', desc: 'מרק עשיר עם קינואה, גזר, קישוא', time: '25 דק\'', mins: 25, cal: 350, ingredients: ['קינואה 0.5 כוס','גזר 2','קישוא 1','בצל 1','סלרי 2 גבעולים','שמן זית','מלח','תיבול מרק'], steps: ['טגן בצל ב-3 דקות','הוסף ירקות קצוצים','הוסף מים ותיבול','הוסף קינואה','בשל 20 דקות'] },
            dinner:    { name: 'טוסט גבינה עם סלט', desc: 'טוסט עם גבינה צהובה וסלט קל', time: '10 דק\'', mins: 10, cal: 480, ingredients: ['לחם מלא 2','גבינה צהובה 2 פרוסות','עגבנייה 1','חסה','עגבניות שרי 5','שמן זית'], steps: ['קלה לחם','הנח גבינה','חזר לטוסטר 1 דקה','הגש עם סלט טרי'] }
        },
        {
            day: 'שישי', calories: 1700,
            breakfast: { name: 'פנקייק ללא גלוטן', desc: 'פנקייק מקמח כוסמין עם דבש', time: '15 דק\'', mins: 15, cal: 420, ingredients: ['קמח כוסמין 1 כוס','ביצה 1','חלב 200ml','כפית אבקת אפייה','כפית דבש','שמן קוקוס'], steps: ['ערבב קמח ביצה וחלב','חמם מחבת עם שמן קוקוס','שפוך מצקת בצק','בשל 2 דקות כל צד','הגש עם דבש ופירות'] },
            lunch:     { name: 'עוף בתנור שישי', desc: 'חזה עוף בתנור עם ירקות שורש', time: '35 דק\'', mins: 35, cal: 550, ingredients: ['חזה עוף 250g','גזר 2','בטטה 1','פלפל אדום','שמן זית','פפריקה','שום','מלח'], steps: ['חמם תנור 200°','חתוך ירקות לקוביות גדולות','תבל עוף וירקות','הכנס לתנור 30 דקות','הגש חם'] },
            dinner:    { name: 'סלט ים-תיכוני', desc: 'סלט פסטה גלוטן-פרי עם זיתים ועגבניות', time: '20 דק\'', mins: 20, cal: 430, ingredients: ['פסטה קצרה גלוטן-פרי 200g','עגבניות שרי 15','זיתים 50g','גבינה בולגרית 80g','בצל סגול','בזיליקום','שמן זית','לימון'], steps: ['בשל ולקרר פסטה','ערבב עם ירקות','הוסף גבינה וזיתים','תבל בשמן ולימון'] }
        },
        {
            day: 'שבת', calories: 1550,
            breakfast: { name: 'ברונץ\' שבת', desc: 'ביצים מקושקשות עם לחם ומגוון ממרחים', time: '15 דק\'', mins: 15, cal: 480, ingredients: ['ביצים 3','חמאה 1 כפית','שמנת 2 כפות','לחם מלא 2 פרוסות','אבוקדו','גבינה לבנה'], steps: ['הקצף ביצים עם שמנת','חמם מחבת עם חמאה','בשל ביצים על להבה נמוכה תוך ערבוב','הגש עם לחם ממרחים'] },
            lunch:     { name: 'מרק עוף שבתי', desc: 'מרק עוף קלאסי עם ירקות ואטריות גלוטן-פרי', time: '60 דק\'', mins: 60, cal: 380, ingredients: ['עוף 400g','גזר 3','סלרי 3 גבעולים','בצל 1','שום 3 שיניים','אטריות גלוטן-פרי','מלח','פלפל'], steps: ['שים עוף וירקות בסיר','כסה במים','בשל על להבה נמוכה 45 דקות','הוסף אטריות בסוף','הגש חם'] },
            dinner:    { name: 'נחת שבת – פירות ואגוזים', desc: 'קערת פירות עונתיים עם אגוזים מיקס', time: '5 דק\'', mins: 5, cal: 280, ingredients: ['תפוח 1','אגס 1','ענבים 100g','אגוזי מלך 30g','שקדים 20g','כפית דבש'], steps: ['חתוך פירות','ערם בקערה יפה','פזר אגוזים','טפטף דבש'] }
        }
    ]
};

// רמות העצימות – כל ארוחה מקבלת קלוריות ומנות גדולות יותר לפי עצימות
function scaleDay(day, calBonus, portionLabel) {
    return {
        ...day,
        calories: day.calories + calBonus,
        breakfast: { ...day.breakfast, cal: day.breakfast.cal + Math.round(calBonus * 0.25), desc: day.breakfast.desc + portionLabel },
        lunch:     { ...day.lunch,     cal: day.lunch.cal     + Math.round(calBonus * 0.40), desc: day.lunch.desc     + portionLabel },
        dinner:    { ...day.dinner,    cal: day.dinner.cal    + Math.round(calBonus * 0.35), desc: day.dinner.desc    + portionLabel }
    };
}

MEALS.normal  = MEALS.easy.map(d => scaleDay(d, 250,  ' (מנה רגילה)'));
MEALS.intense = MEALS.easy.map(d => scaleDay(d, 600,  ' (מנה גדולה – עצימות גבוהה)'));

/* ===== מצב הדף ===== */
let currentLoad    = 'normal';
let currentDayIdx  = 0;
let currentPrepMax = 999; // דקות מקסימום להכנה

/* ===== אתחול ===== */
function init() {
    const prefs = JSON.parse(localStorage.getItem('menuPrefs') || '{}');
    if (prefs.load_level) currentLoad = prefs.load_level;

    // קרא העדפת זמן הכנה
    if (prefs.prep_time) currentPrepMax = PREP_MAX[prefs.prep_time] ?? 999;

    // הצג שם משתמש
    if (prefs.user_name) {
        const greeting = document.getElementById('userGreeting');
        if (greeting) greeting.textContent = `שלום ${prefs.user_name}! (העדפת הכנה: עד ${currentPrepMax === 999 ? 'ללא הגבלה' : currentPrepMax + ' דק\''})`;
    }

    renderLoadButtons();
    renderDaysTabs();
    renderMeals();
}

/* ===== כפתורי עצימות (עיצוב דינמי) ===== */
function renderLoadButtons() {
    document.querySelectorAll('.load-btn').forEach(btn => {
        const level = btn.dataset.level;
        btn.className = 'load-btn' + (level === currentLoad ? ` active-${level}` : '');
    });

    // עדכון המחלקה של לוח הארוחות
    const panel = document.getElementById('mealsPanel');
    if (panel) panel.className = `meals-panel load-${currentLoad}`;
}

document.querySelectorAll('.load-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        currentLoad = this.dataset.level;
        renderLoadButtons();
        renderMeals();
    });
});

/* ===== טאבים של ימים ===== */
function renderDaysTabs() {
    const tabs = document.getElementById('daysTabs');
    if (!tabs) return;
    tabs.innerHTML = '';

    MEALS.easy.forEach((d, i) => {
        const btn = document.createElement('button');
        btn.className = 'day-tab' + (i === currentDayIdx ? ' active' : '');
        btn.textContent = d.day;
        btn.addEventListener('click', () => selectDay(i));
        tabs.appendChild(btn);
    });
}

/* --- 1. אירוע: לחיצה על יום --- */
function selectDay(idx) {
    currentDayIdx = idx;

    // עדכון טאבים (עיצוב דינמי עם מחלקות)
    document.querySelectorAll('.day-tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === idx);
    });

    renderMeals();
}

/* ===== הצגת ארוחות ===== */
function renderMeals() {
    const data = MEALS[currentLoad][currentDayIdx];
    const panel = document.getElementById('mealsPanel');
    if (!panel) return;

    // כתיבה לאלמנט: כותרת יום ועצימות
    const badge     = document.getElementById('loadBadge');
    const calValue  = document.getElementById('calValue');
    const calBarFill = document.getElementById('calBarFill');

    if (badge) {
        const labels = { easy: 'יום קל', normal: 'יום רגיל', intense: 'יום אינטנסיבי' };
        badge.textContent = labels[currentLoad];
        badge.className = `load-badge ${currentLoad}`;
    }

    // כתיבה לאלמנט: קלוריות יומיות
    if (calValue) calValue.textContent = `${data.calories} קק"ל`;
    if (calBarFill) {
        const pct = Math.min((data.calories / 2500) * 100, 100);
        calBarFill.style.width = pct + '%';
        calBarFill.style.background = currentLoad === 'intense' ? '#e74c3c'
                                    : currentLoad === 'normal'  ? '#f39c12'
                                    : '#2ecc71';
    }

    // בניית כרטיסי הארוחות – החלף ארוחה שחורגת מזמן ההכנה המועדף
    const grid = document.getElementById('mealsGrid');
    if (!grid) return;

    const meals = [
        { type: 'ארוחת בוקר',   emoji: '🌅', data: data.breakfast, slot: 'breakfast' },
        { type: 'ארוחת צהריים', emoji: '☀️', data: data.lunch,     slot: 'lunch' },
        { type: 'ארוחת ערב',    emoji: '🌙', data: data.dinner,    slot: 'dinner' }
    ];

    // החלף ארוחות שחורגות מהגבלת הזמן
    const resolvedMeals = meals.map(m => {
        if (m.data.mins > currentPrepMax && QUICK_ALTS[m.slot]) {
            return { ...m, data: QUICK_ALTS[m.slot], swapped: true };
        }
        return { ...m, swapped: false };
    });

    grid.innerHTML = resolvedMeals.map((m, i) => {
        const mealId = `${currentDayIdx}-${i}`; // מזהה ייחודי למנה
        return `
        <article class="meal-card" onclick="goToRecipe(${currentDayIdx},${i},${m.swapped})">
            <button class="fav-btn" data-id="${mealId}" onclick="toggleFavorite(event, this)">
                ♡
            </button>
            
            <span class="meal-type">${m.emoji} ${m.type}</span>
            ${m.swapped ? '<span style="font-size:0.75rem;color:var(--primary);font-weight:bold">⚡ הותאם לזמן הכנה שלך</span>' : ''}
            <h3>${m.data.name}</h3>
            <p>${m.data.desc}</p>
            <div class="meal-meta">
                <span>⏱ ${m.data.time}</span>
                <span>🔥 ${m.data.cal} קק"ל</span>
            </div>
            <span class="click-hint">לחץ לצפייה במתכון המלא ←</span>
        </article>
    `}).join('');
    
    // צביעת לבבות קיימים לאחר הרינדור
    updateHeartIcons();
}

/* ===== לוגיקת המועדפים המתוקנת - שומרת הכול ===== */
window.toggleFavorite = function(event, btn) {
    event.stopPropagation(); 
    
    const id = btn.getAttribute("data-id"); // מביא למשל "0-1"
    let favs = JSON.parse(localStorage.getItem("user_favorites")) || [];

    // 1. גישה למאגר המלא שכתבת ידנית ב-MEALS
    const data = MEALS[currentLoad][currentDayIdx];
    const slots = ['breakfast', 'lunch', 'dinner'];
    const mealIdx = parseInt(id.split('-')[1]); 
    
    // כאן אנחנו שולפים את האובייקט המלא (עם הצעדים והמרכיבים)
    const fullMealData = data[slots[mealIdx]];

    const index = favs.findIndex(item => item.id === id);
    
    if (index === -1) {
        // 2. שמירת "חבילה" מלאה: כל הנתונים + ה-ID שיצרנו
        favs.push({ 
            ...fullMealData, // השלוש נקודות האלו מעתיקות את כל מה שכתבת ב-MEALS
            id: id,
            day: data.day 
        });
        btn.classList.add("active");
        btn.innerHTML = "❤️";
    } else {
        favs.splice(index, 1);
        btn.classList.remove("active");
        btn.innerHTML = "♡";
    }

    // 3. שמירה סופית
    localStorage.setItem("user_favorites", JSON.stringify(favs));
};

// פונקציה לעדכון הלבבות (צבע אדום למנות שמורות)
function updateHeartIcons() {
    const favs = JSON.parse(localStorage.getItem("user_favorites")) || [];
    document.querySelectorAll(".fav-btn").forEach(btn => {
        const id = btn.getAttribute("data-id");
        if (favs.some(f => f.id === id)) {
            btn.classList.add("active");
            btn.innerHTML = "❤️";
        }
    });
}

/* ===== העברת נתונים בין מסכים (localStorage) ===== */
function goToRecipe(dayIdx, mealIdx, swapped) {
    const data   = MEALS[currentLoad][dayIdx];
    const slots  = ['breakfast', 'lunch', 'dinner'];
    const types  = ['ארוחת בוקר', 'ארוחת צהריים', 'ארוחת ערב'];
    const orig   = [data.breakfast, data.lunch, data.dinner][mealIdx];
    const meal   = (swapped && QUICK_ALTS[slots[mealIdx]]) ? QUICK_ALTS[slots[mealIdx]] : orig;

    localStorage.setItem('currentRecipe', JSON.stringify({
        ...meal,
        mealType: types[mealIdx],
        day:      data.day
    }));

    window.location.href = 'Recipe.html';
}

/* ===== הפעלה ===== */
init();