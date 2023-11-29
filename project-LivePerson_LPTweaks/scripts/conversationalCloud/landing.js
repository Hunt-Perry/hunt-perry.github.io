console.log('landing: LP Essentials is starting up...');

// When the document is ready...
document.addEventListener("DOMContentLoaded", function() {
    try {
        //var navBar = findElementsByClassName("nav-list")[0];
    }
    catch (err) {
        console.log(`Error Occurred with creation functions: ${JSON.stringify(err)}`);
    }
});

function findElementsByClassName(className) {
    return document.getElementsByClassName(className);
}

function baseLpaTimer(element) {
    var baseLpaTimer = '<li data-v-10703107=""><div data-v-10703107="" role="" tabindex="-1" aria-labelledby="navbar" data-lp-at="navbar" class="nav-list__item"><div data-v-10703107="" class="nav-list__icon-wrapper"><div data-v-10703107=""><svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#5E2747"><path d="M12.1668 11.1112C12.1668 11.6951 11.6939 12.1668 11.1122 12.1668C10.5282 12.1668 10.0557 11.6947 10.0557 11.1112C10.0557 10.5277 10.5282 10.0557 11.1122 10.0557C11.6939 10.0557 12.1668 10.5273 12.1668 11.1112Z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.94461 11.1112C5.94461 11.6951 5.47169 12.1668 4.89001 12.1668C4.30602 12.1668 3.8335 11.6947 3.8335 11.1112C3.8335 10.5277 4.30602 10.0557 4.89001 10.0557C5.47169 10.0557 5.94461 10.5273 5.94461 11.1112Z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.05545 2.55556C9.05545 3.13946 8.58253 3.61111 8.00085 3.61111C7.41686 3.61111 6.94434 3.13906 6.94434 2.55556C6.94434 1.97206 7.41686 1.5 8.00085 1.5C8.58253 1.5 9.05545 1.97166 9.05545 2.55556Z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.0698 14.4999H4.92849C3.03087 14.4999 1.5 12.9777 1.5 11.1102C1.5 9.24454 3.03073 7.72217 4.92849 7.72217H11.0698C12.9694 7.72217 14.5 9.24468 14.5 11.1102C14.5 12.9776 12.9693 14.4999 11.0698 14.4999Z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 7.2222V4.11108" stroke-linecap="round" stroke-linejoin="round"></path></svg></div></div><div data-v-10703107="" data-lp-at="list-title-4" id="navbar.lptweaks.timer" class="nav-list__item__title">LPA Elevated: 60mins</div></div></li>';
    element.insertAdjacentHTML('beforeend', baseLpaTimer);
}

//baseLpaTimer(document.getElementsByClassName('nav-list')[0]);
// Green - #1CC966
// Yellow - #EAC349
// Red - #5E2747
