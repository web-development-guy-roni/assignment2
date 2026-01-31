// Guy-Rozenbaum-214424814-Roni-Taktuk-213207640
import dotenv from "dotenv";

/**
 * טעינת קובץ הגדרות הסביבה המיועד לבדיקות.
 * קובץ זה מכיל בדרך כלל כתובת לבסיס נתונים נפרד (למשל סיומת _test)
 * כדי למנוע מחיקת נתונים בזמן הרצת ה-BeforeAll.
 */
dotenv.config({ path: ".env.test" });