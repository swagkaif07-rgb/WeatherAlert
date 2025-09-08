function updateGreeting() {
    const hour = new Date().getHours();
    const greeting = document.getElementById("greeting-text");
    if (hour < 12) greeting.innerText = "🌅 Good Morning!";
    else if (hour < 18) greeting.innerText = "🌞 Good Afternoon!";
    else greeting.innerText = "🌙 Good Evening!";
}
updateGreeting();


document.getElementById("current-date").innerText =
    new Date().toLocaleString("en-IN", { dateStyle: "full", timeStyle: "medium" });