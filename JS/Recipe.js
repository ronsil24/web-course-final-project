/* ===== Recipe.js ===== */

/* --- קריאת נתוני המתכון מ-localStorage (נתונים שהועברו מדף ViewMenu) --- */
const recipe = JSON.parse(localStorage.getItem('currentRecipe') || 'null');

const heroTitle     = document.getElementById('recipeTitle');
const heroSubtitle  = document.getElementById('recipeSubtitle');
const metaTime      = document.getElementById('metaTime');
const metaCal       = document.getElementById('metaCal');
const metaType      = document.getElementById('metaType');
const ingredientsList = document.getElementById('ingredientsList');
const stepsList     = document.getElementById('stepsList');
const calDisplay    = document.getElementById('calDisplay');
const recipeContent = document.getElementById('recipeContent');
const noRecipe      = document.getElementById('noRecipe');
const openCookingGuideBtn = document.getElementById('openCookingGuideBtn');

if (!recipe) {
    // אין מתכון – הצג הודעה
    if (recipeContent) recipeContent.style.display = 'none';
    if (noRecipe)      noRecipe.style.display = 'block';
} else {
    renderRecipe();
}

function renderRecipe() {
    // כתיבה לאלמנטים
    if (heroTitle)    heroTitle.textContent    = recipe.name;
    if (heroSubtitle) heroSubtitle.textContent = recipe.desc;
    if (metaTime)     metaTime.textContent     = recipe.time;
    if (metaCal)      metaCal.textContent      = recipe.cal + ' קק"ל';
    if (metaType)     metaType.textContent     = recipe.mealType + ' | ' + (recipe.day || '');

    // כתיבה לאלמנט: קלוריות עם ערך מחושב
    if (calDisplay) {
        calDisplay.textContent = recipe.cal;
        // עיצוב דינמי לפי קלוריות
        if      (recipe.cal < 350) calDisplay.classList.add('cal-low');
        else if (recipe.cal < 500) calDisplay.classList.add('cal-mid');
        else                       calDisplay.classList.add('cal-high');
    }

    // מרכיבים
    if (ingredientsList) {
        ingredientsList.innerHTML = recipe.ingredients
            .map(ing => `<li>${ing}</li>`)
            .join('');
    }

    // שלבי הכנה
    if (stepsList) {
        stepsList.innerHTML = recipe.steps
            .map((step, i) => `
                <li>
                    <span class="step-num">${i + 1}</span>
                    <span>${step}</span>
                </li>
            `)
            .join('');
    }

    // ערכים תזונתיים משוערים
    updateNutrition(recipe.cal);
}

/* --- כתיבה לאלמנט: ערכים תזונתיים --- */
function updateNutrition(cal) {
    const protein = Math.round(cal * 0.25 / 4);
    const carbs   = Math.round(cal * 0.45 / 4);
    const fat     = Math.round(cal * 0.30 / 9);

    const el = id => document.getElementById(id);
    if (el('nutCal'))     el('nutCal').textContent     = cal;
    if (el('nutProtein')) el('nutProtein').textContent = protein + 'g';
    if (el('nutCarbs'))   el('nutCarbs').textContent   = carbs + 'g';
    if (el('nutFat'))     el('nutFat').textContent     = fat + 'g';
}

/* ===== הוספה לסל קניות ===== */
const addToCartBtn = document.getElementById('addToCartBtn');
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function () {
        if (!recipe) return;

        // קרא רשימה קיימת
        const cart = JSON.parse(localStorage.getItem('smartCart') || '[]');

        // הוסף מרכיבים (ללא כפילויות)
        recipe.ingredients.forEach(ing => {
            if (!cart.some(item => item.name.toLowerCase() === ing.toLowerCase())) {
                cart.push({
                    name:     ing,
                    amount:   '',
                    category: guessCategory(ing),
                    from:     recipe.name
                });
            }
        });

        localStorage.setItem('smartCart', JSON.stringify(cart));

        // פידבק ויזואלי + מעבר לסל קניות
        const feedback = document.getElementById('cartFeedback');
        if (feedback) {
            feedback.textContent = `✅ ${recipe.ingredients.length} מרכיבים נוספו לסל הקניות – עובר לסל...`;
            feedback.style.display = 'block';
        }

        // שנה כפתור לאחר הוספה (עיצוב דינמי)
        this.textContent = '✓ נוסף לסל';
        this.classList.remove('btn-primary');
        this.classList.add('btn-outline');
        this.disabled = true;

        // מעבר אוטומטי לסל קניות אחרי שניה
        setTimeout(() => {
            window.location.href = 'SmartCart.html';
        }, 1000);
    });
}

/* ===== מעבר למדריך בישול ===== */
if (openCookingGuideBtn) {
    openCookingGuideBtn.addEventListener('click', function () {
        if (!recipe) return;
        localStorage.setItem('currentRecipe', JSON.stringify(recipe));
        localStorage.setItem('cookingGuideReturnHref', 'Recipe.html');
        localStorage.setItem('cookingGuideReturnLabel', 'חזרה למתכון');
        window.location.href = 'CookingGuide.html';
    });
}

/* ===== קביעת קטגוריה לפי שם מרכיב ===== */
function guessCategory(ing) {
    const lower = ing.toLowerCase();
    if (/ביצ|חלב|גבינ|יוגורט|חמאה|שמנת/.test(lower))    return 'מוצרי חלב וביצים';
    if (/עוף|דג|סלמון|טונה|בשר/.test(lower))              return 'בשר ודגים';
    if (/לחם|פסטה|קמח|אורז|קינואה|עדשים|שיבולת/.test(lower)) return 'פחמימות ודגנים';
    if (/עגבנ|מלפפון|קישוא|גזר|בצל|שום|פלפל|חסה|בטטה|סלרי/.test(lower)) return 'ירקות ופירות';
    if (/תפוח|בננה|תות|אוכמנ|ענבים|אגס|פרי/.test(lower)) return 'ירקות ופירות';
    if (/שמן|לימון|מלח|כמון|פפריקה|כורכום|דבש|רוטב/.test(lower)) return 'תבלינים ושמנים';
    if (/אגוז|שקד|צנובר|חמאת בוטנ/.test(lower))           return 'אגוזים וזרעים';
    return 'אחר';
}

/* ===== אירוע: אנימציה על רשימת המרכיבים ===== */
if (ingredientsList) {
    ingredientsList.querySelectorAll('li').forEach((li, i) => {
        li.style.opacity = '0';
        setTimeout(() => {
            li.style.transition = 'opacity 0.3s';
            li.style.opacity = '1';
        }, i * 80);
    });
}
