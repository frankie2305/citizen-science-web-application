import { Model } from './model.js';
import * as views from './views.js';
import { setTitle } from './title.js';
import { split_hash } from './util.js';
import { styleActiveTab } from './tabs.js';
import { observationFormSubmit, showErrors, scrollToErrorAlert } from './form.js';

// redraw - retrieves the latest lists of observations + users
//  from the server and emits an event called 'modelUpdated'
const redraw = () => {
    Model.update_observations();
    Model.update_users();
}

// calls redraw() whenever the window is loaded
window.addEventListener('load', () => {
    redraw();
});

// calls redraw() whenever the page's hash is changed
window.addEventListener('hashchange', () => {
    redraw();
});

// displays the page according to its hash
//  whenever the event 'modelUpdated' is dispatched
window.addEventListener('modelUpdated', e => {

    const hash = window.location.hash;

    // '' => displays Main Page
    if (hash === '') {
        styleActiveTab('');
        const observations = e.detail.get_recent_observations(10);
        const users = e.detail.get_user_leaderboard().slice(0, 10);
        views.homeView('target', { observations, users });
        setTitle();
    } else {
        // uses split_hash() to get the path and id (if any) of the URL 
        const path = split_hash(hash).path;
        const id = split_hash(hash).id;
        
        styleActiveTab(`#!/${path}`);

        if (path === 'observations') {

            // '#!/observations' => displays Observation List View
            if (!id) {
                views.listObservationsView('target', e.detail.get_recent_observations(e.detail.get_observations().length));
                setTitle('List of Observations');
            }
            
            // '#!/observations/<id>' => displays Observation Detail View if observation exists
            //  otherwise displays a 404 error page
            else {
                const observation = e.detail.get_observation(id);
                if (observation) {
                    const user = e.detail.get_user(observation.participant);
                    views.observationView('target', { observation, user });
                    setTitle(`${observation.formatted_timestamp}`);
                } else {
                    views.error404View('target', 'observation');
                    setTitle('Observation Not Found');
                }
            }
        }

        if (path === 'users') {

            // '#!/users' => displays Leaderboard View
            if (!id) {
                views.listUsersView('target', e.detail.get_user_leaderboard());
                setTitle('User Leaderboard');
            }
            
            // '#!/users/<id>' => displays User Profile View if user exists
            //  otherwise displays a 404 error page
            else {
                const user = e.detail.get_user(id);
                if (user) {
                    const observations = e.detail.get_user_observations(id);
                    const plural = observations.length !== 1;
                    views.userView('target', { user, observations, plural });
                    setTitle(`${user.first_name} ${user.last_name}'s Profile`);
                } else {
                    views.error404View('target', 'user');
                    setTitle('User Not Found');
                }
            }
        }

        // '#!/submit' => displays Observation Form
        if (path === 'submit') {
            views.observationFormView('target');
            observationFormSubmit(e);
            setTitle('Add a new observation');
        }
    }

});

// redirects the user to User Profile View if form submission is successful
//  otherwise display the errors so the user can fix them
window.addEventListener('observationAdded', e => {

    // status is 'success' => redirects to User Profile View
    if (e.detail.status === 'success') {
        window.location = `#!/users/${e.detail.observation.participant}`;
    }

    // status is 'failed' => shows errors, displays Error Alert View 
    //  and scrolls to it
    if (e.detail.status === 'failed') {
        showErrors(e.detail.errors);
        views.errorAlertView('error-alert');
        scrollToErrorAlert();
        setTitle('Form Submission Failed');
    }
    
});
