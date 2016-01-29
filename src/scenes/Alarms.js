import React, { Component, View, Text, TouchableHighlight } from 'react-native';
import { Subheader, Divider, Card, Button, COLOR, TYPO } from 'react-native-material-design';

import AppStore from '../stores/AppStore';
import AppActions from '../actions/AppActions';

export default class Alarms extends Component {

    constructor(props) {
        super(props);
        var s = AppStore.getState();

        this.state = {
            title: s.routeName,
            theme: s.theme,
            alarms: s.alarms,
            alarmsExist: s.alarmsExist,
            alarmCount: s.alarmCount
        };
    }

    onReady(data){
        console.log('--- onReady Triggered ---');
        console.log(data)
    }

    componentDidMount() {
        AppStore.listen(this.handleAppStore);
    }

    componentWillUnmount() {
        AppStore.unlisten(this.handleAppStore);
    }

    handleAppStore =(store)=> {
        this.setState({
            title: store.routeName,
            theme: store.theme,
            alarms: store.alarms,
            alarmsExist: store.alarmsExist,
            alarmCount: store.alarmCount
        });
    }

    navigateToAlarmView=(id)=> {
        var Alarm = require('./Alarm').default;
        var alarmId = (id?id:null);
        this.props.navigator.push({
            name: 'Alarm',
            id: alarmId,
            component: Alarm
        });
    }

    handleAlarmCreateClick=()=> {
        this.navigateToAlarmView();
    }

    handleAlarmEditClick=(alarm)=> {
        AppActions.updateSelectedAlarm(alarm);
        this.navigateToAlarmView(alarm.id);
    }

    renderNoAlarmsView=()=> {
        return (
          <View style={styles.container}>
            <Card>
                <Card.Body>
                   <Text style={[COLOR.paperGrey500]}>No alarms exist. To continue create an alarm:</Text>
                </Card.Body>
                <Card.Actions>
                    <Button primary={this.state.theme} value="CREATE ALARM" onPress={this.handleAlarmCreateClick.bind(this)} />
                </Card.Actions>
            </Card>
          </View>
        );
    }

    renderAlarmView=(rowData)=> {
        var alarm = rowData;
        return (
           <TouchableHighlight key={alarm.id} onPress={() => this.handleAlarmEditClick(alarm)}>
                <View>
                       <View style={styles.listviewrow}>
                            <View style={[styles.listviewcolumn, {width: 200}]}>
                                <Text style={[COLOR.paperGrey800]}>{alarm.name}</Text>
                            </View>
                            <View style={[styles.listviewcolumn, {width: 150}]}>
                                 {Object.keys(alarm.days).map((dayKey) => (
                                    <Text key={alarm.days[dayKey]} style={[COLOR.paperGrey500]}>{alarm.days[dayKey]}, </Text>
                                  ))}
                            </View>
                      </View>
                       <View style={styles.listviewrow}>
                            <View style={[styles.listviewcolumn, {width: 100}]}>
                                <Text style={[COLOR.paperGrey500]}>Enabled: {alarm.enabled.toString()}</Text>
                            </View>
                            <View style={[styles.listviewcolumn, {width: 150}]}>
                                <Text style={[COLOR.paperGrey500]}>Recurring: {alarm.recurring.toString()}</Text>
                            </View>
                            <View style={[styles.listviewcolumn, {width: 100}]}>
                                <Text style={[COLOR.paperGrey500]}>{alarm.hour}:{alarm.minute} - {alarm.meridiem}</Text>
                            </View>
                       </View>
                       <Divider />
                </View>
           </TouchableHighlight>
        );
    }

    render= () => {
        if (!this.state || !this.state.alarmsExist) {
            return this.renderNoAlarmsView();
        }

        return (
              <View style={styles.container}>
                <Card>
                    <Card.Body>
                       {Object.keys(this.state.alarms).map((alarmKey) => (
                            this.renderAlarmView(this.state.alarms[alarmKey])
                        ))}
                    </Card.Body>
                    <Card.Actions>
                        <Button primary={this.state.theme} raised={true} value="CREATE ALARM" onPress={this.handleAlarmCreateClick.bind(this)} />
                    </Card.Actions>
                </Card>
              </View>
        );

    }
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    listview: {
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#ffffff'
    },
    listviewrow:{
         flexDirection:'row'
    },
    listviewcolumn:{
         flexDirection:'row',
         height: 40
    },
    separator: {
        height: 2,
        flexDirection:'row',
        backgroundColor: '#CCCCCC'
    },
    alarmname: {
        fontSize: 20,
        textAlign: 'left',
    },
    alarmrecurring: {
        textAlign: 'center',
    }
};