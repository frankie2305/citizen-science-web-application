export {
    homeView,
    listObservationsView,
    listUsersView,
    observationView,
    userView,
    error404View,
    observationFormView,
    errorAlertView
};

// apply_template - applies a template to some data
//  and insert into the page
//  targetid - id of the element to insert content
//  templateid - id of the element containing the template
//  data - data to pass to the template
const apply_template = (targetid, templateid, data) => {
    let target = document.getElementById(targetid);

    let template = Handlebars.compile(
        document.getElementById(templateid).textContent
    );

    target.innerHTML = template(data);
}

// homeView - generates a view of a list of recent observations & users
//  and insert it at 'targetid' in the DOM

const homeView = (targetid, { observations, users }) => {
    apply_template(targetid, 'home-template', { observations, users });
}

// listObservationsView - generates a view of a list of observations
//   and insert it at `targetid` in the DOM
const listObservationsView = (targetid, observations) => {
    apply_template(targetid, 'observations-list-template', { observations });
}

// listUsersView - generates a view of a list of users
//   and insert it at `targetid` in the DOM
const listUsersView = (targetid, users) => {
    apply_template(targetid, 'users-list-template', { users });
}

// observationView - generates a view of an individual observation
//  & its participant and insert it at `targetid` in the DOM
const observationView = (targetid, { observation, user }) => {
    apply_template(targetid, 'observation-template', { observation, user });
}

// userView - generates a view of an individual user & his / her
//   observations and insert it at `targetid` in the DOM
const userView = (targetid, { user, observations, plural }) => {
    apply_template(targetid, 'user-template', { user, observations, plural });
}

// error404View - generates a view of the 404 error page
//  and insert it at `targetid` in the DOM
const error404View = (targetid, target) => {
    apply_template(targetid, '404-error-template', { target });
}

// observationFormView - generates a view of the observation form
//  and insert it at `targetid` in the DOM
const observationFormView = targetid => {
    apply_template(targetid, 'observation-form-template');
}

// errorAlertView - generates a view of an error alert
//  and insert it at `targetid` in the DOM
const errorAlertView = targetid => {
    apply_template(targetid, 'error-alert-template');
}
