export { styleActiveTab };

// styles the current active tab in the navigation bar
//  tabHash - the hash of the tab to be styled
const styleActiveTab = tabHash => {
    const tabs = document.querySelectorAll('nav li a');
    tabs.forEach(tab => {
        if (tab.hash === tabHash)
            tab.classList.add('active');
        else
            tab.classList.remove('active');
    });
}
