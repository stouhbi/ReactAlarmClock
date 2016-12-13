import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Platform,
  PickerIOS,
  TextInput
} from 'react-native';
import { Card, Subheader, Divider, CheckboxGroup, Checkbox, RadioButtonGroup, Button, COLOR } from 'react-native-material-design';
import PickerAndroid from 'react-native-picker-android';
let Picker = Platform.OS === 'ios' ? PickerIOS : PickerAndroid;
let PickerItem = Picker.Item;
import Alarms from './Alarms';
import AppStore from '../stores/AppStore';
import AppActions from '../actions/AppActions';

class Alarm extends Component {

    constructor(props) {
        super(props);
        this.alarmId = this.handleGetAlarmIdFromRoute(this.props);
        this.alarm = null;
    }

    handleGetAlarmIdFromRoute=(props)=>{
        if(props && props && props.route && props.route.id){
            return props.route.id;
        }
        return null;
    }

    componentDidMount() {
        AppStore.listen(this.handleAppStore);
    }

    componentWillUnmount() {
        AppStore.unlisten(this.handleAppStore);
    }

    handleAppStore =(store)=> {
        var crap = true;
        if(this.alarmId){
            var alarm = store.handleGetAlarm(this.alarmId).then((alarm)=>{
                this.setState({
                    alarm: alarm
                });
            })
        }
    }

    handleAlarmSaveClick() {
         AppActions.upsertAlarm(this.alarm);
    }

    setAlarmName(name) {
        if(name){
            this.alarm.name = name;
        } else {
            this.alarm.name = null;
        }
    }

    toggleAlarmRecurring() {
         this.alarm.recurring = ! this.alarm.recurring;
    }

    toggleAlarmEnabled() {
         this.alarm.enabled = ! this.alarm.enabled;
    }

    generateGuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    createAlarm(defaultDays, defaultHour, defaultMeridiem) {
        var alarm = {
            id: this.generateGuid()
            ,name: null
            ,days: defaultDays
            ,hour: defaultHour
            ,minute: '00' // DEFAULTMINUTE;
            ,meridiem: defaultMeridiem
            ,recurring: true
            ,enabled: true
        };

        return alarm;
    }

    navigateToAlarmsView=(id)=>{
        var Alarms = Alarms;
        var alarmId = (id?id:null);
        this.props.navigator.push({
            name: 'Alarms',
            id: alarmId,
            component: Alarms
        });
    }

    handleReturnToAlarmsClick=()=> {
        this.navigateToAlarmsView();
    }

    handleDeleteAlarmsClick=()=> {
        if(this.alarmId){
            // TODO: Message user via: https://github.com/dabit3/react-native-toasts
            AppActions.deleteAlarm(this.alarmId).then(()=>{
                this.navigateToAlarmsView(this.alarmId);
            });
        }
    }

    render() {
        var appStore = AppStore.getState()
        const theme = appStore.theme;
        const booleanCollection = appStore.booleanCollection;
        const meridiems = appStore.meridiems;
        const days = appStore.days;
        const hours = appStore.hours;
        const minutes = appStore.minutes;
        const defaultDays = appStore.defaultDays;
        const defaultHour = appStore.defaultHour;
        const defaultMeridiem = appStore.defaultMeridiem;

        var deleteButton;
        if(!appStore.selectedAlarm){
            this.alarm = this.createAlarm(defaultDays, defaultHour, defaultMeridiem);
        } else {
            this.alarm = appStore.selectedAlarm;
            deleteButton = <Button value="DELETE" raised={true} primary={theme} onPress={this.handleDeleteAlarmsClick.bind(this)}/>
        }

        return (
            <View>
                <Card>
                    <Card.Body>

                        <Subheader text="Name" />
                        <TextInput
                            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(text) => this.setAlarmName(text)}
                            value={this.alarm.name}
                          />
                        <Divider />
                        <Subheader text="Days" />
                        <CheckboxGroup
                            primary={theme}
                            checked={this.alarm.days}
                            items={days}
                        />
                        <Divider />
                        <Subheader text="Time" />
                        <View style={styles.timepickerrow}>
                          <View style={[styles.box, {width: 90}]}>
                             <Picker pickerStyle={styles.timepicker}
                                itemStyle={styles.timepickeritem}
                                selectedValue={this.alarm.hour}
                                >
                                {Object.keys(hours).map((hourKey) => (
                                    <PickerItem
                                        key={hourKey}
                                        value={hours[hourKey].value}
                                        label={hours[hourKey].label}
                                    />
                                ))}
                            </Picker>
                          </View>
                          <View style={[styles.box, {width: 30}]}>
                            <Text style={styles.timepickerseparator}>:</Text>
                          </View>
                          <View style={[styles.box, {width: 90}]}>
                            <Picker pickerStyle={styles.timepicker}
                                itemStyle={styles.timepickeritem}
                                selectedValue={this.alarm.minute}>
                                {Object.keys(minutes).map((minuteKey) => (
                                    <PickerItem
                                        key={minuteKey}
                                        value={minutes[minuteKey].value}
                                        label={minutes[minuteKey].label}
                                    />
                                ))}
                            </Picker>
                          </View>
                          <View style={[styles.timepickermeridiemrow, {width: 100}]}>
                              <RadioButtonGroup
                                  primary={theme}
                                  selected={this.alarm.meridiem}
                                  items={meridiems}
                              />
                          </View>
                        </View>
                        <Divider />
                        <Subheader text="Recurring" />
                        <Checkbox checked={this.alarm.recurring}
                            primary={theme}
                            value="true"
                            label="Should occur each week?"
                            onCheck={this.toggleAlarmRecurring.bind(this)} />
                        <Subheader text="Enabled ?" />
                        <Checkbox checked={this.alarm.enabled}
                            primary={theme}
                            value="true"
                            label="Trigger alarm on selected days/times?"
                            onCheck={this.toggleAlarmEnabled.bind(this)} />
                    </Card.Body>
                    <Card.Actions position="right">
                        {deleteButton}
                        <Button value="RETURN TO ALARMS" raised={true} primary={theme} onPress={this.handleReturnToAlarmsClick.bind(this)}/>
                        <Button value="SAVE" raised={true} primary={theme} onPress={this.handleAlarmSaveClick.bind(this)}/>
                    </Card.Actions>
                </Card>
            </View>
        );
    }
}
const styles = {
    timepickerrow:{
         flexDirection:'row'
    },
    timepicker: {
        width: 100,
        height: 90,
        backgroundColor: '#ffffff',
    },
    timepickerseparator: {
        fontSize: 30,
        marginTop: 20,
        width: 30,
        textAlign: 'center',
    },
    timepickeritem: {
        fontSize: 30,
        width: 90,
        textAlign: 'center',
    },
     timepickermeridiemrow: {
        flexDirection:'row',
        marginTop:0,
        padding: 5,
        margin: 0
    }
};
