export { Model };

/* 
 * Model class to support the Citizen Science application
 * this class provides an interface to the web API and a local
 * store of data that the application can refer to.
 * The API generates two different events:
 *   "modelUpdated" event when new data has been retrieved from the API
 *   "observationAdded" event when a request to add a new observation returns
 */

const Model = {

    observations_url: '/api/observations',
    users_url: '/api/users',

    // this will hold the data stored in the model
    data: {
        observations: [],
        users: []
    },

    // update_users - retrieve the latest list of users 
    //    from the server API
    // when the request is resolved, creates a "modelUpdated" event 
    // with the model as the event detail
    update_users: function () {
        fetch(this.users_url)
            .then(res => res.json())
            .then(data => {
                this.data.users = data;
                window.dispatchEvent(new CustomEvent('modelUpdated', {
                    detail: this
                }));
            })
            .catch(err => console.log(err));
    },

    // update_observations - retrieve the latest list of observations
    //   from the server API
    // when the request is resolved, creates a "modelUpdated" event 
    // with the model as the event detail
    update_observations: function () {
        fetch(this.observations_url)
            .then(res => res.json())
            .then(data => {
                this.data.observations = data;
                window.dispatchEvent(new CustomEvent('modelUpdated', {
                    detail: this
                }));
            })
            .catch(err => console.log(err));
    },

    // get_observations - return an array of observation objects
    get_observations: function () {
        return this.data.observations;
    },

    // set_observations - set the array of observations
    set_observations: function (observations) {
        this.data.observations = observations;
    },

    // get_observation - return a single observation given its id
    //  and add a new property formatted_timestamp to that object
    //  return null if the observation with that id does not exist
    get_observation: function (observationid) {
        const observation = this.data.observations[this.data.observations.findIndex(observation => Number(observation.id) === Number(observationid))] || null;
        if (observation)
            observation.formatted_timestamp = this.format_timestamp(observation.timestamp);
        return observation;
    },

    // add_observation - add a new observation by submitting a request
    //   to the server API
    //  formData is a FormData object containing all fields in the observation object
    // when the request is resolved, creates an "observationAdded" event
    //  with the response from the server as the detail
    add_observation: function (formData) {
        fetch(this.observations_url, {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                window.dispatchEvent(new CustomEvent('observationAdded', {
                    detail: data
                }));
            })
            .catch(err => console.log(err));
    },

    // get_user_observations - return just the observations for
    //   one user as an array, ordered by timestamp, most recent first
    //   and add a new property formatted_timestamp to each observation object
    get_user_observations: function (userid) {
        let user_observations = this.data.observations
            .filter(observation => Number(observation.participant) === Number(userid))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        user_observations.forEach(observation => {
            observation.formatted_timestamp = this.format_timestamp(observation.timestamp);
        });
        return user_observations;
    },

    // get_recent_observations - return the N most recent
    //  observations, ordered by timestamp, most recent first
    //  and add a new property formatted_timestamp to each observation object
    get_recent_observations: function (N) {
        let recent_observations = this.data.observations
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, N);
        recent_observations.forEach(observation => {
            observation.formatted_timestamp = this.format_timestamp(observation.timestamp);
        });
        return recent_observations;
    },

    /* 
     * Users
     */
    // get_users - return the array of users
    get_users: function () {
        return this.data.users;
    },

    // set_users - set the array of users
    set_users: function (users) {
        this.data.users = users;
    },

    // get_user - return the details of a single user given the user id
    //  return null if the user with that id does not exist
    get_user: function (userid) {
        return this.data.users[this.data.users.findIndex(user => Number(user.id) === Number(userid))] || null;
    },

    // get_user_leaderboard - return the array of users 
    //  in order of the number of observations they have made 
    //  and add a new property rank to each user object
    get_user_leaderboard: function () {

        // create an array of the numbers of observations by every user,
        //  sort it and make it a set
        let numbers_of_observations = [];
        this.get_users().forEach(user => {
            numbers_of_observations.push(this.get_user_observations(user.id).length);
        });
        numbers_of_observations.sort((a, b) => b - a);
        numbers_of_observations = new Set(numbers_of_observations);

        // create an array of users whose numbers of observations
        //  correspond to the array numbers_of_observations
        //  and add a new property number_of_observations to each user object
        let user_leaderboard = [];
        numbers_of_observations.forEach(number_of_observations => {
            this.get_users().forEach(user => {
                if (this.get_user_observations(user.id).length === number_of_observations) {
                    user.number_of_observations = number_of_observations;
                    user_leaderboard.push(user);
                }
            });
        });

        // add a new property rank to each user object
        //  in the array user_leaderboard corresponding
        //  to their number_of_observations property
        //  in case of a tie, users with the same number_of_observations
        //  property will all have the highest rank possible
        user_leaderboard.forEach(user => user.rank = user_leaderboard.findIndex(first => first.number_of_observations === user.number_of_observations) + 1);

        return user_leaderboard;
    },

    // format_timestamp - formats the timestamp in a readable way
    //  timestamp - a timestamp string that needs to be formatted
    format_timestamp: function (timestamp) {
        const date = new Date(timestamp);
        const formatted_timestamp = `${date.toDateString()}, ${date.toTimeString().slice(0, 8)}`;
        return formatted_timestamp;
    }

};
