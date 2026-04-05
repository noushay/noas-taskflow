async function getTasks() { //תיעוד פונקצייה א סינכרונית
  try {// הרץ את הקוד תחת הבלוק הזה. במידה ויש שגיאה העבר אותו לקאצ של שגיאה
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");//הפאצ, פונקצייה מובנית שתפקידה להעביר בקשה לשרת עם הניתוב של השרת+מה אנחנו מבקשים ממנו לעשות. במקרה זה זו תהייה בקשת גט. 

    // הופך את התשובה ל-JSON
    const data = await response.json();// לוקחת את התשובה מהשרת

    // מדפיס את הנתונים
    console.log(data);
  } catch (error) {// אם משהו השתבש בניסיון אז תעבור לבלוק הזה מבלי להקריס את התוכנית. 
    console.log("An error occurred:", error);
  }
}

// מפעיל את הפונקציה
getTasks();
