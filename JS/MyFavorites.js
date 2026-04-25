/* ===== JS/MyFavorites.js - הסופי לעיצוב ממורכז ===== */

$(document).ready(function() {
    // הפעלה ראשונית של טעינת המועדפים מהזיכרון
    loadFavorites();

    function loadFavorites() {
        // שליפת נתונים מה-localStorage ובדיקה אם המפתח קיים
        const favs = JSON.parse(localStorage.getItem("user_favorites")) || [];
        const grid = $("#favoritesGrid");
        const emptyMsg = $("#noFavsMessage");

        // טיפול במצב שבו אין מועדפים שמורים
        if (favs.length === 0) {
            grid.hide();
            emptyMsg.show();
            return;
        }

        // ניקוי הגריד והצגתו
        emptyMsg.hide();
        grid.show().empty();

        // יצירת הכרטיסיות לכל מנה שנשמרה
        favs.forEach(item => {
            // הפיכת אובייקט המנה למחרוזת בטוחה להעברה לפונקציית הבישול
            const recipeData = JSON.stringify(item).replace(/"/g, '&quot;');
            
            // מבנה כרטיסייה ממורכז עם לב בפינה וכפתור מעוגל
            const cardHtml = `
                <article class="meal-card fav-item">
                    <button class="remove-fav" onclick="removeFromFavs('${item.id}', this)" title="הסר מהמועדפים">
                        ❤️
                    </button>
                    
                    <div class="meal-card-body">
                        <span class="meal-time-tag">⏱ ${item.time || '5 דק\''}</span>
                        <h3 class="meal-title">${item.name}</h3>
                        <p class="meal-desc">${item.desc || 'המנה שמרת מחכה לך להכנה.'}</p>
                        
                        <button onclick="startCooking(${recipeData})" class="fav-cooking-link">
                            למדריך בישול ←
                        </button>
                    </div>
                </article>
            `;
            grid.append(cardHtml);
        });
    }

    // פונקציה גלובלית להסרת מנה מהרשימה
    window.removeFromFavs = function(id, btn) {
        let favs = JSON.parse(localStorage.getItem("user_favorites")) || [];
        favs = favs.filter(meal => meal.id !== id);
        localStorage.setItem("user_favorites", JSON.stringify(favs));
        
        // אנימציית יציאה חלקה ורענון התצוגה
        $(btn).closest("article").fadeOut(300, function() {
            loadFavorites(); 
        });
    };

    // פונקציה למעבר למסך מדריך הבישול האינטראקטיבי
    window.startCooking = function(recipe) {
        // שמירת המנה הנבחרת בזיכרון עבור דף המדריך
        localStorage.setItem('currentRecipe', JSON.stringify(recipe));
        localStorage.setItem('cookingGuideReturnHref', 'MyFavorites.html');
        localStorage.setItem('cookingGuideReturnLabel', 'חזרה למועדפים');
        window.location.href = "CookingGuide.html";
    };
});
