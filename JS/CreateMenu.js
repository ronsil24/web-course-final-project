/* ===== CreateMenu.js ===== */

const form = document.getElementById('createMenuForm');
const nameInput  = document.getElementById('user_name');
const budgetInput = document.getElementById('budget');
const budgetDisplay = document.getElementById('budgetDisplay');
const nameError   = document.getElementById('nameError');
const budgetError = document.getElementById('budgetError');
const dietaryError = document.getElementById('dietaryError');
const successBanner = document.getElementById('successBanner');

/* --- 1. קליטת נתונים מהמשתמש + כתיבה לאלמנט (Budget live display) --- */
budgetInput.addEventListener('input', function () {
    const val = parseFloat(this.value) || 0;
    budgetDisplay.textContent = '₪' + val.toLocaleString('he-IL');
    budgetDisplay.className = 'budget-display' + (val > 5000 ? ' over' : '');
});

/* --- 2. אירוע: הסרת שגיאה כשמשתמש מתחיל להקליד --- */
nameInput.addEventListener('input', function () {
    if (nameError.textContent) validateName();
});

budgetInput.addEventListener('input', function () {
    if (budgetError.textContent) validateBudget();
});

/* ===== ולידציות JS ===== */

// ולידציה 1 (JS): שם – לפחות 2 תווים, אותיות בלבד
function validateName() {
    const val = nameInput.value.trim();
    if (val.length < 2) {
        setError(nameInput, nameError, 'השם חייב להכיל לפחות 2 תווים');
        return false;
    }
    if (/[0-9]/.test(val)) {
        setError(nameInput, nameError, 'השם יכול להכיל אותיות בלבד (ללא מספרים)');
        return false;
    }
    clearError(nameInput, nameError);
    return true;
}

// ולידציה 2 (JS): תקציב – מספר בין 50 ל-5000
function validateBudget() {
    const val = parseFloat(budgetInput.value);
    if (isNaN(val) || val < 50) {
        setError(budgetInput, budgetError, 'הזן תקציב מינימלי של ₪50');
        return false;
    }
    if (val > 5000) {
        setError(budgetInput, budgetError, 'התקציב המקסימלי הוא ₪5,000');
        return false;
    }
    clearError(budgetInput, budgetError);
    return true;
}

// ולידציה 3 (JS): העדפות תזונה – לפחות אחת נבחרה
function validateDietary() {
    const checked = document.querySelectorAll('input[name="dietary_pref"]:checked');
    if (checked.length === 0) {
        dietaryError.textContent = 'יש לבחור לפחות העדפה תזונתית אחת';
        return false;
    }
    dietaryError.textContent = '';
    return true;
}

/* ===== הגשת הטופס ===== */
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const v1 = validateName();
    const v2 = validateBudget();
    const v3 = validateDietary();

    // ולידציה 4 (HTML): prep_time ו-load_level הם required – הדפדפן מטפל בהם
    if (!v1 || !v2 || !v3) return;

    const formData = new FormData(form);

    // שמירה ל-DB דרך PHP
    fetch('save_menu.php', {
        method: 'POST',
        body: formData
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            // שמירת העדפות ב-localStorage להעברה לדף התפריט
            const prefs = {
                user_name:    formData.get('user_name'),
                budget:       formData.get('budget'),
                load_level:   formData.get('load_level'),
                prep_time:    formData.get('prep_time'),
                dietary_pref: formData.getAll('dietary_pref'),
                events:       formData.getAll('events'),
                id:           data.id
            };
            localStorage.setItem('menuPrefs', JSON.stringify(prefs));

            // הצגת הודעת הצלחה ומעבר לדף תפריט
            showSuccess(data.user_name, data.load_level);
        } else {
            alert('שגיאה: ' + data.error);
        }
    })
    .catch(() => {
        // fallback: שמירה מקומית בלבד אם השרת לא זמין
        const prefs = {
            user_name:    formData.get('user_name'),
            budget:       formData.get('budget'),
            load_level:   formData.get('load_level'),
            prep_time:    formData.get('prep_time'),
            dietary_pref: formData.getAll('dietary_pref'),
            events:       formData.getAll('events')
        };
        localStorage.setItem('menuPrefs', JSON.stringify(prefs));
        showSuccess(prefs.user_name, prefs.load_level);
    });
});

/* ===== פונקציות עזר ===== */
function setError(input, errorEl, msg) {
    input.classList.add('error');
    errorEl.textContent = msg;
}

function clearError(input, errorEl) {
    input.classList.remove('error');
    errorEl.textContent = '';
}

function showSuccess(name, level) {
    const levelNames = { easy: 'קל', normal: 'רגיל', intense: 'אינטנסיבי' };
    successBanner.innerHTML = `
        ✅ הפרטים נשמרו! היי ${name}, התפריט שלך ברמת עצימות <strong>${levelNames[level] || level}</strong> מוכן.
        <br><br>
        <a href="ViewMenu.html" class="btn btn-primary" style="margin-top:10px">צפייה בתפריט →</a>
    `;
    successBanner.style.display = 'block';
    form.style.opacity = '0.4';
    form.style.pointerEvents = 'none';
    successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* --- עיצוב דינמי: הדגשת שדות כשהם ממולאים --- */
[nameInput, budgetInput].forEach(input => {
    input.addEventListener('blur', function () {
        if (this.value.trim()) {
            this.style.borderColor = 'var(--primary)';
        }
    });
});
