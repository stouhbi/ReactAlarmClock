import alt from '../alt';

class AppActions {

    updateRouteName(name) {
        return name;
    }

    updateTheme(name) {
        return name;
    }

    updateSelectedAlarm(alarm) {
         return alarm;
    }

    createAlarm() { }

    getAlarms() { }

    getAlarm(id) { }

    deleteAlarm(id) {

    }

    upsertAlarm(alarm) {
        return alarm;
    }

}

export default alt.createActions(AppActions);