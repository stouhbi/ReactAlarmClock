import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Toolbar as MaterialToolbar } from 'react-native-material-design';
import AppStore from '../stores/AppStore';

class Toolbar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: AppStore.getState().routeName,
            theme: AppStore.getState().theme,
            alarms: AppStore.getState().alarms,
            alarmsExist: AppStore.getState().alarmsExist,
            alarmCount: AppStore.getState().alarmCount
        };
    }

    increment = () => {

    }

    componentDidMount = () => {
        AppStore.listen(this.handleAppStore);
    }

    handleAppStore = (store) => {
        var test = true;
        this.setState({
            title: store.routeName,
            theme: store.theme,
            alarms: store.alarms,
            alarmsExist: store.alarmsExist,
            alarmCount: store.alarmCount
        });
    }

    static propTypes = {
        onIconPress: PropTypes.func.isRequired
    }

    render() {
        const { title, theme, counter, alarmCount } = this.state;
        const { onIconPress } = this.props;

        return (
            <MaterialToolbar
                title={title || 'Alarm Clock'}
                primary={theme}
                icon='menu'
                onIconPress={onIconPress}
                actions={[{
                    icon: 'alarm',
                    counter: alarmCount,
                    onPress: this.increment
                }]}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0
                }}
            />
        );
    }
}
