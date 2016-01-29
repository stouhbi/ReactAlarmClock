import React, { Component, PropTypes, View, Text, Image } from 'react-native';
import AppActions from '../actions/AppActions';
import AppStore from '../stores/AppStore';

import { Avatar, Drawer, Divider, COLOR, TYPO } from 'react-native-material-design';

export default class Navigation extends Component {

    static contextTypes = {
        drawer: PropTypes.object.isRequired,
        navigator: PropTypes.object.isRequired
    };

    changeScene = (name, title) => {
        const { drawer, navigator } = this.context;

        if (AppStore.getState().routeName !== name) {
            try {
                let component;

                switch (name) {
                    case 'Alarms':
                        component = require('./Alarms').default;
                        break;
                    case 'Alarm':
                        component = require('./Alarm').default;
                        break;
                    case 'Themes':
                        component = require('./Themes').default;
                        break;
                    case 'About':
                        component = require('./About').default;
                        break;
                    default:
                        console.warn('No scene found');
                        break;
                }

                if (component) {
                    AppActions.updateRouteName(title || name);
                    navigator.replace({ name, component: component });
                    drawer.closeDrawer();
                }

            } catch (e) {
                console.warn('An error occurred loading the scene:', e);
            }
        } else {
            drawer.closeDrawer();
        }
    };

    render() {
        return (
            <Drawer theme='light'>
                <Drawer.Header image={<Image source={require('./../img/logo.png')} />}>
                    <View style={styles.header}>
                        <Text style={[styles.text, COLOR.paperGrey50, TYPO.paperFontSubhead]}>React Native Alarm Clock</Text>
                    </View>
                </Drawer.Header>

                <Drawer.Item
                    icon="alarm"
                    value="Alarms"
                    onPress={() => this.changeScene('Alarms')}
                />
                <Drawer.Item
                    icon="help"
                    value="About"
                    onPress={() => this.changeScene('About')}
                />
                <Divider />
                <Drawer.Subheader value="Settings" />
                <Drawer.Item
                    icon="invert-colors"
                    value="Change Theme"
                    onPress={() => this.changeScene('Themes', 'Change Theme')}
                />
            </Drawer>
        );
    }
}

const styles = {
    header: {
        paddingTop: 16
    },
    text: {
        marginTop: 100,
        marginLeft: 40
    }
};