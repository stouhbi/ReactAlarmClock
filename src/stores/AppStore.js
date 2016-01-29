import { AsyncStorage } from 'react-native';
import alt from '../alt';
import AppActions from '../actions/AppActions';

const THEMEKEY = '@Storage:theme';
const DEFAULTTHEME = 'paperGrey';
const DAYS = [{key: 'sun', value: 'sun', label: 'Sunday' }
    , { key: 'mon', value: 'mon', label: 'Monday' }
    , { key: 'tue', value: 'tue', label: 'Tuesday' }
    , { key: 'wed', value: 'wed', label: 'Wednesday' }
    , { key: 'thu', value: 'thu', label: 'Thursday' }
    , { key: 'fri', value: 'fri', label: 'Friday' }
    , { key: 'sat', value: 'sat', label: 'Saturday' }];
const DEFAULTDAYS = ['mon', 'tue', 'wed', 'thu', 'fri'];
const DEFAULTHOUR = 8;
const DEFAULTMINUTE = '00';
const DEFAULTMERIDIEM = 'AM';

class AppStore {

    constructor() {
        this.routeName = '';
        this.theme = null;
        // Alarms state (data for all alarms and app as whole)
        this.alarms = null; // set of all alarms
        this.alarmCount = 0;
        this.alarmsExist = false;
        this.selectedAlarm = null; // currently selected alarm

        // Alarm state (data needed for each alarm)
        this.booleanCollection = null;
        this.days = null;
        this.hours = null;
        this.minutes = null;
        this.defaultHour = null;
        this.defaultDays = null;
        this.defaultMeridiem = null;
        this.meridiems = null;

        this.loadProps();
        this.loadTheme();
        this.loadAlarms();

        this.bindListeners({
            handleUpdateRouteName: AppActions.UPDATE_ROUTE_NAME,
            handleUpdateTheme: AppActions.UPDATE_THEME,
            handleUpdateSelectedAlarm: AppActions.UPDATE_SELECTED_ALARM,
            handleCreateAlarm: AppActions.CREATE_ALARM,
            handleGetAlarm: AppActions.GET_ALARM,
            handleGetAlarms: AppActions.GET_ALARMS,
            handleUpsertAlarm: AppActions.UPSERT_ALARM,
            handleDeleteAlarm: AppActions.DELETE_ALARM
        });
    }

    loadProps = () => {
        this.meridiems = this.getMeridiems();
        this.booleanCollection = this.getBooleanCollection();
        this.days = this.getDays();
        this.hours = this.getHours(false);
        this.minutes = this.getMinutes();
        this.defaultDays = this.getDefaultDays();
        this.defaultHour = this.getDefaultHour();
        this.defaultMeridiem = this.getDefaultMeridiems();
    }

    loadTheme = () => {
        AsyncStorage.getItem(THEMEKEY).then((value) => {
            this.theme = value || DEFAULTTHEME;
        });
    }

    loadAlarms = () => {
        this.loadAlarmsSynchronously((alarms)=>{
            this.alarms = alarms;
            this.alarmCount = (alarms != null && alarms.length) ? alarms.length : 0;
            this.alarmsExist = (this.alarmCount > 0);
        });
    }

    loadAlarmsSynchronously = (cb) => {
        AsyncStorage.getAllKeys().then((ks) => {
            var allAlarms = [];
            var total = ks.length, counter = 0;
            ks.forEach((k) => {
                return this.loadAlarmAsync(k).then((alarm)=>{
                    counter++;
                    if(alarm!=null){
                        allAlarms.push(alarm);
                    }
                    if (counter === total) {
                        cb(allAlarms);
                    }
                })
            });
        });
    }

    loadAlarmAsync = (id) => {
        return AsyncStorage.getItem(id).then((val) => {
            try {
                var jsonVal = JSON.parse(val); // Attempt convert string to JSON - Deal with AsyncStorage ONLY able to store strings
                if(jsonVal.id){
                    // If object can be parsed and has an id prop it is an alarm
                   return jsonVal;
                }
            }catch(e){
                return null;
            }
        });
    }

    loadAlarmData = (cb) => {
       this.loadAlarmsSynchronously((alarms)=>{
            var alarmCount = (alarms != null && alarms.length) ? alarms.length : 0;
            var alarmsExist = (alarmCount > 0);
            var alarmData = {
                alarms: alarms,
                alarmsExist: alarmsExist,
                alarmCount: alarmCount
            }
            cb(alarmData);
        });
    }

    handleUpdateRouteName(name) {
        this.routeName = name;
    }

    handleUpdateTheme(name) {
        this.theme = name;
        AsyncStorage.setItem(THEMEKEY, name);
    }

    getMeridiems () {
        return [{
           key: 'AM', value: 'AM', label: 'AM'
        }, {
           key: 'PM', value: 'PM', label: 'PM'
        }];
    }

    getDefaultMeridiems =()=> {
        return DEFAULTMERIDIEM;
    }

    getBooleanCollection () {
        return [{
           key: 'true', value: true, label: 'Yes'
        }, {
           key: 'false', value: false, label: 'No'
        }];
    }

    getDays () {
        return DAYS;
    }

    getDefaultDays =()=> {
        return DEFAULTDAYS;
    }

    getDefaultHour =()=> {
        return DEFAULTHOUR;
    }

    getHours(use24HourClock) {
        var numHours = (use24HourClock ? 24 : 12);
        var hours = this.createNumberedCollection(1, numHours);
        return hours;
    }

    getMinutes() {
        var minutes = this.createNumberedCollection(0, 59);
        return minutes;
    }

    createNumberedCollection (start, numItems) {
        var items = [];
        for(var i=start;i<=numItems;i++){
            var label = i.toString();
            if(i<10){
                label = '0' + label;
            }
            items.push({key: label, value: i, label: label});
        }
        return items;
    }

    static generateGuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    createAlarm() {
        var alarm = {};
        alarm.id = this.generateGuid();
        alarm.name = null;
        alarm.days = this.getDefaultDays();
        alarm.hour = this.getDefaultHour();
        alarm.minute = '00'; // DEFAULTMINUTE;
        alarm.meridiem = 'AM'; //DEFAULTAMPM;
        alarm.recurring = true;
        alarm.enabled = true;
        return alarm;
    }

    handleCreateAlarm = () => {
        return this.createAlarm();
    }

    handleGetAlarms = () => {
        return this.loadAlarms();
    }

    handleUpdateSelectedAlarm (alarm) {
        this.selectedAlarm = alarm;
    }

    handleGetAlarm = (id) => {
        return AsyncStorage.getItem(id).then((value) => {
            try {
                return value.json();
            }
            catch(e){
                console.log('handleGetAlarm error', e);
                return null;
            }
        });
    }

    handleDeleteAlarm = (id) => {
        return AsyncStorage.removeItem(id, ()=>{
            this.loadAlarms();
        });
    }

    handleUpsertAlarm = (alarm) => {
        this.selectedAlarm = alarm;
        var alarmAsString = JSON.stringify(alarm); // Deal with AsyncStorage ONLY able to store strings
        return AsyncStorage.setItem(alarm.id, alarmAsString, ()=>{
            this.loadAlarms();
        });
    }

}

const store = alt.createStore(AppStore, 'AppStore')
export default store;