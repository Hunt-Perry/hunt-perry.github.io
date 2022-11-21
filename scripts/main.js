// Run on every page
document.addEventListener("DOMContentLoaded", function () {
    loadNavBar();
});

// Navigation Bar
function loadNavBar() {
    document.getElementById('navigationBar').innerHTML = `
    <ul class="nav-bar">
        <li><a href="./index.html">Home</a></li>
        <li class="dropdown"><a href="#professional">Professional <i class="arrow dropdown-arrow"></i></a>
            <div class="dropdown-content">
                <a href="#1">SE @ LivePerson (1 year - Ongoing) (WIP)</a>
                <a href="#2">BA @ Advice RegTech (1 year) (WIP)</a>
                <a href="#3">More + (WIP)</a>
            </div>
        </li>
        <li class="dropdown"><a href="#personal">Personal <i class="arrow dropdown-arrow"></i></a>
            <div class="dropdown-content">
                <a href="#1">Australian Army (WIP)</a>
                <a href="#2">Surf Life Saving (WIP)</a>
                <a href="#3">More + (WIP)</a>
            </div>
        </li>
        <li class="dropdown"><a href="#personal">Projects <i class="arrow dropdown-arrow"></i></a>
            <div class="dropdown-content">
                <a href="./cookbook.html">Cookbook</a>
                <a href="#3">More + (WIP)</a>
            </div>
        </li>
        <li><a href="#contact">Contact</a></li>
    </ul>
    `;
}

