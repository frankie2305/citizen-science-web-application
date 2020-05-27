export { setTitle };

// setTitle - sets the title of the current page according to value
//  value is undefined => 'Citizen Science'
//  value is defined => 'Citizen Science - <value>'
const setTitle = value => {
    const title = document.querySelector('title');
    if (value)
        title.innerText = `Citizen Science - ${value}`;
    else
        title.innerText = 'Citizen Science';
}
