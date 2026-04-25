/* ===== SmartCart.js ===== */
/* דורש jQuery (נטען ב-HTML) */

$(document).ready(function () {

    renderCart();

    /* ===== כפתורים ===== */
    $('#clearCartBtn').on('click', function () {
        if (confirm('האם לרוקן את הסל לגמרי?')) {
            localStorage.removeItem('smartCart');
            renderCart();
        }
    });

    $('#printBtn').on('click', () => window.print());

    /* ===== פילטור חפש ===== */
    $('#searchInput').on('input', function () {
        const q = $(this).val().toLowerCase();
        $('.cart-item').each(function () {
            const name = $(this).find('.item-name').text().toLowerCase();
            $(this).toggle(name.includes(q));
        });
        updateCounters();
    });

});

/* ===== בניית הסל ===== */
function renderCart() {
    const cart = JSON.parse(localStorage.getItem('smartCart') || '[]');
    const body  = $('#cartBody');
    const empty = $('#emptyCart');

    body.empty();

    if (cart.length === 0) {
        empty.show();
        updateSummary(0, 0);
        return;
    }

    empty.hide();

    // קיבוץ לפי קטגוריה
    const categories = {};
    cart.forEach(item => {
        const cat = item.category || 'אחר';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(item);
    });

    const catIcons = {
        'מוצרי חלב וביצים': '🥛',
        'בשר ודגים':         '🍗',
        'פחמימות ודגנים':    '🌾',
        'ירקות ופירות':      '🥦',
        'תבלינים ושמנים':    '🫙',
        'אגוזים וזרעים':     '🥜',
        'אחר':               '🛒'
    };

    Object.entries(categories).forEach(([cat, items]) => {
        const section = $(`
            <section class="cart-category">
                <h3 class="category-title">
                    <span class="cat-icon">${catIcons[cat] || '📦'}</span>
                    ${cat}
                    <span class="cat-count">${items.length}</span>
                </h3>
                <ul class="cart-items-list"></ul>
            </section>
        `);

        body.append(section);

        const list = section.find('.cart-items-list');

        items.forEach((item, idx) => {
            const li = $(`
                <li class="cart-item${item.checked ? ' checked' : ''}" data-name="${item.name}">
                    <input type="checkbox" ${item.checked ? 'checked' : ''} aria-label="${item.name}">
                    <span class="item-name">${item.name}</span>
                    ${item.amount ? `<span class="item-amount">${item.amount}</span>` : ''}
                </li>
            `);

            // jQuery: הנפשת כניסה עם עיכוב
            li.hide();
            list.append(li);
            li.delay(idx * 60).slideDown(200);

            // אירוע: לחיצה על פריט – עיצוב דינמי
            li.on('click', function () {
                const $cb = $(this).find('input[type="checkbox"]');
                const isChecked = !$cb.prop('checked');
                $cb.prop('checked', isChecked);
                $(this).toggleClass('checked', isChecked);

                // כתיבה ל-localStorage
                const cart = JSON.parse(localStorage.getItem('smartCart') || '[]');
                const found = cart.find(c => c.name === item.name);
                if (found) found.checked = isChecked;
                localStorage.setItem('smartCart', JSON.stringify(cart));

                updateCounters();
            });

            // מניעת double-toggle כשלוחצים על ה-checkbox עצמו
            li.find('input').on('click', e => e.stopPropagation());
        });
    });

    updateCounters();
}

/* ===== עדכון מונים (כתיבה לאלמנט) ===== */
function updateCounters() {
    const cart    = JSON.parse(localStorage.getItem('smartCart') || '[]');
    const total   = cart.length;
    const checked = cart.filter(i => i.checked).length;
    const left    = total - checked;

    // כתיבה לאלמנטים
    $('#totalItems').text(total);
    $('#checkedItems').text(checked);
    $('#remainingItems').text(left);

    // עיצוב דינמי: צבע כשהכל נאסף
    if (total > 0 && left === 0) {
        $('#remainingItems').css('color', 'var(--primary)');
    } else {
        $('#remainingItems').css('color', '');
    }
}

function updateSummary(total, checked) {
    $('#totalItems').text(total);
    $('#checkedItems').text(checked);
    $('#remainingItems').text(total - checked);
}
